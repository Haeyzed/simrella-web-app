import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { LoginResponse } from "@/types/api"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
        error: "/error",
        verifyRequest: "/verify",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // We'll return true here because the actual route protection is handled in middleware.ts
            // This prevents conflicts between the two protection mechanisms
            return true
        },
        jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).access_token
                token.user = (user as any).user
            }
            return token
        },
        session({ session, token }) {
            session.accessToken = token.accessToken as string
            session.user = token.user as any
            return session
        },
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember Me", type: "checkbox" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const response = await fetch("https://simbrella-api.laravel.cloud/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            remember: credentials.remember === "true",
                        }),
                    })

                    if (!response.ok) {
                        return null
                    }

                    const data = await response.json()

                    if (!data.success) {
                        return null
                    }

                    // Return the data that will be passed to the callbacks
                    return data.data as LoginResponse
                } catch (error) {
                    console.error("Authentication error:", error)
                    return null
                }
            },
        }),
    ],
}

