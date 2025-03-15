'use server'

import { z } from 'zod'
import { register } from '@/actions/auth'

// Schema to validate the registration form data
const registerSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, 'The password is too short'),
    repeatPassword: z.string()
}).refine(data => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
})

/**
 Handles the registration logic:
 1. Validates the form data using the schema.
 2. If valid, calls the register function to create the user.
 3. Returns appropriate success/error messages.
 */
export async function handleRegister(prevState: unknown, formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    const result = registerSchema.safeParse({ email, name, password, repeatPassword });

    if (!result.success) {
        return {
            success: false,
            message: null,
            error: result.error.errors[0].message
        };
    }
    try {
        const registerError = await register(name, email, password);
        if (registerError) {
            return { success: false, message: null, error: registerError };
        }

        return { success: true, message: "User created Successfully! Verify your email", error: null };
    } catch {
        return { success: false, message: null, error: "Register action failed" };
    }
}