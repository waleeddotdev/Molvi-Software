import Navbar from "@/components/LandingPage/Navbar";
import { Toaster } from 'react-hot-toast';

const layout = ({ children }) => {

    return (
        <div className="min-h-screen bg-background h-full w-full flex flex-col items-center px-4">
            <div className="max-w-[1500px] relative flex flex-col min-h-screen h-full w-full pb-5">
                <Navbar />
                {/* <AnimatedText main={"Assalamualaikum, "} accent={"Molvi Bhai"} /> */}
                <div className="flex-1 h-full relative rounded-xl p-4 md:p-8 bg-background-secondary">
                    {children}
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default layout