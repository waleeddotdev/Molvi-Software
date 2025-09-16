// File: app/dashboard/clients/ClientSearch.js (example path)

"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

const ClientSearch = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // use-debounce is a great library to prevent sending a request for every keystroke.
    // This will wait 300ms after the user stops typing before updating the URL.
    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by customer name..."
                className="pl-10 w-full md:w-1/3"
                onChange={(e) => handleSearch(e.target.value)}
                // Ensure the input field displays the current search query from the URL
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    );
};

export default ClientSearch;