'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {

    const email = formData.get("email") + "@gmail.com";
    const password = formData.get("password");


    if (!email || !password) {
        return { success: false, error: "Email and password are required." };
    }

    const supabase = await createClient()


    const data = {
        email: email,
        password: password
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log("Login failed for:", email);
        return { success: false, error: "Invalid email or password." };
    }

    console.log("Login successful for:", email);

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}