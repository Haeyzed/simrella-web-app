"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import type { User } from "@/types/api"
import { signOut } from "next-auth/react"
import { RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from "react-icons/ri"
import Link from "next/link"

interface UserProfileDropdownProps {
    user: User
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!user) return null

    const fullName = user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim()
    const email = user.email || ""
    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={fullName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{fullName}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0 bg-gray-50">
                <div className="p-4 flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={fullName} />
                        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h3 className="font-medium text-lg">{fullName}</h3>
                        <p className="text-sm text-gray-500">{email}</p>
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <Link href="/account-settings">
                        <DropdownMenuItem className="py-3 px-4 cursor-pointer hover:bg-gray-100">
                            <RiUser3Line className="mr-3 h-5 w-5 text-gray-500" />
                            <span>Account Settings</span>
                        </DropdownMenuItem>
                    </Link>

                    <Link href="/change-password">
                        <DropdownMenuItem className="py-3 px-4 cursor-pointer hover:bg-gray-100">
                            <RiSettings4Line className="mr-3 h-5 w-5 text-gray-500" />
                            <span>Change Password</span>
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem
                        className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <RiLogoutBoxRLine className="mr-3 h-5 w-5 text-gray-500" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

