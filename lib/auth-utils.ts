"use client"

import { useSession } from "next-auth/react"
import { User, Permission } from "@/types/api"

// Check if user has a specific permission
export function useHasPermission(permissionName: string): boolean {
    const { data: session } = useSession()
    const user = session?.user as User | undefined

    if (!user) return false

    // Super admin has all permissions
    if (user.roles?.some(role => role.name === 'super-admin')) {
        return true
    }

    // Check if user has the specific permission
    return user.permissions?.some(permission => permission.name === permissionName) || false
}

// Check if user has any of the specified permissions
export function useHasAnyPermission(permissionNames: string[]): boolean {
    const { data: session } = useSession()
    const user = session?.user as User | undefined

    if (!user) return false

    // Super admin has all permissions
    if (user.roles?.some(role => role.name === 'super-admin')) {
        return true
    }

    // Check if user has any of the specified permissions
    return permissionNames.some(permName =>
        user.permissions?.some(permission => permission.name === permName)
    ) || false
}

// Get current user from session
export function useCurrentUser(): User | null {
    const { data: session } = useSession()
    return (session?.user as User) || null
}

// Check if user is super admin
export function useIsSuperAdmin(): boolean {
    const { data: session } = useSession()
    const user = session?.user as User | undefined

    if (!user) return false

    return user.roles?.some(role => role.name === 'super-admin') || false
}
