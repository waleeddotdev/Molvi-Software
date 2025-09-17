// File: app/providers/ProviderItem.js (example path)

"use client"

import { Button } from '../ui/button'
import { Pencil, Trash } from 'lucide-react'
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

// Renamed component and updated props to match the 'providers' table schema
const ProviderItem = ({ provider: { name, company_name, phone_number, address, id } }) => {

    // Renamed state variables for clarity
    const [providerName, setProviderName] = useState(name);
    const [companyName, setCompanyName] = useState(company_name);
    const [phoneNumber, setPhoneNumber] = useState(phone_number);
    const [newAddress, setAddress] = useState(address);
    const router = useRouter();

    const handleUpdateProvider = async () => {
        const supabase = createClient();
        // Changed: Update the 'providers' table with the correct column names
        const { error } = await supabase.from('providers').update({
            name: providerName,
            company_name: companyName,
            phone_number: phoneNumber,
            address: newAddress,
        }).eq('id', id);

        if (error) {
            toast.error('Failed to update provider. Please try again.');
        } else {
            toast.success('Provider updated successfully.');
        }
        router.refresh()
    };

    const handleDeleteProvider = async () => {
        const supabase = createClient();
        // Changed: Delete from the 'providers' table
        await supabase.from('providers').delete().eq('id', id);
        toast.success('Provider deleted successfully.');
        router.refresh()
    }

    return (
        <div className='px-4 hover:scale-[1.01] transition-transform duration-300 flex flex-row justify-between items-center py-2 shadow-xl bg-background rounded-lg'>
            <div className='flex flex-row gap-4 items-center justify-center w-fit'>
                <div className='hidden sm:inline'>
                    <img className='w-10 h-10 rounded-full' src={`https://api.dicebear.com/9.x/notionists/png?seed=${name}&backgroundColor=ffffff`} />
                </div>
                <div>
                    <p className='font-recoleta text-lg font-extrabold '>{name}  {company_name && ` (${company_name})`}</p>
                    <p className='text-sm opacity-70'>{phone_number}</p>
                    <p className='text-sm opacity-70'>{address}</p>
                </div>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
                <Dialog onOpenChange={(e) => {
                    if (!e) {
                        setProviderName(name);
                        setCompanyName(company_name);
                        setPhoneNumber(phone_number);
                        setAddress(address);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"secondary"} ><Pencil /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Provider</DialogTitle>
                            <DialogDescription>
                                Make changes to the provider information here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="provider-name" className="text-right">Name:</p>
                                <Input
                                    id="provider-name"
                                    name="provider-name"
                                    placeholder="Provider Name"
                                    className="col-span-3 !bg-card"
                                    value={providerName}
                                    onChange={(e) => setProviderName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="company-name" className="text-right">Company:</p>
                                <Input
                                    id="company-name"
                                    name="company-name"
                                    placeholder="Company Name (Optional)"
                                    className="col-span-3 !bg-card"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="phone-number" className="text-right">Phone:</p>
                                <Input
                                    id="phone-number"
                                    name="phone-number"
                                    placeholder="Phone Number"
                                    className="col-span-3 !bg-card"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="address" className="text-right">Address:</p>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    className="col-span-3 !bg-card"
                                    value={newAddress}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                {/* Changed: Calls the correct update handler */}
                                <Button type="submit" onClick={handleUpdateProvider}>Update</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"destructive"}><Trash /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            {/* Changed: Dialog title and description */}
                            <DialogTitle>Delete Provider</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete <span className='font-bold'>{name}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                {/* Changed: Calls the correct delete handler */}
                                <Button variant="destructive" type="submit" onClick={handleDeleteProvider}>Delete</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default ProviderItem