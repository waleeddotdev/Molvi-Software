"use client";

import { PackagePlus, Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { createClient } from "../../utils/supabase/client"
import { Input } from '../ui/input'
import {
    Dialog,
    DialogContent,
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

// A simple Label component for consistency
const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium text-right">
        {children}
    </label>
);

const AddProductWithVariants = () => {
    const router = useRouter();
    const supabase = createClient();

    // --- STATE MANAGEMENT ---
    const [productName, setProductName] = useState('');
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [attributeNames, setAttributeNames] = useState(['']);
    const [variants, setVariants] = useState([
        { quantity: '', costPrice: '', sellingPrice: '', attributes: {} }
    ]);

    // Fetch providers from Supabase
    useEffect(() => {
        const fetchProviders = async () => {
            const { data, error } = await supabase.from('providers').select('id, name');
            if (error) {
                toast.error('Could not fetch providers list.');
            } else {
                setProviders(data);
            }
        };
        fetchProviders();
    }, []);


    // --- DYNAMIC FORM HANDLERS ---
    const handleAttributeNameChange = (index, newName) => {
        const oldName = attributeNames[index];
        const updatedNames = [...attributeNames];
        updatedNames[index] = newName;
        setAttributeNames(updatedNames);
        const updatedVariants = variants.map(variant => {
            if (variant.attributes.hasOwnProperty(oldName)) {
                variant.attributes[newName] = variant.attributes[oldName];
                delete variant.attributes[oldName];
            }
            return variant;
        });
        setVariants(updatedVariants);
    };

    const addAttributeName = () => {
        setAttributeNames([...attributeNames, '']);
    };

    const removeAttributeName = (index) => {
        if (attributeNames.length > 1) {
            const nameToRemove = attributeNames[index];
            setAttributeNames(attributeNames.filter((_, i) => i !== index));
            const updatedVariants = variants.map(variant => {
                delete variant.attributes[nameToRemove];
                return variant;
            });
            setVariants(updatedVariants);
        }
    };

    const handleAttributeValueChange = (variantIndex, attrName, value) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].attributes[attrName] = value;
        setVariants(updatedVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        const newAttributes = attributeNames.reduce((acc, name) => {
            if (name) acc[name] = '';
            return acc;
        }, {});
        setVariants([...variants, { quantity: '', costPrice: '', sellingPrice: '', attributes: newAttributes }]);
    };

    const removeVariant = (index) => {
        if (variants.length > 1) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setProductName('');
        setSelectedProvider(null);
        setAttributeNames(['']);
        setVariants([{ quantity: '', costPrice: '', sellingPrice: '', attributes: {} }]);
    }

    // --- SUBMISSION LOGIC (REFACTORED) ---
    const handleSaveProduct = async () => {
        // 1. Top-level validation
        if (!productName.trim()) {
            return toast.error("Product Name is required.");
        }
        const finalAttributeNames = attributeNames.filter(name => name.trim() !== '');
        if (finalAttributeNames.length === 0) {
            return toast.error("Please define at least one variant property (e.g., Color).");
        }

        let totalQuantity = 0;
        const variantsForDB = [];

        // 2. Loop through variants for validation
        // Using a for...of loop allows us to use `return` to exit the function early.
        let variantIndex = 1;
        for (const variant of variants) {
            const costNum = parseFloat(variant.costPrice);
            const sellingNum = parseFloat(variant.sellingPrice);

            if (!variant.quantity || !variant.costPrice || !variant.sellingPrice) {
                return toast.error(`Variant ${variantIndex} is missing Quantity, Cost, or Selling Price.`);
            }
            if (isNaN(costNum) || isNaN(sellingNum) || isNaN(parseInt(variant.quantity))) {
                return toast.error(`Variant ${variantIndex} has invalid numbers for price or quantity.`);
            }
            if (costNum > sellingNum) {
                return toast.error(`In Variant ${variantIndex}, the Cost Price cannot be higher than the Selling Price.`);
            }

            totalQuantity += parseInt(variant.quantity);
            variantsForDB.push({
                quantity: parseInt(variant.quantity),
                cost_price: costNum,
                selling_price: sellingNum,
                attributes: variant.attributes,
            });
            variantIndex++;
        }

        // 3. Perform the database insert
        const { error } = await supabase
            .from('inventory')
            .insert([{
                product_name: productName,
                provider_id: selectedProvider,
                total_quantity: totalQuantity,
                variants: variantsForDB,
            }]);

        if (error) {
            console.error("Supabase error:", error);
            return toast.error(error.message || "Failed to save product.");
        }

        // 4. Success
        toast.success('Product and variants saved successfully!');
        router.refresh();
        resetForm();
    };

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && resetForm()}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    Add Product <PackagePlus className="ml-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product with Variants</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* --- TOP-LEVEL PRODUCT INFO --- */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input id="productName" placeholder="e.g., Men's T-Shirt" className="col-span-3 !bg-card" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label>Provider</Label>
                            <div className='col-span-3'>
                                <Combobox items={providers} name="provider" onValueChange={setSelectedProvider} selectedValue={selectedProvider} />
                            </div>
                        </div>
                    </div>
                    <hr />

                    {/* --- DEFINE SHARED PROPERTIES --- */}
                    <div className="p-4 border rounded-lg bg-muted/40 space-y-3">
                        <h3 className="font-semibold">Define Variant Properties</h3>
                        <div className='space-y-2'>
                            {attributeNames.map((name, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input placeholder={`Property ${index + 1} (e.g., Color)`} value={name} onChange={(e) => handleAttributeNameChange(index, e.target.value)} className="!bg-card" />
                                    <Button variant="destructive" size="icon" onClick={() => removeAttributeName(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={addAttributeName}>
                            <Plus className="h-4 w-4 mr-2" /> Add Property
                        </Button>
                    </div>

                    {/* --- DYNAMIC VARIANTS SECTION --- */}
                    <div className="space-y-4">
                        {variants.map((variant, variantIndex) => (
                            <div key={variantIndex} className="p-4 border rounded-lg space-y-4 relative">
                                <p className='font-bold text-lg'>Variant {variantIndex + 1}</p>
                                {variants.length > 1 && (
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeVariant(variantIndex)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                )}
                                <div className='space-y-3'>
                                    {attributeNames.map((attrName) => attrName && (
                                        <div key={attrName} className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={`variant-${variantIndex}-${attrName}`}>{attrName}</Label>
                                            <Input id={`variant-${variantIndex}-${attrName}`} placeholder={`Value for ${attrName}`} value={variant.attributes[attrName] || ''} onChange={(e) => handleAttributeValueChange(variantIndex, attrName, e.target.value)} className="col-span-3 !bg-card" />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className='space-y-2'>
                                        <Label htmlFor={`quantity-${variantIndex}`}>Quantity</Label>
                                        <Input id={`quantity-${variantIndex}`} type="number" placeholder="0" value={variant.quantity} onChange={(e) => handleVariantChange(variantIndex, 'quantity', e.target.value)} className="!bg-card" />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor={`cost-${variantIndex}`}>Cost Price</Label>
                                        <Input id={`cost-${variantIndex}`} type="number" placeholder="0.00" value={variant.costPrice} onChange={(e) => handleVariantChange(variantIndex, 'costPrice', e.target.value)} className="!bg-card" />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor={`selling-${variantIndex}`}>Selling Price</Label>
                                        <Input id={`selling-${variantIndex}`} type="number" placeholder="0.00" value={variant.sellingPrice} onChange={(e) => handleVariantChange(variantIndex, 'sellingPrice', e.target.value)} className="!bg-card" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={addVariant}>
                        <Plus className="h-4 w-4 mr-2" /> Add Another Variant
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button type="submit" onClick={handleSaveProduct}>Save Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductWithVariants;