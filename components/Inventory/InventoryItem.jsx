// app/inventory/InventoryItem.js

"use client"

import { Button } from '../ui/button'
import { Pencil, Plus, Trash } from 'lucide-react'
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
import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Combobox from '../ui/combobox'

// A simple Label component for consistency
const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium text-right">
        {children}
    </label>
);


const InventoryItem = ({ product, providers }) => {
    const router = useRouter();
    const supabase = createClient();

    // --- STATE MANAGEMENT FOR EDITING ---
    // Initialize state with the product's data
    const [productName, setProductName] = useState(product.product_name);
    const [selectedProvider, setSelectedProvider] = useState(providers.find(provider => provider.id === product.provider_id) || null);

    // Function to derive attribute names from the first variant
    const deriveAttributeNames = (variants) => {
        if (!variants || variants.length === 0 || !variants[0]?.attributes) return [''];
        return Object.keys(variants[0].attributes);
    };

    const [attributeNames, setAttributeNames] = useState(() => deriveAttributeNames(product.variants));
    const [variants, setVariants] = useState(JSON.parse(JSON.stringify(product.variants || []))); // Deep copy to prevent mutation

    // --- DELETE LOGIC ---
    const handleDeleteProduct = async () => {
        const { error } = await supabase.from('inventory').delete().eq('id', product.id);
        if (error) {
            toast.error(error.message || 'Failed to delete product.');
        } else {
            toast.success('Product deleted successfully.');
            router.refresh();
        }
    }

    // --- UPDATE LOGIC (similar to AddProduct) ---
    const handleUpdateProduct = async () => {
        // Run all the same validations as the "Add" component
        if (!productName.trim()) {
            return toast.error("Product Name is required.");
        }
        // ... (other validations for variants, prices, etc.)

        let totalQuantity = 0;
        const variantsForDB = variants?.map((variant, index) => {
            const costNum = parseFloat(variant.cost_price);
            const sellingNum = parseFloat(variant.selling_price);

            if (costNum > sellingNum) {
                toast.error(`In Variant ${index + 1}, Cost Price cannot be higher than Selling Price.`);
                throw new Error("Validation failed"); // Stop execution
            }
            totalQuantity += parseInt(variant.quantity);
            return {
                ...variant, // includes attributes
                quantity: parseInt(variant.quantity),
                cost_price: costNum,
                selling_price: sellingNum
            };
        });

        const { error } = await supabase
            .from('inventory')
            .update({
                product_name: productName,
                provider_id: selectedProvider,
                total_quantity: totalQuantity,
                variants: variantsForDB,
            })
            .eq('id', product.id);

        if (error) {
            toast.error(error.message || "Failed to update product.");
        } else {
            toast.success("Product updated successfully!");
            router.refresh();
        }
    };


    return (
        <div className='px-4 hover:scale-[1.01] transition-transform duration-300 flex flex-row justify-between items-center py-2 shadow-xl bg-background rounded-lg'>
            {/* --- MAIN DISPLAY --- */}
            <div className='flex flex-row gap-4 items-center justify-center w-fit'>
                <div>
                    <p className='font-recoleta text-lg font-extrabold '>{product.product_name}</p>
                    <p className='text-sm opacity-70'>Remaining Quantity: {product.total_quantity}</p>
                </div>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
                {/* --- EDIT BUTTON & DIALOG --- */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"secondary"}><Pencil /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Product: {product.product_name}</DialogTitle>
                        </DialogHeader>
                        {/* The Edit form is essentially a pre-filled "Add Product" form */}
                        <div className="space-y-6 py-4">
                            {/* Product Name & Provider */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className="col-span-3 !bg-card" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Provider</Label>
                                <div className='col-span-3'>
                                    <Combobox items={providers} name="provider" onValueChange={setSelectedProvider} selectedValue={selectedProvider} />
                                </div>
                            </div>
                            <hr />
                            {/* Variants Section */}
                            <div className="space-y-4">
                                {variants?.map((variant, variantIndex) => (
                                    <div key={variantIndex} className="p-4 border rounded-lg space-y-4 relative">
                                        <p className='font-bold text-lg'>Variant {variantIndex + 1}</p>
                                        {/* Attribute Values */}
                                        <div className='space-y-3'>
                                            {attributeNames.map((attrName) => attrName && (
                                                <div key={attrName} className="grid grid-cols-4 items-center gap-4">
                                                    <Label>{attrName}</Label>
                                                    <Input value={variant.attributes[attrName] || ''} onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        newVariants[variantIndex].attributes[attrName] = e.target.value;
                                                        setVariants(newVariants);
                                                    }} className="col-span-3 !bg-card" />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pricing and Quantity */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Similar Inputs for Quantity, Cost Price, Selling Price */}
                                            {/* Note: In a real app, you would likely reuse a sub-component here */}
                                            <div className='space-y-2'>
                                                <Label>Quantity</Label>
                                                <Input type="number" value={variant.quantity} onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[variantIndex].quantity = e.target.value;
                                                    setVariants(newVariants);
                                                }} className="!bg-card" />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Cost Price</Label>
                                                <Input type="number" value={variant.cost_price} onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[variantIndex].cost_price = e.target.value;
                                                    setVariants(newVariants);
                                                }} className="!bg-card" />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label>Selling Price</Label>
                                                <Input type="number" value={variant.selling_price} onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[variantIndex].selling_price = e.target.value;
                                                    setVariants(newVariants);
                                                }} className="!bg-card" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                            <DialogClose asChild><Button type="submit" onClick={handleUpdateProduct}>Update Product</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* --- DELETE BUTTON & DIALOG --- */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"icon"} variant={"destructive"}><Trash /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete <span className="font-semibold">{product.product_name}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="destructive" type="submit" onClick={handleDeleteProduct}>Delete</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default InventoryItem