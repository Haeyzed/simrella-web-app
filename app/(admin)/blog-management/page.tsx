"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Search, Edit, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useHasPermission } from "@/lib/auth-utils"
import { getBlogPosts } from "@/actions/blog"
import type { BlogPost } from "@/types/api"
import Link from "next/link"
import { toast } from "sonner"
import { BlogDeleteDialog } from "@/components/blog/blog-delete-dialog"

export default function BlogManagementPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("all")
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Check permissions
    const canCreate = useHasPermission("blog_create")
    const canUpdate = useHasPermission("blog_update")
    const canDelete = useHasPermission("blog_delete")

    // Fetch blog posts
    useEffect(() => {
        async function fetchBlogPosts() {
            setIsLoading(true)
            try {
                const status = activeTab === "all" ? "published" : activeTab === "drafts" ? "draft" : "published"
                const orderBy = activeTab === "top" ? "views" : "created_at"

                const response = await getBlogPosts(currentPage, 10, searchQuery, status, orderBy, "desc")

                if (response.success && response.data) {
                    setBlogPosts(response.data)
                    if (response.meta) {
                        setTotalPages(response.meta.last_page)
                        setTotalItems(response.meta.total)
                    }
                } else {
                    toast("Error", {
                        description: "Failed to load blog posts",
                    })
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error)
                toast("Error", {
                    description: "Failed to load blog posts",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogPosts()
    }, [activeTab, currentPage, searchQuery])

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1) // Reset to first page on new search
    }

    // Handle post deletion success
    const handleDeleteSuccess = (deletedId: number) => {
        setBlogPosts(blogPosts.filter((post) => post.id !== deletedId))
        toast("Success", {
            description: "Blog post deleted successfully",
        })
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

                    {canCreate && (
                        <Button
                            className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white"
                            onClick={() => router.push("/blog-management/create")}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add new Posts
                        </Button>
                    )}
                </div>

                {/* Tabs and search */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "all" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Published Posts
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "drafts" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                            onClick={() => setActiveTab("drafts")}
                        >
                            Drafts
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "top" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                            onClick={() => setActiveTab("top")}
                        >
                            Top Performing Posts
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            placeholder="Search for blogs"
                            className="pl-10 pr-4 h-10 w-full md:w-[300px] rounded-md border border-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <button type="submit" className="sr-only">
                            Search
                        </button>
                    </form>
                </div>

                {/* Blog posts list */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : blogPosts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No blog posts found</div>
                    ) : (
                        blogPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative w-full md:w-[200px] h-[200px] flex-shrink-0">
                                        <div className="absolute top-0 left-0 bg-[#FF9B21] text-white text-xs font-medium py-1 px-2 rounded-tl-md">
                                            OCTOBER 2024
                                        </div>
                                        <Image
                                            src={post.banner_image_url || "/images/newsletter.png"}
                                            alt={post.title}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-[#006633] text-white text-xs font-medium py-1 px-2 text-center">
                                            FINTECH
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                        <p className="text-gray-600 mb-4">{post.body?.substring(0, 200).replace(/<[^>]*>/g, "")}...</p>
                                        <div className="flex items-center text-[#FF9B21]">
                                            <Link href={`/blog-management/${post.id}`}>
                                                <span>Read more</span>
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                    <span>{post.views || 0} views</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                                        <line x1="16" x2="16" y1="2" y2="6" />
                                                        <line x1="8" x2="8" y1="2" y2="6" />
                                                        <line x1="3" x2="21" y1="10" y2="10" />
                                                    </svg>
                                                    <span>Published {post.formatted_created_at || post.created_at?.substring(0, 10)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {canUpdate && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-gray-600 border-gray-300"
                                                        onClick={() => router.push(`/blog-management/${post.id}/edit`)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                )}

                                                {canDelete && (
                                                    <BlogDeleteDialog
                                                        blogId={post.id}
                                                        blogTitle={post.title}
                                                        onSuccess={() => handleDeleteSuccess(post.id)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalItems)} of {totalItems}
                        </div>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNumber = i + 1
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant="outline"
                                        size="icon"
                                        className={`h-8 w-8 ${
                                            pageNumber === currentPage
                                                ? "bg-[#4040A1] text-white border-none"
                                                : "text-gray-600 border-gray-300"
                                        }`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            })}

                            {totalPages > 5 && (
                                <Button variant="outline" size="icon" className="h-8 w-8 text-gray-600 border-gray-300">
                                    ...
                                </Button>
                            )}

                            {currentPage < totalPages && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-gray-600 border-gray-300"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

