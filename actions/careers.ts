"use server"

import { httpClient } from "@/lib/http-client"
import type { Career } from "@/types/api"
import { careerSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function getCareers(
  page = 1,
  perPage = 10,
  search?: string,
  status?: string,
  format?: string,
  department?: string,
  employmentType?: string,
  orderBy = "created_at",
  orderDirection = "desc",
  trashedOnly = false,
  activeOnly = false,
  startDate?: string,
  endDate?: string,
) {
  try {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("per_page", perPage.toString())
    if (search) params.append("search", search)
    if (status) params.append("status", status)
    if (format) params.append("format", format)
    if (department) params.append("department", department)
    if (employmentType) params.append("employment_type", employmentType)
    params.append("order_by", orderBy)
    params.append("order_direction", orderDirection)
    // if (trashedOnly) params.append("trashed_only", "true")
    // if (activeOnly) params.append("active_only", "true")
    // if (startDate) params.append("start_date", startDate)
    // if (endDate) params.append("end_date", endDate)

    const response = await httpClient.get<Career[]>(`/public/careers?${params.toString()}`)
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch careers:", error)
    return { success: false, error: "Failed to fetch careers" }
  }
}

export async function getCareer(id: number) {
  try {
    const response = await httpClient.get<Career>(`/public/careers/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch career with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch career with ID ${id}` }
  }
}

export async function createCareer(prevState: any, formData: FormData) {
  try {
    const validatedFields = careerSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      location: formData.get("location"),
      format: formData.get("format"),
      department: formData.get("department"),
      employment_type: formData.get("employment_type"),
      salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
      salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
      currency: formData.get("currency"),
      application_email: formData.get("application_email"),
      requirements: formData.get("requirements"),
      benefits: formData.get("benefits"),
      banner_image: formData.get("banner_image"),
      status: formData.get("status"),
      published_at: formData.get("published_at"),
      expires_at: formData.get("expires_at"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create career.",
      }
    }

    const response = await httpClient.post<Career>("/admin/careers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/careers")
    return { success: true, data: response.data, message: "Career created successfully" }
  } catch (error) {
    console.error("Failed to create career:", error)
    return { success: false, error: null, message: "Failed to create career" }
  }
}

export async function updateCareer(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = careerSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      location: formData.get("location"),
      format: formData.get("format"),
      department: formData.get("department"),
      employment_type: formData.get("employment_type"),
      salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
      salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
      currency: formData.get("currency"),
      application_email: formData.get("application_email"),
      requirements: formData.get("requirements"),
      benefits: formData.get("benefits"),
      banner_image: formData.get("banner_image"),
      status: formData.get("status"),
      published_at: formData.get("published_at"),
      expires_at: formData.get("expires_at"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update career.",
      }
    }

    const response = await httpClient.post<Career>(`/admin/careers/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/careers")
    revalidatePath(`/admin/careers/${id}`)
    return { success: true, data: response.data, message: "Career updated successfully" }
  } catch (error) {
    console.error(`Failed to update career with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update career with ID ${id}` }
  }
}

export async function deleteCareer(id: number) {
  try {
    await httpClient.delete(`/admin/careers/${id}`)
    revalidatePath("/admin/careers")
    return { success: true, message: "Career deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete career with ID ${id}:`, error)
    return { success: false, error: `Failed to delete career with ID ${id}` }
  }
}

export async function forceDeleteCareer(id: number) {
  try {
    await httpClient.delete(`/admin/careers/${id}/force`)
    revalidatePath("/admin/careers")
    return { success: true, message: "Career permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete career with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete career with ID ${id}` }
  }
}

export async function restoreCareer(id: number) {
  try {
    const response = await httpClient.post<Career>(`/admin/careers/${id}/restore`, {})
    revalidatePath("/admin/careers")
    return { success: true, data: response.data, message: "Career restored successfully" }
  } catch (error) {
    console.error(`Failed to restore career with ID ${id}:`, error)
    return { success: false, error: `Failed to restore career with ID ${id}` }
  }
}

