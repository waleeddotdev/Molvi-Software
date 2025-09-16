import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- STYLING (Reusing the same theme) ---
const theme = {
    primary: '#4F46E5',
    textPrimary: '#FFFFFF',
    textSecondary: '#1F2937',
    textMuted: '#6B7280',
    backgroundLight: '#F3F4F6',
    fontBold: 'Helvetica-Bold',
    fontRegular: 'Helvetica',
};

const styles = StyleSheet.create({
    page: {
        fontFamily: theme.fontRegular,
        fontSize: 10,
        backgroundColor: '#ffffff',
        padding: 40,
    },
    // --- HEADER ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
    },
    headerLogo: {
        fontFamily: theme.fontBold,
        fontSize: 20,
        letterSpacing: 1,
    },
    headerTitle: {
        fontFamily: theme.fontBold,
        fontSize: 28,
    },
    // --- CLIENT & STATEMENT DETAILS ---
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
        lineHeight: 1.4,
    },
    clientDetails: {
        width: '50%',
    },
    clientName: {
        fontFamily: theme.fontBold,
        fontSize: 12,
    },
    statementDetails: {
        textAlign: 'right',
    },
    statementLabel: {
        fontFamily: theme.fontBold,
    },
    // --- TABLE ---
    table: {
        display: 'table',
        width: 'auto',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        fontFamily: theme.fontBold,
        fontSize: 11,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableRowAlt: {
        backgroundColor: theme.backgroundLight,
    },
    tableColHeader: {
        padding: 8,
    },
    tableCol: {
        padding: 8,
    },
    colDate: { width: '15%' },
    colDesc: { width: '40%' },
    colDebit: { width: '15%', textAlign: 'right' },
    colCredit: { width: '15%', textAlign: 'right' },
    colBalance: { width: '15%', textAlign: 'right' },
    // --- SUMMARY ---
    summaryContainer: {
        alignSelf: 'flex-end',
        width: '45%', // A bit wider for the summary
        marginTop: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    summaryLabel: {
        fontFamily: theme.fontBold,
    },
    balanceDue: {
        backgroundColor: theme.primary,
        borderRadius: 5,
        color: theme.textPrimary,
        fontFamily: theme.fontBold,
    },
    // --- FOOTER ---
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: theme.textMuted,
        fontSize: 9,
    },
});

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A';
const formatCurrency = (amount) => amount ? `${Number(amount).toFixed(2)}` : '-';

const Ledger = ({ ledgerData }) => {
    // --- Data Preparation Logic ---
    const { client, invoices = [], payments = [] } = ledgerData || {};

    // 1. Combine invoices and payments into a single transaction list
    const transactions = [
        ...invoices.map(inv => ({
            date: inv.issue_date,
            description: `Invoice #${inv.invoice_number}`,
            debit: inv.total_amount,
            credit: 0,
        })),
        ...payments.map(pay => ({
            date: pay.payment_date,
            description: `Payment Received (${pay.payment_method})`,
            debit: 0,
            credit: pay.amount_paid,
        }))
    ];

    // 2. Sort transactions chronologically
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Calculate running balance and totals
    let runningBalance = 0;
    const transactionsWithBalance = transactions.map(tx => {
        runningBalance += (tx.debit || 0) - (tx.credit || 0);
        return { ...tx, balance: runningBalance };
    });

    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amount_paid, 0);
    const balanceDue = totalBilled - totalPaid;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <Text style={styles.headerLogo}>YOUR LOGO</Text>
                    <Text style={styles.headerTitle}>STATEMENT</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.clientDetails}>
                        <Text style={styles.statementLabel}>Statement For:</Text>
                        <Text style={styles.clientName}>{client?.customer_name || 'N/A'}</Text>
                        <Text>{client?.address || ''}</Text>
                        <Text>{client?.phone_number || ''}</Text>
                    </View>
                    <View style={styles.statementDetails}>
                        <Text><Text style={styles.statementLabel}>Statement Date:</Text> {formatDate(new Date())}</Text>
                        {/* You can add a date range here if needed */}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableColHeader, styles.colDate]}>Date</Text>
                        <Text style={[styles.tableColHeader, styles.colDesc]}>Transaction</Text>
                        <Text style={[styles.tableColHeader, styles.colDebit]}>Billed</Text>
                        <Text style={[styles.tableColHeader, styles.colCredit]}>Paid</Text>
                        <Text style={[styles.tableColHeader, styles.colBalance]}>Balance</Text>
                    </View>
                    {transactionsWithBalance.map((tx, index) => (
                        <View style={[styles.tableRow, index % 2 !== 0 && styles.tableRowAlt]} key={index}>
                            <Text style={[styles.tableCol, styles.colDate]}>{formatDate(tx.date)}</Text>
                            <Text style={[styles.tableCol, styles.colDesc]}>{tx.description}</Text>
                            <Text style={[styles.tableCol, styles.colDebit]}>{formatCurrency(tx.debit)}</Text>
                            <Text style={[styles.tableCol, styles.colCredit]}>{formatCurrency(tx.credit)}</Text>
                            <Text style={[styles.tableCol, styles.colBalance]}>{formatCurrency(tx.balance)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.summaryLabel}>Total Billed</Text>
                        <Text>{formatCurrency(totalBilled)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.summaryLabel}>Total Paid</Text>
                        <Text>{formatCurrency(totalPaid)}</Text>
                    </View>
                    <View style={[styles.totalRow, styles.balanceDue]}>
                        <Text>Balance Due</Text>
                        <Text>{formatCurrency(balanceDue)}</Text>
                    </View>
                </View>

                <Text style={styles.footer} fixed>
                    Please contact us if you have any questions about this statement. Thank you!
                </Text>
            </Page>
        </Document>
    );
};

export default Ledger;