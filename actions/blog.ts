"use server"

import { serverHttpClient } from "@/lib/server-http-client"
import type { BlogPost } from "@/types/api"
import { blogPostSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function getBlogPosts(
    page = 1,
    perPage = 10,
    search?: string,
    status?: string,
    orderBy = "created_at",
    orderDirection = "desc",
    trashedOnly = 0,
    startDate?: string,
    endDate?: string,
) {
  try {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("per_page", perPage.toString())
    if (search) params.append("search", search)
    // if (status) params.append("status", status)
    // params.append("order_by", orderBy)
    // params.append("order_direction", orderDirection)
    // if (trashedOnly) params.append("trashed_only", trashedOnly.toString())
    // if (startDate) params.append("start_date", startDate)
    // if (endDate) params.append("end_date", endDate)

    const response = await serverHttpClient.get<BlogPost[]>(`/public/blog-posts?${params.toString()}`)
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch blog posts:", error)
    return { success: false, error: `Failed to fetch blog posts ${error}` }
  }
}

export async function getBlogPost(id: number) {
  try {
    const response = await serverHttpClient.get<BlogPost>(`/admin/blog-posts/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch blog post with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch blog post with ID ${id}` }
  }
}

export async function createBlogPost(prevState: any, formData: FormData) {
  try {
    const validatedFields = blogPostSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      body: formData.get("body"),
      banner_image: formData.get("banner_image"),
      caption: formData.get("caption"),
      status: formData.get("status"),
      related_images: formData.getAll("related_images"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create blog post.",
      }
    }

    const response = await serverHttpClient.post<BlogPost>("/blog-posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/blog-management")
    return { success: true, data: response.data, message: "Blog post created successfully" }
  } catch (error) {
    console.error("Failed to create blog post:", error)
    return { success: false, error: null, message: "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = blogPostSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      body: formData.get("body"),
      banner_image: formData.get("banner_image"),
      caption: formData.get("caption"),
      status: formData.get("status"),
      related_images: formData.getAll("related_images"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update blog post.",
      }
    }

    const response = await serverHttpClient.post<BlogPost>(`/admin/blog-posts/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/blog-management")
    revalidatePath(`/blog-management/${id}`)
    return { success: true, data: response.data, message: "Blog post updated successfully" }
  } catch (error) {
    console.error(`Failed to update blog post with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update blog post with ID ${id}` }
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await serverHttpClient.delete(`/admin/blog-posts/${id}`)
    revalidatePath("/blog-management")
    return { success: true, message: "Blog post deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete blog post with ID ${id}:`, error)
    return { success: false, error: `Failed to delete blog post with ID ${id}` }
  }
}

export async function forceDeleteBlogPost(id: number) {
  try {
    await serverHttpClient.delete(`/admin/blog-posts/${id}/force`)
    revalidatePath("/blog-management")
    return { success: true, message: "Blog post permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete blog post with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete blog post with ID ${id}` }
  }
}

export async function restoreBlogPost(id: number) {
  try {
    const response = await serverHttpClient.post<BlogPost>(`/admin/blog-posts/${id}/restore`, {})
    revalidatePath("/blog-management")
    return { success: true, data: response.data, message: "Blog post restored successfully" }
  } catch (error) {
    console.error(`Failed to restore blog post with ID ${id}:`, error)
    return { success: false, error: `Failed to restore blog post with ID ${id}` }
  }
}

