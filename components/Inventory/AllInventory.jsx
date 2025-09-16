"use server"

import { createClient } from '../../utils/supabase/server'
import InventoryItem from './InventoryItem'

const AllInventory = async () => {

    const supabase = await createClient()
    const { data: inventory, error } = await supabase.from('inventory').select('*')
    console.log(inventory)

    const {data: providers, error: providerError} = await supabase.from('providers').select('id, name')

    if (providerError) {
        console.error("Error fetching providers:", providerError)
        return <div className="text-center py-10"><p className="text-red-500">Failed to load providers.</p></div>
    }

    if (error) {
        console.error("Error fetching inventory:", error)
        return <div className="text-center py-10"><p className="text-red-500">Failed to load inventory.</p></div>
    }

    return (
        <div className='space-y-3'>
            {/* Corrected: Map over the 'inventory' data */}
            {inventory?.map(product => (
                <InventoryItem providers={providers}  key={product.id} product={product} />
            ))}
            {inventory?.length === 0 && (
                <div className="text-center py-20 flex flex-col justify-center items-center rounded-lg">
                    {/* Corrected: Updated empty state message */}
                    <h2 className="font-guthenBloots text-5xl font-thin mb-2">No Inventory Yet!</h2>
                    <p className="text-muted-foreground text-pretty max-w-[500px]">
                        You have not added any products yet. Get started by adding a new product.
                    </p>
                </div>
            )}
        </div>
    )
}

export default AllInventory