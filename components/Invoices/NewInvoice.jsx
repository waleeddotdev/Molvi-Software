// File: app/invoices/new/NewInvoice.js (example path)

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from '../ui/date-picker';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Invoice1 from './PDF/Invoice1';

const Label = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
    </label>
);

const NewInvoice = ({ client }) => {
    const router = useRouter();
    const supabase = createClient();

    // --- STATE MANAGEMENT ---
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [issueDate, setIssueDate] = useState(new Date());
    const [dueDate, setDueDate] = useState();
    const [notes, setNotes] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    // State to hold all available inventory products
    const [inventory, setInventory] = useState([]);

    // State for the line items being added to the invoice
    const [lineItems, setLineItems] = useState([
        { id: Date.now(), productId: null, variant: null, quantity: 1, price: 0 }
    ]);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchInventory = async () => {
            const { data, error } = await supabase
                .from('inventory')
                .select('id, product_name, variants');

            if (error) {
                toast.error("Failed to fetch inventory.");
            } else {
                setInventory(data);
            }
        };
        fetchInventory();


    }, []);

    useEffect(() => {
        setInvoiceNumber(`INV-${uuidv4().split('-')[0].toUpperCase()}`);

    }, []);

    // --- DYNAMIC FORM HANDLERS ---
    const addLineItem = () => {
        setLineItems([...lineItems, { id: Date.now(), productId: null, variant: null, quantity: 1, price: 0 }]);
    };

    const removeLineItem = (id) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        const updatedItems = lineItems.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setLineItems(updatedItems);
    };

    const handleProductSelect = (id, productId) => {
        const updatedItems = lineItems.map(item => {
            if (item.id === id) {
                // When product changes, reset the variant and price
                return { ...item, productId: productId, variant: null, price: 0 };
            }
            return item;
        });
        setLineItems(updatedItems);
    };

    const handleVariantSelect = (id, variantString) => {
        const variant = JSON.parse(variantString);
        const updatedItems = lineItems.map(item => {
            if (item.id === id) {
                // When variant changes, auto-fill the selling price
                return { ...item, variant: variant, price: variant.selling_price };
            }
            return item;
        });
        setLineItems(updatedItems);
    };

    // --- CALCULATION ---
    const { subtotal, total } = useMemo(() => {
        const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        // You can add tax logic here if needed
        return { subtotal, total: subtotal };
    }, [lineItems]);


    const handleSaveInvoice = async () => {
        // 1. Initial Validation
        if (!dueDate) {
            return toast.error("Please select a due date.");
        }

        if (lineItems.some(item => !item.productId || !item.variant)) {
            return toast.error("Please select a product and variant for all items.");
        }

        // NEW: Aggregate the total quantity requested for each unique variant
        const requestedQuantities = {};
        for (const item of lineItems) {
            if (item.variant) {
                // Create a unique key for each variant (e.g., "product_id-Color:Blue-Size:L")
                const variantKey = `${item.productId}-${JSON.stringify(item.variant.attributes)}`;
                requestedQuantities[variantKey] = (requestedQuantities[variantKey] || 0) + parseInt(item.quantity || 0);
            }
        }

        // 2. Main Validation Loop (Price and Quantity)
        // We use a for...of loop to allow for early returns with toast messages
        for (const item of lineItems) {
            const productInfo = inventory.find(inv => inv.id === item.productId);
            const productName = productInfo?.product_name || 'Unknown Product';
            const variantName = Object.values(item.variant.attributes).join(' / ');

            const priceNum = parseFloat(item.price);
            const costNum = parseFloat(item.variant.cost_price);

            // Price Check
            if (priceNum <= costNum) {
                toast.error(`Price for '${productName} (${variantName})' is too low and will result in a loss.`);
                return; // Stop execution
            }

            // NEW: Quantity Check
            const variantKey = `${item.productId}-${JSON.stringify(item.variant.attributes)}`;
            const totalRequested = requestedQuantities[variantKey];
            const quantityInStock = item.variant.quantity;

            if (totalRequested > quantityInStock) {
                toast.error(`Not enough stock for '${productName} (${variantName})'. Requested: ${totalRequested}, Available: ${quantityInStock}.`);
                return; // Stop execution
            }
        }

        // 3. Prepare data for DB if all validations pass
        const finalLineItems = lineItems.map(item => ({
            product_name: inventory.find(inv => inv.id === item.productId)?.product_name,
            variant_attributes: item.variant.attributes,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            cost_price: parseFloat(item.variant.cost_price)
        }));

        // 4. Database Insert
        const { error } = await supabase.from('invoices').insert([{
            invoice_number: invoiceNumber,
            client_id: client.id,
            issue_date: issueDate?.toISOString().split('T')[0], // Format to YYYY-MM-DD
            due_date: dueDate.toISOString().split('T')[0],   // Format to YYYY-MM-DD
            line_items: finalLineItems,
            notes: notes,
            total_amount: total
        }]);

        if (error) {
            console.error("Supabase Error:", error);
            return toast.error("Failed to create invoice. Please try again.");
        }

        // 5. Success
        toast.success("Invoice created successfully!");
        router.push(`/dashboard/invoices/${client.id}`);
    };

    const handlePreview = () => {

        const enhancedLineItems = lineItems.map(item => {
            // Find the full product object from your inventory state
            const product = inventory.find(inv => inv.id === item.productId);

            // Safely create a readable string for the variant attributes
            const variantName = item.variant?.attributes
                ? Object.values(item.variant.attributes).join(' / ')
                : '';

            // Return a new object that includes all original data PLUS the names
            return {
                ...item,
                product_name: product?.product_name || 'N/A', // Add the product name
                variant_name: variantName, // Add the variant name string
            };
        });


        const invoiceData = {
            invoiceNumber,
            client,
            issueDate,
            dueDate,
            lineItems: enhancedLineItems,
            notes,
            subtotal,
            total,
        };
        setIsPreviewOpen(true);
        setPreviewData(invoiceData);
    };


    return (
        <div className='space-y-4 relative h-full md:space-y-8 '>
            {isPreviewOpen && <>

                <div onClick={() => setIsPreviewOpen(false)} className='bg-black/25 backdrop-blur-xs z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center p-5'>
                    <div className='w-full h-full flex items-center justify-center bg-background overflow-hidden rounded-xl max-w-[1500px]'>
                        <PDFViewer showToolbar={true} className=' w-full h-full flex-1 rounded-xl' >
                            <Invoice1 invoiceData={previewData} />
                        </PDFViewer>
                    </div>
                </div>
            </>}
            <div className="flex flex-col h-full md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className='font-recoleta text-pretty text-2xl font-extrabold leading-[105%]'>New Invoice</h1>
                    <p className='text-muted-foreground'>For: {client.customer_name}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${client.id}`)}>Cancel</Button>
                    <Button className="hidden lg:flex" variant="outline" onClick={handlePreview}>Preview</Button>
                    <PDFDownloadLink
                        document={<Invoice1 invoiceData={previewData} />}
                        fileName={`${client?.customer_name} - Invoice #${invoiceNumber}.pdf`}
                        className="flex lg:hidden"
                    >
                        <Button variant="outline">Preview</Button>
                    </PDFDownloadLink>
                    <Button onClick={handleSaveInvoice} className="flex items-center gap-2">
                        <Save className="h-4 w-4" /> Save Invoice
                    </Button>
                </div>
            </div>
            <div className='flex flex-col h-full gap-8'>
                {/* --- LEFT COLUMN: Form Details --- */}
                <div className=' h-full space-y-6'>

                    {/* Invoice Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className='space-y-2'>
                            <Label>Invoice Number</Label>
                            <p className='font-semibold text-muted-foreground'>{invoiceNumber}</p>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='issueDate'>Issue Date</Label>
                            <DatePicker
                                value={issueDate}
                                onChange={setIssueDate}
                                placeholder="Select issue date"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='dueDate'>Due Date</Label>
                            <DatePicker
                                value={dueDate}
                                onChange={setDueDate}
                                placeholder="Select due date"
                            />
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-3">
                        <h3 className='font-semibold'>Items</h3>
                        {lineItems.map((item, index) => {
                            const selectedProduct = inventory.find(inv => inv.id === item.productId);
                            return (
                                <div key={item.id} className="grid grid-cols-13 gap-2 p-3 border rounded-lg items-end">
                                    {/* Product */}
                                    <div className="col-span-12 sm:col-span-4 space-y-2">
                                        {index === 0 && <Label>Product</Label>}
                                        <Select onValueChange={(value) => handleProductSelect(item.id, value)}>
                                            <SelectTrigger><SelectValue placeholder="Select Product..." /></SelectTrigger>
                                            <SelectContent>
                                                {inventory.map(inv => <SelectItem key={inv.id} value={inv.id}>{inv.product_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Variant */}
                                    <div className="col-span-12 sm:col-span-3 space-y-2">
                                        {index === 0 && <Label>Variant</Label>}
                                        <Select onValueChange={(value) => handleVariantSelect(item.id, value)} disabled={!selectedProduct}>
                                            <SelectTrigger><SelectValue placeholder="Select Variant..." /></SelectTrigger>
                                            <SelectContent>
                                                {selectedProduct?.variants.map((v, i) => (
                                                    <SelectItem key={i} value={JSON.stringify(v)}>
                                                        {Object.entries(v.attributes).map(([key, val]) => `${val}`).join(' / ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Qty */}
                                    <div className="col-span-4 sm:col-span-1 space-y-2">
                                        {index === 0 && <Label>Qty</Label>}
                                        <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} min="1" />
                                    </div>
                                    {/* Price */}
                                    <div className="col-span-4 sm:col-span-2 space-y-2">
                                        {index === 0 && <Label>Price per item</Label>}
                                        <Input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} step="0.01" />
                                    </div>
                                    <div className="col-span-4 sm:col-span-2 space-y-2">
                                        {index === 0 && <Label>Total</Label>}
                                        <Input type="number" value={(item.quantity * item.price).toFixed(2)} readOnly />
                                    </div>
                                    {/* Remove */}
                                    <div className='col-span-1 flex items-center'>
                                        {lineItems.length > 1 && <Button variant="destructive" size="icon" onClick={() => removeLineItem(item.id)}><Trash className="h-4 w-4 " /></Button>}
                                    </div>
                                </div>
                            )
                        })}
                        <Button variant="outline" onClick={addLineItem} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Item
                        </Button>
                    </div>
                    {/* Notes Section */}
                    <div className='space-y-2'>
                        <Label htmlFor='notes'>Notes</Label>
                        <Textarea id="notes" placeholder="Add any additional notes for the client..." value={notes} onChange={e => setNotes(e.target.value)} className="!border-border" />
                    </div>
                </div>


            </div>
        </div>
    )
}

export default NewInvoice;