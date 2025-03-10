'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAuth from "@/hooks/UseAuth";
import { useRouter} from "next/navigation";
import { useEffect, ReactNode } from "react";


const LayoutAdmin = ({ children }: { children: ReactNode }) => {

    // Get authentication state and charging status from the custom hook
    const { auth, charging }: { auth: { _id?: string } | null; charging: boolean } = useAuth();
    const router = useRouter();

    // Determine if the current path is one of the admin pages
    useEffect(() => {
        if (!auth?._id && !charging) {
            router.push('/');
        }
    }, [auth, charging, router])

    if (charging) {
        return <div>Loading...</div>;
    }
    return (
        <div id="root" className={`relative w-full`}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}


export default LayoutAdmin