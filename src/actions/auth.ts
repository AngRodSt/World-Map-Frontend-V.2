'use server'

import { cookies } from "next/headers"
import axiosClient from "@/config/axios"
import handleApiError from "@/utils/handleApiError";
import { getCookies } from "@/utils/getCookies";
import { Auth } from "@/types/auth";

/*
 Authenticates the user by retrieving their profile using the token stored in cookies.
 Returns the authenticated user or an error if the token is invalid.
 */
export async function authenticate() {
    const cookieStore = await cookies()
    const token = cookieStore.get('MapToken')
    if (!token?.value) {
        return { user: null, error: 'Inexisten Data' };
    }
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token.value}`
        }
    }
    try {
        const { data } = await axiosClient('/profile', config)
        return { user: data.user, error: null }
        
    } catch (error) {
        return { user: null, error: handleApiError(error) }
    }
}

/*
 Logs in a user by sending the email and password to the backend.
 If successful, stores the token in cookies and returns the user data.
 */
export async function login(email: string, password: string) {
    try {
        const { data } = await axiosClient.post('/login', { email, password });

        const cookieStore = await cookies()
        cookieStore.set("MapToken", data.token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })
        return { user: data, error: null }
    } catch (error) {
        return { user: null, error: handleApiError(error) }
    }
}

/*
 Registers a new user by sending their name, email, and password to the backend.
 Returns null if registration is successful, otherwise returns an error.
 */
export async function register(name: string, email: string, password: string) {
    try {
        await axiosClient.post('/', { name, email, password })
        return null
    } catch (error) {
        return handleApiError(error)
    }
}

/*
 Sends a password reset email to the user.
 Returns null if the email is sent successfully, otherwise returns an error.
 */
export async function sendEmailResetPassword({ email }: { email: string }) {
    try {
        await axiosClient.post('/resetPassword', { email })
        return null
    } catch (error: unknown) {
        return handleApiError(error)
    }
}

/*
 Verifies a password reset token and updates the user's password.
 Returns whether the operation was successful and a message with the result.
 */
export async function TokenVerifierPass(token: string, password: string) {
    let isValid = false;
    let msg: string | null = null

    try {
        const url = `/resetPassword/${token}`
        const { data } = await axiosClient.post(url, { password })
        msg = data.msg
        isValid = true;

    } catch (error: unknown) {
        msg = handleApiError(error)

    }
    return { isValid, msg }

}

/*
 Updates the user's profile with the provided FormData.
 Returns the updated user data or an error if the operation fails.
 */
export async function update(formData: FormData) {
    const token = await getCookies()
    if (!token) {
        return null;
    }
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    }
    try {
        const { data } = await axiosClient.post(`/profile/${formData.get("_id")}`, formData, config)
        const { user }: { user: Auth } = data
        return { user: user, error: null }
    } catch (error: unknown) {
        return { user: null, error: handleApiError(error) }
    }
}

/*
 Changes the authenticated user's password by sending the current and new passwords.
 Returns null if the change is successful, otherwise returns an error.
 */
export async function changePassword({ info }: {
    info: {
        currentPassword: string,
        newPassword: string
    }
}) {
    const token = await getCookies()

    if (!token) {
        return null;
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    try {
        await axiosClient.post('/changePassword', info, config)
        return null
    } catch (error: unknown) {
        return handleApiError(error)
    }
}

/*
 Logs the user out by deleting the authentication token stored in cookies.
 */
export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("MapToken")
}

