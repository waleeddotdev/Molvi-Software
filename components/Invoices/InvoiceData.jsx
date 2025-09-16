// File: app/dashboard/clients/[id]/InvoiceData.js

"use client";

import React, { useMemo } from 'react';
import { CircleDollarSign, CheckCircle, AlertCircle } from 'lucide-react';

// Helper function to format numbers as currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PKR',
    }).format(amount || 0);
};

// A reusable card component for consistent styling
const StatCard = ({ title, value, icon }) => {
    const IconComponent = icon;
    return (
        <div className="bg-background shadow-md p-6 rounded-xl">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-recoleta font-bold text-muted-foreground/50">{`${title}`}
                    {title === 'Balance Due' ? ` (${value >= 0 ? `Credit` : `Debit`})` : ''}
                </h3>
                <div className={`p-2 rounded-md`}>
                    <IconComponent className="h-6 w-6 text-foreground/50" />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold font-recoleta">{formatCurrency(value)}</p>
            </div>
        </div>
    );
};

const InvoiceData = ({ data }) => {
    const { invoices, payments, bank_accounts } = data;

    // Use useMemo to prevent recalculating on every render
    const { totalBalance, totalPaid, balanceDue } = useMemo(() => {
        if (!invoices || !payments) {
            return { totalBalance: 0, totalPaid: 0, balanceDue: 0 };
        }

        // Card 1: Calculate the total value of all invoices
        const totalBalance = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);

        // Card 2: Calculate the total amount paid from the payments table
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0);

        // Card 3: Calculate the remaining balance
        const balanceDue = totalBalance - totalPaid;

        return { totalBalance, totalPaid, balanceDue };
    }, [invoices, payments]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
                title="Total Balance"
                value={totalBalance}
                icon={CircleDollarSign}
            />
            <StatCard
                title="Total Paid"
                value={totalPaid}
                icon={CheckCircle}
            />
            <StatCard
                title="Balance Due"
                value={balanceDue}
                icon={AlertCircle}
            />
        </div>
    );
}

export default InvoiceData;