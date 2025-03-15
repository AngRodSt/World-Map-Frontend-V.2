'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAuth from "@/hooks/UseAuth";


import {  ReactNode } from "react";

const LayoutAdmin = ({ children }: { children: ReactNode }) => {

    const { auth, charging } = useAuth();

    if (charging || !auth?._id) {
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