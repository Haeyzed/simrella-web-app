"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

interface AuthProviderProps {
    children: ReactNode
}

export default function NextAuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>
}

