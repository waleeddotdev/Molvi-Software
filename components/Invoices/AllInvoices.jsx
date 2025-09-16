"use server"

import { createClient } from '../../utils/supabase/server'
import InvoiceData from './InvoiceData'
import InvoiceItem from './InvoiceItem'
import AddInvoice from './AddInvoice'

const AllInvoices = async ({ clientId }) => {

    const supabase = await createClient()
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*, client:clients(*)') // 'client' is the alias for the joined data
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching invoices:", error);
    }

    const { data: payments, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', clientId);

    if (paymentError) {
        console.error("Error fetching payments:", paymentError);
    }

    // This data is not used in the ledger, but fetching it here is fine
    const { data: bank_accounts, error: bankError } = await supabase
        .from('bank_accounts')
        .select('*');

    if (bankError) {
        console.error("Error fetching bank accounts:", bankError);
    }

    // --- CHANGE: Construct a more robust ledgerData object ---
    // Extract the client data from the first invoice (it's the same for all)
    const clientData = invoices && invoices.length > 0 ? invoices[0].client : null;

    const ledgerData = {
        client: clientData, // Add the top-level client object
        invoices,
        payments,
        // bank_accounts is not needed for the ledger PDF itself
    };

    return (
        <>
            <div className="flex flex-row gap-1 items-center justify-between">
                <h1 className='font-recoleta text-pretty text-2xl font-extrabold leading-[105%]'>Invoices</h1>
                {/* Pass the new ledgerData object */}
                <AddInvoice ledgerData={ledgerData} clientId={clientId} />
            </div>
            <div className='grid grid-cols-1 gap-5'>
                <div className='space-y-3'>
                    <div>
                        {/* Note: InvoiceData will need to be updated to expect this new structure too */}
                        <InvoiceData data={{ client: clientData, invoices, payments, bank_accounts }} />
                    </div>
                    <div className='space-y-3'>
                        {invoices?.map(invoice => (
                            // The invoice object passed to InvoiceItem already contains the client data
                            <InvoiceItem key={invoice.id} invoice={invoice} />
                        ))}
                        {invoices?.length === 0 && (
                            <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                                <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No Invoices Yet!</h2>
                                <p className="text-muted-foreground text-pretty max-w-[500px]">
                                    You have not added any invoices yet. Get started by adding a new invoice.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllInvoices;