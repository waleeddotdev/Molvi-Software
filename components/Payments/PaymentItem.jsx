// File: app/dashboard/payments/PaymentItem.js

"use client";

import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount || 0);
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const PaymentItem = ({ payment }) => {
    const router = useRouter();
    // Destructuring with aliases for clarity, especially for joined data
    const { id, amount_paid, payment_date, payment_method, notes, client_id, bank_account_id } = payment;

    console.log("payment: ", payment)

    const handleDelete = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('payments').delete().eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Payment deleted.");
            router.refresh();
        }
    };

    // Note: The Edit dialog is omitted for brevity but would follow the same pattern as InventoryItem
    // You would create state for each field, an update handler, and a form in the dialog.

    return (
        <div className='px-4 py-3 hover:scale-[1.01] transition-transform duration-300 flex flex-row justify-between items-center shadow-md bg-background rounded-lg'>
            <div className='flex-1'>
                <p className='font-bold text-lg'>{client_id?.customer_name || 'N/A'} <span>{`(${ bank_account_id?.nickname})`}</span></p>
                <p className='text-xs text-muted-foreground italic'>{notes}</p>
            </div>
            <div className='flex flex-col md:flex-row items-end md:items-center gap-4'>
                <div className='text-right'>
                    <p className='text-lg font-semibold font-mono'>{formatCurrency(amount_paid)}</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(payment_date)} via {payment_method}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size={"icon"} variant={"destructive"}><Trash className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Delete Payment</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this payment of {formatCurrency(amount_paid)}? This cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                                <DialogClose asChild><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PaymentItem;