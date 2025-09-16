import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const theme = {
    primary: '#4F46E5', // A vibrant blue, similar to the image
    textPrimary: '#FFFFFF', // White text for headers
    textSecondary: '#1F2937', // Dark gray for body text
    textMuted: '#6B7280', // Lighter gray for less important text
    backgroundLight: '#F3F4F6', // Very light gray for alternating rows
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
        borderRadius: 5
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
    // --- COMPANY & INVOICE DETAILS ---
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        lineHeight: 1.1,
    },
    companyDetails: {
        width: '50%',
    },
    companyName: {
        fontFamily: theme.fontBold,
    },
    detailItem: {
        flexDirection: 'row',
    },
    detailLabel: {
        fontFamily: theme.fontBold,
        width: 60,
    },
    // --- BILL TO ---
    billToContainer: {
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontFamily: theme.fontBold,
        fontSize: 11,
        borderRadius: 5
    },
    billToDetails: {
        padding: 10,
        lineHeight: 1.1,
    },
    // --- TABLE ---
    table: {
        display: 'table',
        width: 'auto',
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        fontFamily: theme.fontBold,
        fontSize: 11,
        borderRadius: 5
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
    colQty: { width: '15%' },
    colDesc: { width: '50%' },
    colPrice: { width: '17.5%', textAlign: 'right' },
    colAmount: { width: '17.5%', textAlign: 'right' },
    // --- TOTALS ---
    totalsContainer: {
        alignSelf: 'flex-end',
        width: '35%',
        marginTop: 0, // Totals are integrated into the table flow
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    totalLabel: {
        textAlign: 'right',
    },
    totalValue: {
        textAlign: 'right',
    },
    balanceDue: {
        backgroundColor: theme.primary,
        borderRadius: 5,
        color: theme.textPrimary,
        fontFamily: theme.fontBold,
    },
    // --- FOOTER ---
    footer: {
        marginTop: 30,
    },
    footerText: {
        color: theme.textMuted,
        fontSize: 9,
        lineHeight: 1.1,
    },
    thankYou: {
        fontFamily: theme.fontBold,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
    },
});

// --- HELPER FUNCTION ---
const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A';

// --- DOCUMENT COMPONENT ---
const Invoice1 = ({ invoiceData }) => {
    // Defensive data object to prevent crashes from undefined values

    console.log('invoiceData:', invoiceData);

    const safeData = {
        invoiceNumber: invoiceData?.invoiceNumber || invoiceData?.invoice_number || 'N/A',
        issueDate: invoiceData?.issueDate || invoiceData?.issue_date || 'N/A',
        clientName: invoiceData?.client?.customer_name || 'Client Name',
        clientCompany: invoiceData?.client?.company_name || '', // Add these to your client data
        clientAddress: invoiceData?.client?.address || 'Client Address',
        clientPhone: invoiceData?.client?.phone_number || '',
        lineItems: invoiceData?.lineItems || invoiceData?.line_items || [],
        subtotal: invoiceData?.subtotal || invoiceData?.total_amount || 0,
        notes: invoiceData?.notes || '',
    };


    const balanceDue = safeData.subtotal;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerLogo}>LOGO</Text>
                    <Text style={styles.headerTitle}>INVOICE</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.companyDetails}>
                        <Text style={styles.companyName}>Molvi Company</Text>
                        <Text>123 Main Street</Text>
                        <Text>City, State ZIP</Text>
                        <Text><Text style={{ fontFamily: theme.fontBold }}>Phone:</Text> (555) 555-5555</Text>
                        <Text><Text style={{ fontFamily: theme.fontBold }}>Email:</Text> email@companyemail.com</Text>
                    </View>
                    <View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Invoice #:</Text>
                            <Text>{safeData.invoiceNumber}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Date:</Text>
                            <Text>{formatDate(safeData.issueDate)}</Text>
                        </View>

                    </View>
                </View>

                <View style={styles.billToContainer}>
                    <Text>Bill To:</Text>
                </View>
                <View style={styles.billToDetails}>
                    <Text>{safeData.clientName}</Text>
                    {safeData.clientCompany && <Text>{safeData.clientCompany}</Text>}
                    <Text>{safeData.clientAddress}</Text>
                    <Text>{safeData.clientPhone}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableColHeader, styles.colQty]}>Quantity</Text>
                        <Text style={[styles.tableColHeader, styles.colDesc]}>Description</Text>
                        <Text style={[styles.tableColHeader, styles.colPrice]}>Unit price</Text>
                        <Text style={[styles.tableColHeader, styles.colAmount]}>Amount</Text>
                    </View>
                    {safeData.lineItems.map((item, index) => {
                        const isAlt = index % 2 !== 0;
                        const quantity = Number(item?.quantity) || 0;
                        const price = Number(item?.price) || 0;
                        return (
                            <View style={[styles.tableRow, isAlt && styles.tableRowAlt]} key={item.id || index}>
                                <Text style={[styles.tableCol, styles.colQty]}>{quantity}</Text>
                                <Text style={[styles.tableCol, styles.colDesc]}>{item.product_name + " " + '(' + item.variant_name + ')' || 'N/A'}</Text>
                                <Text style={[styles.tableCol, styles.colPrice]}>PKR {price.toFixed(2)}</Text>
                                <Text style={[styles.tableCol, styles.colAmount]}>PKR {(quantity * price).toFixed(2)}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.totalsContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>PKR {safeData.subtotal.toFixed(2)}</Text>
                    </View>
                    {/* <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Credit</Text>
                        <Text style={styles.totalValue}>PKR {credit.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax</Text>
                        <Text style={styles.totalValue}>{(taxRate * 100).toFixed(2)}%</Text>
                    </View> */}
                    <View style={[styles.totalRow, styles.balanceDue]}>
                        <Text>Balance due</Text>
                        <Text>PKR {balanceDue.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{safeData.notes}</Text>
                    <Text style={styles.thankYou}>Thank you for your business!</Text>
                </View>
            </Page>
        </Document>
    );
};

export default Invoice1;