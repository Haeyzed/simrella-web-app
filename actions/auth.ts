"use server"

import { signIn, signOut } from "@/auth"
import { httpClient } from "@/lib/http-client"
import type { User } from "@/types/api"
import {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyOTPSchema,
    changePasswordSchema,
    updateProfileSchema,
} from "@/lib/validations"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"

export async function login(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        remember: formData.get("remember") === "on",
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields. Failed to log in.",
        }
    }

    const { email, password, remember } = validatedFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            remember: remember ? "true" : "false",
            redirectTo: "/dashboard",
        })

        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: null, message: "Invalid email or password" }
                default:
                    return { success: false, error: null, message: "Something went wrong" }
            }
        }
        throw error
    }
}

export async function register(prevState: any, formData: FormData) {
    try {
        const response = await httpClient.post<any>(
            "/auth/register",
            {
                first_name: formData.get("first_name"),
                last_name: formData.get("last_name"),
                email: formData.get("email"),
                password: formData.get("password"),
                password_confirmation: formData.get("password_confirmation"),
            },
            { auth: false },
        )

        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Registration error:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Registration failed",
            }
        }

        return { success: false, error: null, message: "Registration failed. Please try again." }
    }
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}

export async function getProfile() {
    try {
        const response = await httpClient.get<User>("/auth/me")
        return response.data
    } catch (error) {
        console.error("Failed to fetch profile:", error)
        throw new Error("Failed to fetch profile")
    }
}

export async function updateProfile(prevState: any, formData: FormData) {
    const validatedFields = updateProfileSchema.safeParse({
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        bio: formData.get("bio"),
        country: formData.get("country"),
        state: formData.get("state"),
        postal_code: formData.get("postal_code"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields. Failed to update profile.",
        }
    }

    try {
        const response = await httpClient.post<User>("/auth/profile", validatedFields.data)
        revalidatePath("/profile")
        return { success: true, data: response.data, message: "Profile updated successfully" }
    } catch (error: any) {
        console.error("Failed to update profile:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to update profile",
            }
        }

        return { success: false, error: null, message: "Failed to update profile" }
    }
}

export async function forgotPassword(prevState: any, formData: FormData) {
    const validatedFields = forgotPasswordSchema.safeParse({
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid email address.",
        }
    }

    try {
        const response = await httpClient.post<any>("/auth/forgot-password", validatedFields.data, { auth: false })
        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Failed to send reset password email:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to send reset password email",
            }
        }

        return { success: false, error: null, message: "Failed to send reset password email" }
    }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const validatedFields = resetPasswordSchema.safeParse({
        email: formData.get("email"),
        otp: formData.get("otp"),
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields. Failed to reset password.",
        }
    }

    try {
        const response = await httpClient.post<any>("/auth/reset-password", validatedFields.data, { auth: false })
        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Failed to reset password:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to reset password",
            }
        }

        return { success: false, error: null, message: "Failed to reset password" }
    }
}

export async function verifyEmail(prevState: any, formData: FormData) {
    const email = formData.get("email") as string

    const validatedFields = verifyOTPSchema.safeParse({
        otp: formData.get("otp"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid OTP.",
        }
    }

    try {
        const response = await httpClient.post<any>(
            `/auth/email/verify/${encodeURIComponent(email)}`,
            validatedFields.data,
            { auth: false },
        )
        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Failed to verify email:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to verify email",
            }
        }

        return { success: false, error: null, message: "Failed to verify email" }
    }
}

export async function resendVerification() {
    try {
        const response = await httpClient.post<any>("/auth/email/resend", {})
        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Failed to resend verification email:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to resend verification email",
            }
        }

        return { success: false, error: null, message: "Failed to resend verification email" }
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const validatedFields = changePasswordSchema.safeParse({
        current_password: formData.get("current_password"),
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Invalid fields. Failed to change password.",
        }
    }

    try {
        const response = await httpClient.post<any>("/auth/change-password", validatedFields.data)
        return { success: true, message: response.message }
    } catch (error: any) {
        console.error("Failed to change password:", error)

        // Handle validation errors from the API
        if (error.response?.data?.errors) {
            return {
                success: false,
                error: error.response.data.errors,
                message: error.response.data.message || "Failed to change password",
            }
        }

        return { success: false, error: null, message: "Failed to change password" }
    }
}

