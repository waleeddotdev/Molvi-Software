"use server"

import { createClient } from '../../utils/supabase/server'
import ProviderItem from './ProviderItem' // Import the new ProviderItem component

const AllProviders = async () => {

    const supabase = await createClient()
    // Changed: Fetch from 'providers' table
    const { data: providers, error } = await supabase.from('providers').select('*')

    if (error) {
        console.error("Error fetching providers:", error)
    }

    return (
        <div className='space-y-3'>
            {/* Changed: Map over providers and pass to ProviderItem */}
            {providers?.map(provider => (
                <ProviderItem key={provider.id} provider={provider} />
            ))}
            {providers?.length === 0 && (
                <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                    {/* Changed: Updated empty state message */}
                    <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No Providers Yet!</h2>
                    <p className="text-muted-foreground text-pretty max-w-[500px]">
                        You have not added any providers yet. Get started by adding a new provider.
                    </p>
                </div>
            )}
        </div>
    )
}

export default AllProviders