'use client'

import { useEffect, useState } from "react"
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import TokenVerifier from "./TokenVerifier";



const ConfirmAccount = () => {
    const params = useParams();
    const token = params?.token as string | undefined
    const [alert, setAlert] = useState<({ msg: string | null, error: boolean })>({ msg: '', error: false })
    const [verified, setVerified] = useState(false);


    useEffect(() => {
        if (!token) return;
        const verifyToken = async () => {
            const { isValid, msg } = await TokenVerifier(token);
            setVerified(isValid);
            setAlert({ msg, error: !isValid });
        }; 
        verifyToken();    
    }, [token])

    const {msg} = alert
    return (
        <>
            {msg && <Alert alert={alert} />}

            <div className="mt-10 w-full">
                {verified &&
                    (<Link href="/"> {<Button text={'Login! →'} />}</Link>
                    )}
            </div>

        </>
    )
}

export default ConfirmAccount
