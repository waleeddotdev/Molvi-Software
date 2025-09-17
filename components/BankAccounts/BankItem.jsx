// File: app/banks/BankItem.js (example path)

"use client"

import { Button } from '../ui/button'
import { Landmark, Pencil, Trash } from 'lucide-react' // Using Landmark icon for banks
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
import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const BankItem = ({ bank }) => {
    // --- DESTRUCTURE PROPS from the 'bank' object ---
    const { nickname, bank_name, account_holder_name, account_number, id } = bank;
    const router = useRouter();

    // --- STATE MANAGEMENT for the edit form ---
    const [currentNickname, setNickname] = useState(nickname);
    const [currentBankName, setBankName] = useState(bank_name);
    const [currentHolderName, setHolderName] = useState(account_holder_name);
    const [currentAccountNumber, setAccountNumber] = useState(account_number);

    const handleUpdateBank = async () => {
        const supabase = createClient();
        // --- UPDATE LOGIC for 'bank_accounts' table ---
        const { error } = await supabase.from('bank_accounts').update({
            nickname: currentNickname,
            bank_name: currentBankName,
            account_holder_name: currentHolderName,
            account_number: currentAccountNumber,
        }).eq('id', id);

        if (error) {
            toast.error('Failed to update bank account.');
        } else {
            toast.success('Bank account updated successfully.');
        }
        router.refresh();
    };

    const handleDeleteBank = async () => {
        const supabase = createClient();
        // --- DELETE LOGIC for 'bank_accounts' table ---
        await supabase.from('bank_accounts').delete().eq('id', id);
        toast.success('Bank account deleted successfully.');
        router.refresh();
    }

    // Resets the form state if the user cancels editing
    const handleDialogChange = (isOpen) => {
        if (!isOpen) {
            setNickname(nickname);
            setBankName(bank_name);
            setHolderName(account_holder_name);
            setAccountNumber(account_number);
        }
    }

    return (
        <div className='px-4 hover:scale-[1.01] transition-transform duration-300 flex flex-row justify-between items-center py-3 shadow-md bg-background rounded-lg'>
            {/* --- DISPLAY LOGIC for bank details --- */}
            <div className='flex flex-row gap-4 items-center justify-center w-fit'>
                <div className='hidden sm:flex w-10 h-10 rounded-full bg-muted items-center justify-center'>
                    <Landmark className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className='font-recoleta text-lg font-extrabold '>{nickname} <span className='text-sm font-normal text-muted-foreground'>({bank_name})</span></p>
                    <p className='text-sm opacity-90'>{account_holder_name}</p>
                    <p className='text-sm opacity-70 font-mono'>{account_number}</p>
                </div>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
                {/* --- EDIT DIALOG --- */}
                <Dialog onOpenChange={handleDialogChange}>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"secondary"}><Pencil /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Bank Account</DialogTitle>
                            <DialogDescription>
                                Make changes to the bank account information here. Click 'Update' when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        {/* --- EDIT FORM for bank details --- */}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p className="text-right">Nickname:</p>
                                <Input
                                    placeholder="e.g., Main Checking"
                                    className="col-span-3 !bg-card"
                                    value={currentNickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p className="text-right">Bank Name:</p>
                                <Input
                                    placeholder="e.g., Meezan Bank"
                                    className="col-span-3 !bg-card"
                                    value={currentBankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p className="text-right">Holder:</p>
                                <Input
                                    placeholder="Account Holder Name"
                                    className="col-span-3 !bg-card"
                                    value={currentHolderName}
                                    onChange={(e) => setHolderName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p className="text-right">Number:</p>
                                <Input
                                    placeholder="Account Number or IBAN"
                                    className="col-span-3 !bg-card"
                                    value={currentAccountNumber}
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
                                <Button type="submit" onClick={handleUpdateBank}>Update</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* --- DELETE DIALOG --- */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"destructive"}><Trash /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Bank Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the account <span className='font-bold'>{nickname}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="destructive" type="submit" onClick={handleDeleteBank}>Delete</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default BankItem;