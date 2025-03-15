'use client'

import { useEffect, useState } from "react"
import toast, {Toaster} from "react-hot-toast";
import Button from "@/components/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import TokenVerifier from "./TokenVerifier";



const ConfirmAccount = () => {
    // Extract token from URL params
    const params = useParams();
    const token = params?.token as string | undefined 

    // State to track if the token is verified   
    const [verified, setVerified] = useState(false);


    useEffect(() => {
        if (!token) return;
        // Function to verify the token asynchronously
        const verifyToken = async () => {
            const { isValid, msg } = await TokenVerifier(token);
            setVerified(isValid);
            if(isValid){
                toast.success(msg)
            }
            else{
                toast.error(msg)
            }
        }; 
        verifyToken();    
    }, [token])

    return (
        <>
            <div><Toaster /></div>
            <div className="mt-10 w-full">
                {verified &&
                    (<Link href="/"> {<Button text={'Login! →'} />}</Link>
                    )}
            </div>

        </>
    )
}

export default ConfirmAccount
