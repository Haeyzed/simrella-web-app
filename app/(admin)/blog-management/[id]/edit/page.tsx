"use client"

import { useHasPermission } from "@/lib/auth-utils"
import { BlogForm } from "@/components/blog/blog-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getBlogPost } from "@/actions/blog"
import { toast } from "sonner"
import type { BlogPost } from "@/types/api"

interface EditBlogPageProps {
    params: { id: string }
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
    const router = useRouter()
    const canUpdate = useHasPermission("blog_update")
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch blog post
    useEffect(() => {
        async function fetchBlogPost() {
            try {
                const id = Number.parseInt(params.id)
                if (isNaN(id)) {
                    router.push("/blog-management")
                    return
                }

                const response = await getBlogPost(id)
                if (response.success && response.data) {
                    setBlogPost(response.data)
                } else {
                    toast("Error", {
                        description: "Failed to load blog post",
                    })
                    router.push("/blog-management")
                }
            } catch (error) {
                console.error("Error fetching blog post:", error)
                toast("Error", {
                    description: "Failed to load blog post",
                })
                router.push("/blog-management")
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogPost()
    }, [params.id, router])

    // Redirect if user doesn't have permission
    useEffect(() => {
        if (!canUpdate && !isLoading) {
            router.push("/blog-management")
        }
    }, [canUpdate, isLoading, router])

    if (!canUpdate || isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (!blogPost) {
        return null
    }

    return <BlogForm blogPost={blogPost} isEdit />
}

