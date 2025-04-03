import type React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {auth} from "@/auth";
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Check if user is authenticated
    // const session = await getServerSession(authOptions)
    const session = await auth()
    //
    if (!session) {
        redirect("/login")
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AppSidebar />
                <SidebarInset className="bg-[#FFFFFF]">
                    <header className="bg-white sticky top-0 flex h-16 shrink-0 items-center justify-between border-b px-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="hidden md:flex" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>

                            <UserProfileDropdown user={session.user} />
                        </div>
                    </header>

                    <main className="flex-1 bg-[#EFF4FF]">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

