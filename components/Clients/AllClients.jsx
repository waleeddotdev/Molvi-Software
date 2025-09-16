// File: app/dashboard/clients/AllClients.js

"use server"

import { createClient } from '../../utils/supabase/server'
import ClientList from './ClientList' // Import the new client component

const AllClients = async () => {

    const supabase = await createClient()
    const { data: clients, error } = await supabase.from('clients').select('*')

    if (error) {
        console.error("Error fetching clients:", error)
        // You might want to return an error message to the user here
        return <p className="text-red-500">Could not load clients.</p>;
    }

    // This handles the case where the database has no clients at all.
    if (!clients || clients.length === 0) {
        return (
            <div className="text-center py-20 flex flex-col justify-center items-center  rounded-lg">
                <h2 className=" font-guthenBloots text-5xl font-thin mb-2">No Clients Yet!</h2>
                <p className="text-muted-foreground text-pretty max-w-[500px]">
                    You have not added any clients yet. Get started by adding a new client.
                </p>
            </div>
        );
    }

    // Pass the full list of clients to the ClientList component,
    // which will handle the filtering.
    return <ClientList initialClients={clients} />
}

export default AllClients