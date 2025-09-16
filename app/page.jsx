"use client"; // This makes the component a Client Component

import { useState } from 'react';
import { useFormStatus } from 'react-dom'; // Hook for server action status
import Navbar from "@/components/LandingPage/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "./actions"; // Your server action

// A separate component for the submit button to utilize useFormStatus
function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} aria-disabled={pending}>
            {pending ? "Logging in..." : "Login"}
        </Button>
    );
}

export default function Home() {
    const [errorMessage, setErrorMessage] = useState("");

    // This function will be called when the form is submitted
    const handleLogin = async (formData) => {
        setErrorMessage(""); // Clear any previous errors

        const result = await login(formData);

        if (!result.success) {
            setErrorMessage(result.error || "An unexpected login error occurred.");
        } else {
            // Handle successful login (e.g., redirect to dashboard)
            console.log(result.message);
            // Example: router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen h-full w-full flex flex-col items-center">
            {/* <Navbar /> Uncomment if you want to include your Navbar */}
            <div className="max-w-[1260px] px-4 flex flex-col min-h-screen h-full w-full">

                <div className="flex-1 flex justify-center items-center pb-28">
                    <Card className="max-w-[400px] w-full border-accent border">
                        <CardHeader>
                            <h1 className="text-2xl font-recoleta font-bold">
                                Login to your account
                            </h1>
                            <p className="opacity-50">
                                Enter your email below to login to your account
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Use the `action` prop for your server action handler */}
                            <form className="flex flex-col gap-4" action={handleLogin}>
                                <label className="flex flex-col gap-1">
                                    <span className="font-semibold">Username</span>
                                    <Input
                                        className="!bg-card"
                                        type="text"
                                        name="email"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="font-semibold">Password</span>
                                    <Input
                                        className="!bg-card"
                                        type="password"
                                        name="password"
                                        required
                                    />
                                </label>

                                {errorMessage && (
                                    <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                                )}

                                {/* Use the LoginButton component */}
                                <LoginButton />
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}