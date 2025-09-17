// File: app/dashboard/payments/AllPayments.js

"use server"

import { createClient } from '@/utils/supabase/server';
import PaymentItem from './PaymentItem';

const AllPayments = async () => {
    const supabase = await createClient();

    // Fetch payments and JOIN related data for display
    const { data: payments, error } = await supabase
        .from('payments')
        .select(`
            *,
            client_id:clients(customer_name),
            bank_account_id:bank_accounts(nickname)
        `)
        .order('payment_date', { ascending: false });

    if (error) {
        console.error("Error fetching payments:", error);
        return <p className="text-red-500 text-center">Failed to load payments.</p>;
    }

    return (
        <div className='space-y-3'>
            {payments?.map(payment => (
                <PaymentItem key={payment.id} payment={payment} />
            ))}
            {payments?.length === 0 && (
                <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                    <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No Payments Yet!</h2>
                    <p className="text-muted-foreground text-pretty max-w-[500px]">
                        You have not added any payments yet. Get started by adding a new payment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllPayments;