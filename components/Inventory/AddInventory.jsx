"use client";

import { PackagePlus } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Combobox from '../ui/combobox';

const AddInventory = () => {

    // State for inventory item fields
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');

    // State for providers
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const router = useRouter();
    const supabase = createClient();

    // Fetch providers from Supabase when the component mounts
    useEffect(() => {
        const fetchProviders = async () => {
            const { data, error } = await supabase
                .from('providers')
                .select('id, name');

            if (error) {
                console.error('Error fetching providers:', error);
                toast.error('Could not fetch providers list.');
            } else {
                setProviders(data);
            }
        };

        fetchProviders();
    }, [supabase]);


    const handleAddNewInventory = async () => {
        if (!productName || !quantity || !costPrice || !sellingPrice) {
            toast.error("Product Name, Quantity, Cost Price, and Selling Price are required.");
            return;
        }

        const { data, error } = await supabase
            .from('inventory')
            .insert([
                {
                    product_name: productName,
                    quantity: parseInt(quantity),
                    cost_price: parseFloat(costPrice),
                    selling_price: parseFloat(sellingPrice),
                    provider_id: selectedProvider.id,
                },
            ])
            .select();

        if (error) {
            console.error('Error adding new inventory:', error);
            toast.error('Failed to add inventory. Please try again.');
        } else {
            console.log('Inventory added successfully:', data);
            // Reset form fields
            setProductName('');
            setQuantity('');
            setCostPrice('');
            setSellingPrice('');
            setSelectedProvider(null);
            toast.success('Inventory added successfully.');
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className='flex flex-row justify-center items-center gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            Add Inventory <PackagePlus className="ml-1" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Inventory</DialogTitle>
                            <DialogDescription>
                                Please fill in the details of the new inventory item. Click 'Add' when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Product Details */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="product-name" className="text-right">Product:</p>
                                <Input id="product-name" name="product-name" placeholder="Product Name" className="col-span-3 !bg-card" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="quantity" className="text-right">Quantity:</p>
                                <Input id="quantity" name="quantity" type="number" placeholder="Quantity" className="col-span-3 !bg-card" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="cost-price" className="text-right">Cost Price:</p>
                                <Input id="cost-price" name="cost-price" type="number" placeholder="Cost per item" className="col-span-3 !bg-card" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="selling-price" className="text-right whitespace-nowrap">Selling Price:</p>
                                <Input id="selling-price" name="selling-price" type="number" placeholder="Selling price per item" className="col-span-3 !bg-card" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required />
                            </div>


                            {/* Provider Selection */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <p htmlFor="provider" className="text-right">Provider:</p>
                                {/* <Select onValueChange={setSelectedProvider} value={selectedProvider}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a provider (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {providers.map((provider) => (
                                            <SelectItem key={provider.id} value={provider.id}>
                                                {provider.provider_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select> */}
                                <Combobox items={providers} name="provider" onValueChange={setSelectedProvider} selectedValue={selectedProvider} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" onClick={handleAddNewInventory}>Add</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AddInventory;