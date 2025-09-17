// File: app/dashboard/payments/AddPayment.js

"use client";

import { HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from "@/utils/supabase/client";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Combobox from '@/components/ui/combobox';

const Label = ({ children }) => <p className="text-sm font-medium text-right">{children}</p>;
const supabase = createClient(); // Create the client once

const AddPayment = () => {
    const router = useRouter();

    // --- State Management ---
    const [clients, setClients] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedBankAccount, setSelectedBankAccount] = useState('');

    const [amountPaid, setAmountPaid] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    // --- Data Fetching (No changes needed here) ---
    useEffect(() => {
        const fetchData = async () => {
            const { data: clientsData } = await supabase.from('clients').select('id, name:customer_name');
            const { data: banksData } = await supabase.from('bank_accounts').select('id, name:nickname');
            setClients(clientsData || []);
            setBankAccounts(banksData || []);
        };
        fetchData();
    }, []);

    // CHANGE 2: Update the reset function to use empty strings.
    const resetForm = () => {
        setSelectedClient('');
        setSelectedBankAccount('');
        setAmountPaid('');
        setPaymentMethod('');
        setPaymentDate(new Date());
        setNotes('');
    };

    const handleSavePayment = async () => {
        if (!selectedClient || !amountPaid || !paymentMethod || !paymentDate) {
            return toast.error("Please fill all required fields.");
        }

        const { error } = await supabase.from('payments').insert([{
            client_id: selectedClient.id,
            bank_account_id: paymentMethod === 'cash' ? null : selectedBankAccount.id,
            amount_paid: parseFloat(amountPaid),
            payment_method: paymentMethod,
            payment_date: paymentDate.toISOString().split('T')[0],
            notes: notes,
        }]);

        if (error) {
            console.error("Error saving payment:", error);
            return toast.error(error.message);
        }

        toast.success("Payment recorded successfully!");
        router.refresh();
        resetForm();
    };

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && resetForm()}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    Add Payment <HandCoins className="ml-1 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Record New Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Client:</Label>
                        <div className="col-span-3">
                            <Combobox items={clients} name="Client" selectedValue={selectedClient} onValueChange={setSelectedClient} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Amount Paid:</Label>
                        <Input id="amount" type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="col-span-3 !bg-card" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Method:</Label>
                        <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select payment method..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {paymentMethod !== 'cash' && paymentMethod !== '' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label>Bank Account:</Label>
                            <div className="col-span-3"><Combobox items={bankAccounts} name="Bank Account" selectedValue={selectedBankAccount} onValueChange={setSelectedBankAccount} /></div>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Payment Date:</Label>
                        <div className="col-span-3"><DatePicker value={paymentDate} onChange={setPaymentDate} /></div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label>Notes:</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3 !bg-card" placeholder="Optional notes..." />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <DialogClose asChild><Button type="submit" onClick={handleSavePayment}>Save Payment</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddPayment;