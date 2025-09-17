"use client";

import { Landmark } from 'lucide-react'; // Using a more appropriate icon
import { Button } from '../ui/button';
import { createClient } from "../../utils/supabase/client"
import { Input } from '../ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AddBank = () => {
    const router = useRouter();

    // --- STATE MANAGEMENT (Updated for bank accounts) ---
    const [nickname, setNickname] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const resetForm = () => {
        setNickname('');
        setBankName('');
        setAccountHolderName('');
        setAccountNumber('');
    };

    const handleAddNewBank = async () => {
        // --- VALIDATION (Updated for new fields) ---
        if (!nickname || !bankName || !accountHolderName || !accountNumber) {
            toast.error("All fields are required.");
            return;
        }

        const supabase = createClient();

        // --- DATABASE INSERTION (Updated for 'bank_accounts' table) ---
        const { error } = await supabase
            .from('bank_accounts')
            .insert([
                {
                    nickname: nickname,
                    bank_name: bankName,
                    account_holder_name: accountHolderName,
                    account_number: accountNumber,
                },
            ]);

        if (error) {
            console.error('Error adding new bank account:', error);
            toast.error('Failed to add bank account. Please try again.');
        } else {
            toast.success('Bank account added successfully.');
            resetForm(); // Reset the form fields on success
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className='flex flex-row justify-center items-center gap-2'>
                {/* Reset form state when the dialog is closed */}
                <Dialog onOpenChange={(isOpen) => !isOpen && resetForm()}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            Add Account <Landmark className="ml-1 h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Bank Account</DialogTitle>
                            <DialogDescription>
                                Please fill in the details of the new bank account. Click 'Add' when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        {/* --- FORM FIELDS (Updated for bank accounts) --- */}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="nickname" className="text-right">Nickname:</p>
                                <Input
                                    id="nickname"
                                    placeholder="e.g., Main Business Checking"
                                    className="col-span-3 !bg-card"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="bank-name" className="text-right">Bank Name:</p>
                                <Input
                                    id="bank-name"
                                    placeholder="e.g., Meezan Bank"
                                    className="col-span-3 !bg-card"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="account-holder" className="text-right">Holder:</p>
                                <Input
                                    id="account-holder"
                                    placeholder="Account Holder Name"
                                    className="col-span-3 !bg-card"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="account-number" className="text-right">Number:</p>
                                <Input
                                    id="account-number"
                                    placeholder="Account Number or IBAN"
                                    className="col-span-3 !bg-card"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" onClick={handleAddNewBank}>Add Account</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AddBank;