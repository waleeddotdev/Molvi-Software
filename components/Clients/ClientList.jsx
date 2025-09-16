// File: app/dashboard/clients/ClientList.js (example path)

"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ClientItem from './ClientItem';

const ClientList = ({ initialClients }) => {
    // State to hold the user's search query
    const [searchQuery, setSearchQuery] = useState('');

    // useMemo is used for performance. It will only re-filter the clients
    // when the search query or the initial list of clients changes.
    const filteredClients = useMemo(() => {
        // If there's no search query, return the original full list
        if (!searchQuery) {
            return initialClients;
        }

        // Otherwise, filter the list based on the customer_name
        return initialClients.filter(client =>
            client.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, initialClients]); // Dependencies for the memoization

    return (
        <div className='space-y-4'>
            {/* The Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by customer name..."
                    className="pl-10 w-full md:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* The List of Filtered Clients */}
            <div className='space-y-3'>
                {filteredClients.map(client => (
                    <ClientItem key={client.id} client={client} />
                ))}

                {/* Conditional empty state message */}
                {filteredClients.length === 0 && (
                    <div className="text-center py-20 flex flex-col justify-center items-center rounded-lg">
                        <h2 className="font-guthenBloots text-5xl font-thin mb-2">
                            No Clients Found
                        </h2>
                        <p className="text-muted-foreground text-pretty max-w-[500px]">
                            Your search for "{searchQuery}" did not return any results.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;