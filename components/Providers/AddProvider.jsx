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

// Renamed component to reflect its purpose
const AddProvider = () => {

    // Renamed state variables for clarity
    const [providerName, setProviderName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const router = useRouter();

    const handleAddNewProvider = async () => {
        // Updated validation check
        if (!providerName || !phoneNumber || !address) {
            toast.error("Provider Name, Phone Number, and Address are required.");
            return;
        }

        const supabase = createClient();
        // Updated to insert into the 'providers' table with correct column names
        const { data, error } = await supabase
            .from('providers')
            .insert([
                {
                    name: providerName,
                    company_name: companyName, // This can be null if empty
                    phone_number: phoneNumber,
                    address: address,
                },
            ])
            .select();

        if (error) {
            console.error('Error adding new provider:', error);
            toast.error('Failed to add provider. Please try again.');
        } else {
            console.log('Provider added successfully:', data);
            // Reset form fields
            setProviderName('');
            setCompanyName('');
            setPhoneNumber('');
            setAddress('');
            toast.success('Provider added successfully.');
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className='flex flex-row justify-center items-center gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            {/* Updated button text */}
                            Add Provider <UserRoundPlus className="ml-1" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            {/* Updated dialog title and description */}
                            <DialogTitle>Add New Provider</DialogTitle>
                            <DialogDescription>
                                Please fill in the details of the new provider. Click 'Add' when you're done.
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
                                {/* Updated button to call the correct handler */}
                                <Button type="submit" onClick={handleAddNewProvider}>Add</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

// Renamed default export
export default AddProvider;