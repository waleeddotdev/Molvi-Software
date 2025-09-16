"use client"

import { Button } from '../ui/button'
import { Link as LinkIcon, Pencil, Trash } from 'lucide-react'
import { Input } from '../ui/input'
import Link from 'next/link'
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

const ClientItem = ({ client: { company_name, customer_name, phone_number, address, id } }) => {

    const [companyName, setCompanyName] = useState(company_name);
    const [customerName, setCustomerName] = useState(customer_name);
    const [phoneNumber, setPhoneNumber] = useState(phone_number);
    const [newAddress, setAddress] = useState(address);
    const router = useRouter();

    const handleUpdateClient = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('clients').update({
            company_name: companyName,
            customer_name: customerName,
            phone_number: phoneNumber,
            address: newAddress,
        }).eq('id', id);
        if (error) {
            console.error('Error updating client:', error);
            toast.error('Failed to update client. Please try again.');
        } else {
            console.log('Client updated successfully:', data);
            toast.success('Client updated successfully.');
        }
        router.refresh()

    };

    const handleDeleteClient = async () => {
        const supabase = createClient();
        await supabase.from('clients').delete().eq('id', id);
        toast.success('Client deleted successfully.');
        router.refresh()
    }

    return (
        <div className='px-4 hover:scale-[1.01] transition-transform duration-300 flex flex-col sm:flex-row justify-between items-left sm:items-center gap-3 sm:gap-0 py-2 shadow-xl bg-background rounded-lg'>
            <div className='flex flex-row gap-4 items-center justify-center w-fit'>
                <div className='hidden sm:inline'>
                    <img className='w-10 h-10 rounded-full' src={`https://api.dicebear.com/9.x/notionists/png?seed=${customer_name}&backgroundColor=ffffff`} />
                </div>
                <div>
                    <p className='font-recoleta text-lg font-extrabold '>{customer_name}  {company_name && ` (${company_name})`}</p>
                    <p className='text-sm opacity-70'>{phone_number}</p>
                    <p className='text-sm opacity-70'>{address}</p>
                </div>
            </div>
            <div className='flex flex-row justify-end sm:justify-center sm:items-center gap-2'>
                <Link href={`/dashboard/invoices/${id}`}> <Button variant={"secondary"}>View Invoices <LinkIcon /></Button></Link>
                <Dialog onOpenChange={(e) => {
                    if (!e) {
                        setCompanyName(company_name);
                        setCustomerName(customer_name);
                        setPhoneNumber(phone_number);
                        setAddress(address);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"secondary"} ><Pencil /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Client</DialogTitle>
                            <DialogDescription>
                                Make changes to the client information here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
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
                                <p htmlFor="customer-name" className="text-right">Name:</p>
                                <Input
                                    id="customer-name"
                                    name="customer-name"
                                    placeholder="Customer Name"
                                    className="col-span-3 !bg-card"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
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
                                <Button type="submit" onClick={handleUpdateClient}>Update</Button>
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
                            <DialogTitle>Delete Client</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this client? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" onClick={handleDeleteClient}>Delete</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default ClientItem