"use server"

import { serverHttpClient } from "@/lib/server-http-client"
import type { AboutSection, HeroSection, ServiceSection, ProductSection } from "@/types/api"
import { aboutSectionSchema, heroSectionSchema, serviceSectionSchema, productSectionSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

// About Sections
export async function getAboutSections() {
  try {
    const response = await serverHttpClient.get<AboutSection[]>("/public/about-sections")
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch about sections:", error)
    return { success: false, error: "Failed to fetch about sections" }
  }
}

export async function getAboutSection(id: number) {
  try {
    const response = await serverHttpClient.get<AboutSection>(`/public/about-sections/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch about section with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch about section with ID ${id}` }
  }
}

export async function createAboutSection(prevState: any, formData: FormData) {
  try {
    const validatedFields = aboutSectionSchema.safeParse({
      title: formData.get("title"),
      summary: formData.get("summary"),
      image: formData.get("image"),
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create about section.",
      }
    }

    const response = await serverHttpClient.post<AboutSection>("/admin/about-sections", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/about-sections")
    return { success: true, data: response.data, message: "About section created successfully" }
  } catch (error) {
    console.error("Failed to create about section:", error)
    return { success: false, error: null, message: "Failed to create about section" }
  }
}

export async function updateAboutSection(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = aboutSectionSchema.safeParse({
      title: formData.get("title"),
      summary: formData.get("summary"),
      image: formData.get("image"),
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update about section.",
      }
    }

    const response = await serverHttpClient.post<AboutSection>(`/admin/about-sections/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/about-sections")
    revalidatePath(`/admin/about-sections/${id}`)
    return { success: true, data: response.data, message: "About section updated successfully" }
  } catch (error) {
    console.error(`Failed to update about section with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update about section with ID ${id}` }
  }
}

export async function deleteAboutSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/about-sections/${id}`)
    revalidatePath("/admin/about-sections")
    return { success: true, message: "About section deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete about section with ID ${id}:`, error)
    return { success: false, error: `Failed to delete about section with ID ${id}` }
  }
}

export async function forceDeleteAboutSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/about-sections/${id}/force`)
    revalidatePath("/admin/about-sections")
    return { success: true, message: "About section permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete about section with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete about section with ID ${id}` }
  }
}

export async function restoreAboutSection(id: number) {
  try {
    const response = await serverHttpClient.post<AboutSection>(`/admin/about-sections/${id}/restore`, {})
    revalidatePath("/admin/about-sections")
    return { success: true, data: response.data, message: "About section restored successfully" }
  } catch (error) {
    console.error(`Failed to restore about section with ID ${id}:`, error)
    return { success: false, error: `Failed to restore about section with ID ${id}` }
  }
}

// Hero Sections
export async function getHeroSections() {
  try {
    const response = await serverHttpClient.get<HeroSection[]>("/public/hero-sections")
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch hero sections:", error)
    return { success: false, error: "Failed to fetch hero sections" }
  }
}

export async function getHeroSection(id: number) {
  try {
    const response = await serverHttpClient.get<HeroSection>(`/public/hero-sections/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch hero section with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch hero section with ID ${id}` }
  }
}

export async function createHeroSection(prevState: any, formData: FormData) {
  try {
    const validatedFields = heroSectionSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      status: formData.get("status"),
      images: formData.getAll("images"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create hero section.",
      }
    }

    const response = await serverHttpClient.post<HeroSection>("/admin/hero-sections", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/hero-sections")
    return { success: true, data: response.data, message: "Hero section created successfully" }
  } catch (error) {
    console.error("Failed to create hero section:", error)
    return { success: false, error: null, message: "Failed to create hero section" }
  }
}

export async function updateHeroSection(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = heroSectionSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      status: formData.get("status"),
      images: formData.getAll("images"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update hero section.",
      }
    }

    const response = await serverHttpClient.post<HeroSection>(`/admin/hero-sections/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/hero-sections")
    revalidatePath(`/admin/hero-sections/${id}`)
    return { success: true, data: response.data, message: "Hero section updated successfully" }
  } catch (error) {
    console.error(`Failed to update hero section with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update hero section with ID ${id}` }
  }
}

export async function deleteHeroSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/hero-sections/${id}`)
    revalidatePath("/admin/hero-sections")
    return { success: true, message: "Hero section deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete hero section with ID ${id}:`, error)
    return { success: false, error: `Failed to delete hero section with ID ${id}` }
  }
}

export async function forceDeleteHeroSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/hero-sections/${id}/force`)
    revalidatePath("/admin/hero-sections")
    return { success: true, message: "Hero section permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete hero section with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete hero section with ID ${id}` }
  }
}

export async function restoreHeroSection(id: number) {
  try {
    const response = await serverHttpClient.post<HeroSection>(`/admin/hero-sections/${id}/restore`, {})
    revalidatePath("/admin/hero-sections")
    return { success: true, data: response.data, message: "Hero section restored successfully" }
  } catch (error) {
    console.error(`Failed to restore hero section with ID ${id}:`, error)
    return { success: false, error: `Failed to restore hero section with ID ${id}` }
  }
}

// Service Sections
export async function getServiceSections() {
  try {
    const response = await serverHttpClient.get<ServiceSection[]>("/public/service-sections")
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch service sections:", error)
    return { success: false, error: "Failed to fetch service sections" }
  }
}

export async function getServiceSection(id: number) {
  try {
    const response = await serverHttpClient.get<ServiceSection>(`/public/service-sections/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch service section with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch service section with ID ${id}` }
  }
}

export async function createServiceSection(prevState: any, formData: FormData) {
  try {
    const validatedFields = serviceSectionSchema.safeParse({
      title: formData.get("title"),
      title_short: formData.get("title_short"),
      summary: formData.get("summary"),
      summary_short: formData.get("summary_short"),
      icon: formData.get("icon"),
      image: formData.get("image"),
      order: formData.get("order") ? Number(formData.get("order")) : undefined,
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create service section.",
      }
    }

    const response = await serverHttpClient.post<ServiceSection>("/admin/service-sections", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/service-sections")
    return { success: true, data: response.data, message: "Service section created successfully" }
  } catch (error) {
    console.error("Failed to create service section:", error)
    return { success: false, error: null, message: "Failed to create service section" }
  }
}

export async function updateServiceSection(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = serviceSectionSchema.safeParse({
      title: formData.get("title"),
      title_short: formData.get("title_short"),
      summary: formData.get("summary"),
      summary_short: formData.get("summary_short"),
      icon: formData.get("icon"),
      image: formData.get("image"),
      order: formData.get("order") ? Number(formData.get("order")) : undefined,
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update service section.",
      }
    }

    const response = await serverHttpClient.post<ServiceSection>(`/admin/service-sections/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/service-sections")
    revalidatePath(`/admin/service-sections/${id}`)
    return { success: true, data: response.data, message: "Service section updated successfully" }
  } catch (error) {
    console.error(`Failed to update service section with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update service section with ID ${id}` }
  }
}

export async function deleteServiceSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/service-sections/${id}`)
    revalidatePath("/admin/service-sections")
    return { success: true, message: "Service section deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete service section with ID ${id}:`, error)
    return { success: false, error: `Failed to delete service section with ID ${id}` }
  }
}

export async function reorderServiceSections(orderedIds: number[]) {
  try {
    const response = await serverHttpClient.post("/admin/service-sections/reorder", { ordered_ids: orderedIds })
    revalidatePath("/admin/service-sections")
    return { success: true, message: "Service sections reordered successfully" }
  } catch (error) {
    console.error("Failed to reorder service sections:", error)
    return { success: false, error: "Failed to reorder service sections" }
  }
}

export async function forceDeleteServiceSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/service-sections/${id}/force`)
    revalidatePath("/admin/service-sections")
    return { success: true, message: "Service section permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete service section with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete service section with ID ${id}` }
  }
}

export async function restoreServiceSection(id: number) {
  try {
    const response = await serverHttpClient.post<ServiceSection>(`/admin/service-sections/${id}/restore`, {})
    revalidatePath("/admin/service-sections")
    return { success: true, data: response.data, message: "Service section restored successfully" }
  } catch (error) {
    console.error(`Failed to restore service section with ID ${id}:`, error)
    return { success: false, error: `Failed to restore service section with ID ${id}` }
  }
}

// Product Sections
export async function getProductSections() {
  try {
    const response = await serverHttpClient.get<ProductSection[]>("/public/product-sections")
    return { success: true, data: response.data, meta: response.meta }
  } catch (error) {
    console.error("Failed to fetch product sections:", error)
    return { success: false, error: "Failed to fetch product sections" }
  }
}

export async function getProductSection(id: number) {
  try {
    const response = await serverHttpClient.get<ProductSection>(`/public/product-sections/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`Failed to fetch product section with ID ${id}:`, error)
    return { success: false, error: `Failed to fetch product section with ID ${id}` }
  }
}

export async function createProductSection(prevState: any, formData: FormData) {
  try {
    const validatedFields = productSectionSchema.safeParse({
      title: formData.get("title"),
      summary: formData.get("summary"),
      image: formData.get("image"),
      order: formData.get("order") ? Number(formData.get("order")) : undefined,
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to create product section.",
      }
    }

    const response = await serverHttpClient.post<ProductSection>("/admin/product-sections", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/product-sections")
    return { success: true, data: response.data, message: "Product section created successfully" }
  } catch (error) {
    console.error("Failed to create product section:", error)
    return { success: false, error: null, message: "Failed to create product section" }
  }
}

export async function updateProductSection(id: number, prevState: any, formData: FormData) {
  try {
    const validatedFields = productSectionSchema.safeParse({
      title: formData.get("title"),
      summary: formData.get("summary"),
      image: formData.get("image"),
      order: formData.get("order") ? Number(formData.get("order")) : undefined,
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
        message: "Invalid fields. Failed to update product section.",
      }
    }

    const response = await serverHttpClient.post<ProductSection>(`/admin/product-sections/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    revalidatePath("/admin/product-sections")
    revalidatePath(`/admin/product-sections/${id}`)
    return { success: true, data: response.data, message: "Product section updated successfully" }
  } catch (error) {
    console.error(`Failed to update product section with ID ${id}:`, error)
    return { success: false, error: null, message: `Failed to update product section with ID ${id}` }
  }
}

export async function deleteProductSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/product-sections/${id}`)
    revalidatePath("/admin/product-sections")
    return { success: true, message: "Product section deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete product section with ID ${id}:`, error)
    return { success: false, error: `Failed to delete product section with ID ${id}` }
  }
}

export async function reorderProductSections(orderedIds: number[]) {
  try {
    const response = await serverHttpClient.post("/admin/product-sections/reorder", { ordered_ids: orderedIds })
    revalidatePath("/admin/product-sections")
    return { success: true, message: "Product sections reordered successfully" }
  } catch (error) {
    console.error("Failed to reorder product sections:", error)
    return { success: false, error: "Failed to reorder product sections" }
  }
}

export async function forceDeleteProductSection(id: number) {
  try {
    await serverHttpClient.delete(`/admin/product-sections/${id}/force`)
    revalidatePath("/admin/product-sections")
    return { success: true, message: "Product section permanently deleted successfully" }
  } catch (error) {
    console.error(`Failed to permanently delete product section with ID ${id}:`, error)
    return { success: false, error: `Failed to permanently delete product section with ID ${id}` }
  }
}

export async function restoreProductSection(id: number) {
  try {
    const response = await serverHttpClient.post<ProductSection>(`/admin/product-sections/${id}/restore`, {})
    revalidatePath("/admin/product-sections")
    return { success: true, data: response.data, message: "Product section restored successfully" }
  } catch (error) {
    console.error(`Failed to restore product section with ID ${id}:`, error)
    return { success: false, error: `Failed to restore product section with ID ${id}` }
  }
}

