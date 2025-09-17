"use server"

import { createClient } from '../../utils/supabase/server'
import BankItem from './BankItem'

const AllBank = async () => {

    const supabase = await createClient()
    // Changed: Fetch from 'bank' table
    const { data: banks, error } = await supabase.from('bank_accounts').select('*')

    if (error) {
        console.error("Error fetching bank:", error)
    }

    return (
        <div className='space-y-3'>
            {/* Changed: Map over bank and pass to ProviderItem */}
            {banks?.map(bank => (
                <BankItem key={bank.id} bank={bank} />
            ))}
            {banks?.length === 0 && (
                <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                    {/* Changed: Updated empty state message */}
                    <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No bank Yet!</h2>
                    <p className="text-muted-foreground text-pretty max-w-[500px]">
                        You have not added any bank yet. Get started by adding a new provider.
                    </p>
                </div>
            )}
        </div>
    )
}

export default AllBank