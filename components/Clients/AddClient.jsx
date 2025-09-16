"use client";

import { UserRoundPlus } from 'lucide-react';
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

const AddClient = () => {

    const [companyName, setCompanyName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const router = useRouter();


    const handleAddNewClient = async () => {
        if (!customerName || !phoneNumber || !address) {
            alert("Customer Name, Phone Number, and Address are required.");
            return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
            .from('clients')
            .insert([
                {
                    company_name: companyName,
                    customer_name: customerName,
                    phone_number: phoneNumber,
                    address: address,
                },
            ])
            .select();

        if (error) {
            console.error('Error adding new client:', error);
            toast.error('Failed to add client. Please try again.');
            alert('Failed to add client. Please try again.');
        } else {
            console.log('Client added successfully:', data);
            // Reset form fields
            setCompanyName('');
            setCustomerName('');
            setPhoneNumber('');
            setAddress('');
            toast.success('Client added successfully.');
            router.refresh();
        }
    };


    return (
        <div className="flex flex-col items-end gap-2">
            <div className='flex flex-row justify-center items-center gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            Add Client <UserRoundPlus className="ml-1" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription>
                                Please fill in the details of the new client. Click 'Add' when you're done.
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
                                    value={address}
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
                                <Button type="submit" onClick={handleAddNewClient}>Add</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );

};

export default AddClient;
