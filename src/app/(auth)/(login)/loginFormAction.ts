'use server'

import { login } from '@/actions/auth'
import { z } from 'zod'

// Define schema for validating login input
const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
})


export async function handleLogin(prevState: unknown, formData: FormData) {

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    try {
         // Validate input against the schema
        loginSchema.parse({ email, password })

        // Attempt to log in with provided credentials
        const { user, error } = await login(email, password)
        if (error) {
            return { success: false, user: null, error: error };
        }
        return { success: true, user: user, error: null };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, user: null, error: error.errors[0].message };
        }
        return { success: false, user: null, error: "Login failed" };
    }
}


