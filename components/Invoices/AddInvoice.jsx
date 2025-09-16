"use client";

import { FilePlus } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Ledger from './PDF/Ledger'; // Assuming Ledger component is in ./PDF/Ledger.js

const AddInvoice = ({ clientId, ledgerData }) => {

    const [showInvoiceModal, setIsPreviewOpen] = useState(false);
    // This state will hold the data ONLY when the preview is active
    const [previewData, setPreviewData] = useState(null);

    // CHANGE 1: Create a handler for the preview button
    const handlePreviewClick = () => {
        // First, set the data that the PDF viewer will use
        setPreviewData(ledgerData);
        // Then, open the modal
        setIsPreviewOpen(true);
    };

    return (
        <>
            {showInvoiceModal && previewData && ( // Also check if previewData is not null
                <div
                    onClick={() => setIsPreviewOpen(false)}
                    className='bg-black/25 backdrop-blur-xs z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center p-5'
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
                        className='w-full h-full flex items-center justify-center bg-background overflow-hidden rounded-xl max-w-[1500px] '
                    >
                        <PDFViewer showToolbar={true} className='w-full h-full flex-1 rounded-xl'>
                            {/* This will now receive the correct data */}
                            <Ledger ledgerData={previewData} />
                        </PDFViewer>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-end gap-2">
                <div className='flex flex-row justify-center items-center gap-2'>
                   
                        <Button className='hidden lg:flex' onClick={handlePreviewClick} variant={"outline"}>Export</Button>

                    <PDFDownloadLink
                        document={<Ledger ledgerData={ledgerData} />}
                        fileName={`${ledgerData?.customerName?.replace(/ /g, '-')?.toLowerCase()}-${ledgerData?.id}.pdf`}
                    >
                        <Button variant={"outline"}>Export</Button>
                    </PDFDownloadLink>

                    <Link href={`/dashboard/invoices/${clientId}/new`}>
                        <Button className="flex items-center gap-2">
                            Add Invoice <FilePlus className="ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AddInvoice;