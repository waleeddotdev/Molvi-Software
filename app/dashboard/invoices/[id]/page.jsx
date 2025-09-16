import React from 'react'
import AddInvoice from '@/components/Invoices/AddInvoice'
import AllInvoices from '@/components/Invoices/AllInvoices'

const page = ({ params }) => {
    return (
        <div className='space-y-4 md:space-y-8 '>

         
                <AllInvoices clientId={params.id} />
            
        </div>
    )
}

export default page