"use client"

import { Button } from '../ui/button'
import { Eye, Trash } from 'lucide-react'
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
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import Invoice1 from './PDF/Invoice1'
import { useState, useMemo } from 'react' // Import useMemo

// --- Helper Functions (keep them as they are) ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount || 0);
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};


const InvoiceItem = ({ invoice }) => {
    const { id, invoice_number, total_amount, issue_date, line_items, notes, clients: client } = invoice;
    const router = useRouter();
    const [showInvoiceModal, setIsPreviewOpen] = useState(false);

    // --- NEW: Use useMemo to prepare the data for the PDF preview ---
    const previewData = useMemo(() => {
        // This transformation logic will only run when the `invoice` prop changes.

        // 1. Enhance the line items with a readable variant name
        const enhancedLineItems = (line_items || []).map(item => {
            const variantName = item.variant_attributes
                ? Object.values(item.variant_attributes).join(' / ')
                : '';

            return {
                ...item,
                variant_name: variantName,
            };
        });

        // 2. Create the final, clean data object for the PDF component
        return {
            invoiceNumber: invoice_number,
            clientName: client?.customer_name || 'N/A',
            // Pass the full client object if your PDF needs more details like address
            client: client,
            issueDate: issue_date,
            dueDate: invoice.due_date, // Assuming due_date exists on the invoice object
            lineItems: enhancedLineItems, // Use the new, enhanced array
            notes: notes,
            subtotal: total_amount, // Assuming subtotal is same as total for now
            total: total_amount,
        };
    }, [invoice]); // Dependency array ensures this only recalculates if the invoice data changes

    const handleDeleteInvoice = async () => {
        const supabase = createClient();
        const { error } = await supabase.from('invoices').delete().eq('id', id);

        if (error) {
            toast.error('Failed to delete invoice.');
        } else {
            toast.success('Invoice deleted successfully.');
            router.refresh();
        }
    };

    return (
        <>
            {showInvoiceModal && (
                <div
                    onClick={() => setIsPreviewOpen(false)}
                    className='bg-black/25 backdrop-blur-xs z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center p-5'
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
                        className='w-full h-full flex items-center justify-center bg-background overflow-hidden rounded-xl max-w-[1500px]'
                    >
                        <PDFViewer showToolbar={true} className='w-full h-full flex-1 rounded-xl'>
                            {/* Pass the memoized and enhanced data to the PDF */}
                            <Invoice1 invoiceData={previewData} />
                        </PDFViewer>
                    </div>
                </div>
            )}

            <div className='px-4 py-3 hover:scale-[1.01] transition-transform duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md bg-background rounded-lg'>
                {/* --- Left Side: Invoice & Client Info --- */}
                <div className='flex flex-row gap-4 items-center justify-center w-fit'>
                    <div>
                        <p className='font-bold text-lg'>{invoice_number}</p>
                        <p className='text-sm text-muted-foreground'>Issue: {formatDate(issue_date)}</p>
                    </div>
                </div>

                {/* --- Right Side: Details & Actions --- */}
                <div className='flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto'>
                    <div className='text-left sm:text-right'>
                        <p className='text-lg font-semibold'>{formatCurrency(total_amount)}</p>
                    </div>

                    <div className='flex flex-row justify-center items-center gap-2'>
                        {/* The preview button now just toggles the modal */}
                        <Button className='hidden lg:flex' onClick={() => setIsPreviewOpen(true)} size={"icon"} variant={"outline"}><Eye className="h-4 w-4" /></Button>

                        <PDFDownloadLink

                            document={<Invoice1 invoiceData={previewData} />}
                            fileName={`${client?.customer_name} - Invoice #${invoice_number}`}
                            className="flex lg:hidden"
                        >
                            <Button variant={"outline"} size={"icon"}><Eye className="h-4 w-4" /></Button>
                        </PDFDownloadLink>

                        {/* DELETE BUTTON (Opens a confirmation dialog) */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size={"icon"} variant={"destructive"}><Trash className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Delete Invoice</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete invoice <span className='font-bold'>{invoice_number}</span>? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant="destructive" type="submit" onClick={handleDeleteInvoice}>Delete</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvoiceItem;