"use client"

import type * as React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createBlogPost, updateBlogPost } from "@/actions/blog"
import type { BlogPost } from "@/types/api"
import {
    ChevronLeft,
    Upload,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    ImageIcon,
    Link,
    List,
    Video,
    Headphones,
} from "lucide-react"
import { Editor } from "@tinymce/tinymce-react"
import Image from "next/image";

interface BlogFormProps {
    blogPost?: BlogPost
    isEdit?: boolean
}

export function BlogForm({ blogPost, isEdit = false }: BlogFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bannerImage, setBannerImage] = useState<File | null>(null)
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(blogPost?.banner_image_url || null)
    const [relatedImages, setRelatedImages] = useState<File[]>([])
    const [relatedImagesPreview, setRelatedImagesPreview] = useState<string[]>(
        blogPost?.images?.map((img) => img.image_url) || [],
    )

    const editorRef = useRef<any>(null)

    const bannerInputRef = useRef<HTMLInputElement>(null)
    const relatedImagesInputRef = useRef<HTMLInputElement>(null)

    const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setBannerImage(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (event) => {
                setBannerImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRelatedImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setRelatedImages((prev) => [...prev, ...files])

            // Create previews
            files.forEach((file) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    setRelatedImagesPreview((prev) => [...prev, event.target?.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDragOver = (e: React.DragEvent, type: "banner" | "related") => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.add("border-[#FF9B21]")
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove("border-[#FF9B21]")
    }

    const handleDrop = (e: React.DragEvent, type: "banner" | "related") => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove("border-[#FF9B21]")

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (type === "banner") {
                const file = e.dataTransfer.files[0]
                setBannerImage(file)

                // Create preview
                const reader = new FileReader()
                reader.onload = (event) => {
                    setBannerImagePreview(event.target?.result as string)
                }
                reader.readAsDataURL(file)
            } else {
                const files = Array.from(e.dataTransfer.files)
                setRelatedImages((prev) => [...prev, ...files])

                // Create previews
                files.forEach((file) => {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        setRelatedImagesPreview((prev) => [...prev, event.target?.result as string])
                    }
                    reader.readAsDataURL(file)
                })
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const form = e.target as HTMLFormElement
            const formData = new FormData(form)

            // Add the banner image if selected
            if (bannerImage) {
                formData.set("banner_image", bannerImage)
            }

            // Add related images if selected
            if (relatedImages.length > 0) {
                relatedImages.forEach((file) => {
                    formData.append("related_images[]", file)
                })
            }

            // Add the body content from the editor
            if (editorRef.current) {
                formData.set("body", editorRef.current.getContent())
            }

            // Set the status
            formData.set("status", status)

            let response
            if (isEdit && blogPost) {
                response = await updateBlogPost(blogPost.id, null, formData)
            } else {
                response = await createBlogPost(null, formData)
            }

            if (response.success) {
                toast("Success", {
                    description: response.message || `Blog post ${isEdit ? "updated" : "created"} successfully`,
                })
                router.push("/blog-management")
            } else {
                toast("Error", {
                    description: response.message || `Failed to ${isEdit ? "update" : "create"} blog post`,
                })
            }
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} blog post:`, error)
            toast("Error", {
                description: `Failed to ${isEdit ? "update" : "create"} blog post`,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePreview = () => {
        // Implement preview functionality
        toast("Preview", {
            description: "Preview functionality not implemented yet",
        })
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col space-y-6">
                {/* Header with back button and title */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold">{isEdit ? "Edit Blog Post" : "Add New Posts"}</h1>
                </div>

                <form onSubmit={(e) => handleSubmit(e, "published")}>
                    {/* Banner Image Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Up Load Banner image*</label>
                        <div
                            className={`border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors`}
                            onDragOver={(e) => handleDragOver(e, "banner")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "banner")}
                            onClick={() => bannerInputRef.current?.click()}
                        >
                            {bannerImagePreview ? (
                                <div className="relative w-full">
                                    <Image
                                        src={bannerImagePreview || "/placeholder.svg"}
                                        alt="Banner preview"
                                        className="max-h-48 mx-auto object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 mx-auto flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setBannerImage(null)
                                            setBannerImagePreview(null)
                                        }}
                                    >
                                        Change Image
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-[#FF9B21] mb-2" />
                                    <p className="text-[#FF9B21] font-medium">Upload a file</p>
                                    <p className="text-gray-500 text-sm">or drag and drop</p>
                                </>
                            )}
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBannerImageChange}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">not more than 500kb</p>
                    </div>

                    {/* Story Title */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Story title*
                        </label>
                        <Input id="title" name="title" defaultValue={blogPost?.title || ""} required className="w-full" />
                    </div>

                    {/* Sub-title */}
                    <div className="mb-6">
                        <label htmlFor="subtitle" className="block text-sm font-medium mb-2">
                            Sub-title
                        </label>
                        <Input id="subtitle" name="subtitle" defaultValue={blogPost?.subtitle || ""} className="w-full" />
                    </div>

                    {/* Story Body */}
                    <div className="mb-6">
                        <label htmlFor="body" className="block text-sm font-medium mb-2">
                            Story body*
                        </label>
                        <div className="border border-gray-300 rounded-md">
                            {/* Editor toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b border-gray-300">
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Bold className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Italic className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Underline className="h-4 w-4" />
                                </Button>
                                <div className="h-5 w-px bg-gray-300 mx-1"></div>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <AlignLeft className="h-4 w-4" />
                                </Button>
                                <div className="h-5 w-px bg-gray-300 mx-1"></div>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Link className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Headphones className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* TinyMCE Editor */}
                            <Editor
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue={blogPost?.body || ""}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "code",
                                        "help",
                                        "wordcount",
                                    ],
                                    toolbar: false, // We're using our custom toolbar
                                    content_style:
                                        "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }",
                                }}
                            />
                        </div>
                    </div>

                    {/* Related Images */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Upload other Related Images Image (optional)</label>
                        <div
                            className={`border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors`}
                            onDragOver={(e) => handleDragOver(e, "related")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "related")}
                            onClick={() => relatedImagesInputRef.current?.click()}
                        >
                            {relatedImagesPreview.length > 0 ? (
                                <div className="w-full">
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        {relatedImagesPreview.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Related image ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-md"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setRelatedImages((prev) => prev.filter((_, i) => i !== index))
                                                        setRelatedImagesPreview((prev) => prev.filter((_, i) => i !== index))
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="mx-auto flex items-center">
                                        Add More Images
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-[#FF9B21] mb-2" />
                                    <p className="text-[#FF9B21] font-medium">Upload a file</p>
                                    <p className="text-gray-500 text-sm">or drag and drop</p>
                                </>
                            )}
                            <input
                                ref={relatedImagesInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleRelatedImagesChange}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Note : minimum of 5 images not more than 500kb</p>
                    </div>

                    {/* Caption */}
                    <div className="mb-6">
                        <label htmlFor="caption" className="block text-sm font-medium mb-2">
                            Caption (Optional)
                        </label>
                        <Textarea id="caption" name="caption" defaultValue={blogPost?.caption || ""} className="w-full" rows={3} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" onClick={handlePreview} disabled={isSubmitting}>
                            Preview
                        </Button>
                        <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, "draft")} disabled={isSubmitting}>
                            Save to draft
                        </Button>
                        <Button type="submit" className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Publish"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

