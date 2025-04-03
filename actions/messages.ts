"use server"

import { httpClient } from "@/lib/http-client"
import type { Message } from "@/types/api"
import { messageSchema, respondToMessageSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function getMessages(
  page = 1,
  perPage = 10,
  search?: string,
  status?: string,
  orderBy = "created_at",
  orderDirection = "desc",
  trashedOnly = false,
  startDate?: string,
  endDate?: string,
) {
  try {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("per_page", perPage.toString())
    if (search) params.append("search", search)
    if (status) params.append("status", status)
    params.append("order_by", orderBy)
    params.append("order_direction", orderDirection)
    if (trashedOnly) params.append("trashed_only", "true")
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    const response = await httpClient.get<Message[]>(`/admin/messages?${params.toString()}`)
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return { success: false, error: "Failed to fetch messages" }
  }
}

export async function getMessage(id: number) {
  try {
    const response = await httpClient.get<Message>(`/admin/messages/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch message with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch message with ID ${id}` }
  }
}

export async function createMessage(prevState: any, formData: FormData) {
  try {
    const validatedFields = messageSchema.safeParse({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      message: formData.get("message"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to send message.",
      }
    }

    const response = await httpClient.post<Message>("/public/messages", validatedFields.data, {
      auth: false,
    })

    return { success: true, data: response.data, message: "Message sent successfully" }
  } catch (error) {
    console.error("Failed to send message:", error)
    return { success: false, error: null, message: "Failed to send message" }
  }
}

export async function respondToMessage(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = respondToMessageSchema.safeParse({
      response: formData.get("response"),
      send_email: formData.get("send_email") === "on",
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to respond to message.",
      }
    }

    const response = await httpClient.post<Message>(`/admin/messages/${id}/respond`, validatedFields.data)

    revalidatePath("/admin/messages")
    revalidatePath(`/admin/messages/${id}`)
    return { success: true, data: response.data, message: "Response sent successfully" }
  } catch (error) {
    console.error(`Failed to respond to message with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to respond to message with ID ${id}` }
  }
}

export async function markAsRead(id: number) {
  try {
    const response = await httpClient.patch<Message>(`/admin/messages/${id}/mark-as-read`, {})

    revalidatePath("/admin/messages")
    revalidatePath(`/admin/messages/${id}`)
    return { success: true, data: response.data, message: "Message marked as read" }
  } catch (error) {
    console.error(`Failed to mark message with ID ${id} as read:`, error)
    return { success: false, error: `Failed to mark message with ID ${id} as read` }
  }
}

export async function archiveMessage(id: number) {
  try {
    const response = await httpClient.patch<Message>(`/admin/messages/${id}/archive`, {})

    revalidatePath("/admin/messages")
    revalidatePath(`/admin/messages/${id}`)
    return { success: true, data: response.data, message: "Message archived successfully" }
  } catch (error) {
    console.error(`Failed to archive message with ID ${id}:`, error)
    return { success: false, error: `Failed to archive message with ID ${id}` }
  }
}

export async function deleteMessage(id: number) {
  try {
    await httpClient.delete(`/admin/messages/${id}`)

    revalidatePath("/admin/messages")
    return { success: true, message: "Message deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete message with ID ${id}:`, error)
    return { success: false, error: `Failed to delete message with ID ${id}` }
  }
}

export async function forceDeleteMessage(id: number) {
  try {
    await httpClient.delete(`/admin/messages/${id}/force`)

    revalidatePath("/admin/messages")
    return { success: true, message: "Message permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete message with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete message with ID ${id}` }
  }
}

export async function restoreMessage(id: number) {
  try {
    const response = await httpClient.patch<Message>(`/admin/messages/${id}/restore`, {})

    revalidatePath("/admin/messages")
    return { success: true, data: response.data, message: "Message restored successfully" }
  } catch (error) {
    console.error(`Failed to restore message with ID ${id}:`, error)
    return { success: false, error: `Failed to restore message with ID ${id}` }
  }
}

