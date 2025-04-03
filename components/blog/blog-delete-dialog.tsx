"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DrawerAlertDialog } from "@/components/ui/drawer-alert-dialog"
import { deleteBlogPost } from "@/actions/blog"
import { toast } from "sonner"

interface BlogDeleteDialogProps {
    blogId: number
    blogTitle: string
    onSuccess?: () => void
}

export function BlogDeleteDialog({ blogId, blogTitle, onSuccess }: BlogDeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await deleteBlogPost(blogId)

            if (response.success) {
                toast("Success", {
                    description: "Blog post deleted successfully",
                })
                onSuccess?.()
            } else {
                toast("Error", {
                    description: response.error || "Failed to delete blog post",
                })
            }
        } catch (error) {
            console.error("Error deleting blog post:", error)
            toast("Error", {
                description: "Failed to delete blog post",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DrawerAlertDialog
            trigger={
                <Button variant="outline" size="sm" className="h-8 px-3 text-gray-600 border-gray-300" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                </Button>
            }
            title="Delete Blog Post"
            description={`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`}
            cancelText="Cancel"
            confirmText={isDeleting ? "Deleting..." : "Delete"}
            onConfirm={handleDelete}
            variant="destructive"
        />
    )
}

