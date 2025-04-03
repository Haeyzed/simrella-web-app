"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { RxDashboard } from "react-icons/rx"
import {
    RiChatSmile3Line,
    RiPagesLine,
    RiInformationLine,
    RiShieldStarLine,
    RiBriefcase4Line,
    RiSettings4Line,
} from "react-icons/ri"
import { MdOutlineChatBubbleOutline } from "react-icons/md"
import { LuScrollText } from "react-icons/lu"
import { useHasPermission, useIsSuperAdmin } from "@/lib/auth-utils"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useMemo } from "react"

// Define navigation items with required permissions
const navItems = [
    {
        name: "Dashboard",
        icon: <RxDashboard size={20} />,
        path: "/dashboard",
        permission: null, // Everyone can access dashboard
    },
    {
        name: "Blog Management",
        icon: <RiChatSmile3Line size={20} />,
        path: "/blog-management",
        permission: "blog_view",
    },
    {
        name: "Home page Mgt",
        icon: <RiPagesLine size={20} />,
        path: "/homepage-management",
        permission: "home_page_view",
    },
    {
        name: "Service Management",
        icon: <MdOutlineChatBubbleOutline size={20} />,
        path: "/service-management",
        permission: null, // Add appropriate permission
    },
    {
        name: "Reports and analysis",
        icon: <LuScrollText size={20} />,
        path: "/reports-analysis",
        permission: null, // Add appropriate permission
    },
    {
        name: "About us page mgt",
        icon: <RiInformationLine size={20} />,
        path: "/about-us-management",
        permission: null, // Add appropriate permission
    },
    {
        name: "Contact mgt",
        icon: <RiShieldStarLine size={20} />,
        path: "/contact-management",
        permission: "contact_view",
    },
    {
        name: "Career Page mgt",
        icon: <RiBriefcase4Line size={20} />,
        path: "/career-management",
        permission: "career_view",
    },
    {
        name: "Settings",
        icon: <RiSettings4Line size={20} />,
        path: "/settings",
        permission: null, // Everyone can access settings
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const isSuperAdmin = useIsSuperAdmin()

    // Call hooks at the top level for each permission
    const hasPermissionBlogView = useHasPermission("blog_view")
    const hasPermissionHomePageView = useHasPermission("home_page_view")
    const hasPermissionContactView = useHasPermission("contact_view")
    const hasPermissionCareerView = useHasPermission("career_view")

    // Function to check if user has permission for a specific item
    const checkPermission = (permissionName: string | null): boolean => {
        if (!permissionName) return true
        if (isSuperAdmin) return true

        switch (permissionName) {
            case "blog_view":
                return hasPermissionBlogView
            case "home_page_view":
                return hasPermissionHomePageView
            case "contact_view":
                return hasPermissionContactView
            case "career_view":
                return hasPermissionCareerView
            default:
                return false
        }
    }

    return (
        <Sidebar className="border-r border-gray-200 bg-white" {...props}>
            <SidebarHeader className="py-6 px-4">
                <Link href="/dashboard" className="flex items-center">
                    <Image src="/images/logo.png" alt="Simbrella Logo" width={140} height={40} className="h-10 w-auto" />
                </Link>
            </SidebarHeader>
            <SidebarContent className="gap-1 px-2">
                <SidebarMenu>
                    {navItems.map((item) => {
                        // Check if user has permission to see this item
                        if (!checkPermission(item.permission)) {
                            return null
                        }

                        const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)

                        return (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild isActive={isActive}>
                                    <Link href={item.path} className="flex items-center gap-3">
                                        <span className={`${isActive ? "text-[#FF9B21]" : "text-gray-500"}`}>{item.icon}</span>
                                        <span className={isActive ? "font-medium" : ""}>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

