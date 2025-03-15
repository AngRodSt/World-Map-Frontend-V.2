'use server'

import { z } from 'zod';
import { sendEmailResetPassword } from '@/actions/auth';
import { TokenVerifierPass } from '@/actions/auth';

// Schema validation for email format during password reset request
const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email format')
})

// Handle password reset request by verifying email
export async function handleResetPassword(prevState: unknown, formData: FormData,) {
    const email = formData.get('email') as string

    const result = resetPasswordSchema.safeParse({ email })

    if (!result.success) {
        return { success: false, message: null, error: result.error.errors[0].message }
    }
    // Send the reset password email and check for errors
    const sendEmailError = await sendEmailResetPassword({ email })
    if (sendEmailError) {
        return { success: false, message: null, error: sendEmailError };
    }
    return { success: true, message: "Email send it correctly, please check your imbox", error: null };
}

// Schema validation for password and repeat password during password reset confirmation
const confirmNewPasswordSchema = z.object({
    password: z.string().min(6, 'The password is too short'),
    repeatPassword: z.string()
}).refine(data => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
})

// Handle the confirmation of the new password after token verification
export async function handleConfirmNewPassword(prevState: unknown, formData: FormData, token: string) {
    const password = formData.get('password') as string
    const repeatPassword = formData.get('repeatPassword') as string

    // Validate the new password and repeat password
    const result = confirmNewPasswordSchema.safeParse({ password, repeatPassword })

    if (!result.success) {
        return { success: false, message: null, error: result.error.errors[0].message }
    }
    const { isValid, msg } = await TokenVerifierPass(token, password);
    if (!isValid) {
        return { success: false, message: null, error: msg }
    }
    return { success: true, message: msg, error: null }



}