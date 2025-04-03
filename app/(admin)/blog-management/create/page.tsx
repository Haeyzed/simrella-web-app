"use client"

import { useHasPermission } from "@/lib/auth-utils"
import { BlogForm } from "@/components/blog/blog-form"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";

export default function CreateBlogPage() {
    const router = useRouter()
    const canCreate = useHasPermission("blog_create")

    // Redirect if user doesn't have permission
    useEffect(() => {
        if (!canCreate) {
            router.push("/blog-management")
        }
    }, [canCreate, router])

    if (!canCreate) {
        return null
    }

    return (

        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col space-y-6">
                {/* Header with back button and title */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-semibold">Manage your Blogs Posts</h1>
                    </div>
                </div>
                <BlogForm />
            </div>
        </div>
    )
}

