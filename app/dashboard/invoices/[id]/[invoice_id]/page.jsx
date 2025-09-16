import React from 'react'
import AddInvoice from '@/components/Invoices/AddInvoice'
import AllInvoices from '@/components/Invoices/AllInvoices'

const page = ({ params }) => {
    return (
        <div className='space-y-4 md:space-y-8 '>

            <div className="flex flex-row gap-1 items-center justify-between">
                <h1 className='font-recoleta text-pretty text-2xl font-extrabold leading-[105%]'>Invoices</h1>
                <AddInvoice clientId={params.id} />
            </div>
            <div className='grid grid-cols-1 gap-5'>
                <AllInvoices clientId={params.id} />
            </div>
        </div>
    )
}

export default page