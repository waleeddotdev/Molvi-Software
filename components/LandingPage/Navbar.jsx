"use client";

import Link from 'next/link';
import React, { useState } from 'react'; // Import useState
import { Button } from '../ui/button';
import { createClient } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';
import { Bird, GlobeLock, Package, ScrollText, Settings, UserRound, UsersRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedText from "./AnimatedText"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet"

const Navbar = () => {
    const [isSigningOut, setIsSigningOut] = useState(false); // New state for loading
    const pathname = usePathname();

    const handleSignOut = async () => {
        setIsSigningOut(true); // Set loading to true
        const supabase = createClient();
        await supabase.auth.signOut();
        // After signing out, refresh the page to reflect the new authentication state.
        // This will typically redirect the user if your root layout or middleware handles authentication checks.
        window.location.reload();
        // setIsSigningOut(false); // This line won't be reached after reload, but good practice for other flows
    };

    return (
        <>
            <div className='hidden sm:flex w-full py-5 flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center gap-10'>
                    <AnimatedText main={"Molvi"} accent={"Software"} />
                    <div className='flex flex-row justify-center items-center gap-2 md:gap-5'>
                        <NavLink icon={<UsersRound className='size-5' />} isOpen={pathname === "/dashboard"} href={'/dashboard'}>Clients</NavLink>
                        {/* <NavLink icon={<ScrollText className='size-5' />} isOpen={pathname.includes('/dashboard/invoice')} href={'/dashboard/invoices'}>Invoices</NavLink> */}
                        <NavLink icon={<Package className='size-5' />} isOpen={pathname === "/dashboard/inventory"} href={'/dashboard/inventory'}>Inventory</NavLink>
                        <NavLink icon={<GlobeLock className='size-5' />} isOpen={pathname === "/dashboard/providers"} href={'/dashboard/providers'}>Providers</NavLink>

                    </div>
                </div>
                <div className='space-x-5'>
                    {pathname.includes('dashboard') ?
                        <Button
                            onClick={handleSignOut} // Use the new handler
                            disabled={isSigningOut} // Disable button when signing out
                        >
                            {isSigningOut ? "Logging out..." : "Logout"} {/* Change text when loading */}
                        </Button>
                        :
                        <Link href={'/dashboard'}>
                            <Button>Dashboard</Button>
                        </Link>
                    }
                </div>
            </div>
            <div className='sm:hidden flex flex-row p-4'>
              
                <Sheet>
                    <SheetTrigger asChild>
                        <Button >{'Open Sidebar >'}</Button>
                    </SheetTrigger>
                    <SheetContent side='left'>
                        <SheetHeader>
                            <SheetTitle><AnimatedText main={"Molvi"} accent={"Software"} /></SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col px-4 gap-10'>
                          
                            <div className='flex flex-col gap-2 md:gap-5'>
                                <NavLink icon={<UsersRound className='size-5' />} isOpen={pathname === "/dashboard"} href={'/dashboard'}>Clients</NavLink>
                                {/* <NavLink icon={<ScrollText className='size-5' />} isOpen={pathname.includes('/dashboard/invoice')} href={'/dashboard/invoices'}>Invoices</NavLink> */}
                                <NavLink icon={<Package className='size-5' />} isOpen={pathname === "/dashboard/inventory"} href={'/dashboard/inventory'}>Inventory</NavLink>
                                <NavLink icon={<GlobeLock className='size-5' />} isOpen={pathname === "/dashboard/providers"} href={'/dashboard/providers'}>Providers</NavLink>

                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

export default Navbar;

const NavLink = ({ href, children, icon, isOpen }) => {
    return (
        <Link className={` opacity-100 relative flex flex-row items-center gap-1.5 py-2 px-3 rounded-full transition-all ${isOpen ? 'text-primary-foreground' : 'hover:bg-accent/50'}`} href={href}>
            <AnimatePresence mode=''>
                {isOpen && <motion.span layout layoutId='circle' className='absolute z-5 top-0 left-0 w-full h-full bg-primary text-primary-foreground rounded-full ' ></motion.span>}
            </AnimatePresence>
            <span className='z-10 flex flex-row justify-center items-center gap-1.5'>
                {icon} <span className=''>{children}</span>
            </span>


        </Link>
    );
};