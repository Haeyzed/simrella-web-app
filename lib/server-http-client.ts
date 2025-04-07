import { auth } from "@/auth"
// import type { NextFetchRequestConfig } from "next/server"

const BASE_URL = "https://simbrella.softmaxtech.com.ng/public/api"

// Define a type for request body
type RequestBody = Record<string, unknown> | FormData | null

type RequestOptions = {
    method?: string
    headers?: Record<string, string>
    body?: RequestBody
    cache?: RequestCache
    next?: NextFetchRequestConfig
    auth?: boolean
}

type Meta = {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export type ApiResponseData<T> = {
    data: T
    meta?: Meta
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export async function serverRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponseData<T>> {
    const { method = "GET", headers = {}, body, cache, next, auth: requireAuth = true } = options

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
    }

    // Add auth token if required and available
    if (requireAuth) {
        const session = await auth()
        if (session?.accessToken) {
            requestHeaders["Authorization"] = `Bearer ${session.accessToken}`
        }
    }

    const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        cache,
        next,
    }

    if (body) {
        if (body instanceof FormData) {
            // Don't set Content-Type for FormData, let the browser set it
            delete requestHeaders["Content-Type"]
            requestOptions.body = body
        } else {
            requestOptions.body = JSON.stringify(body)
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions)

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("API returned non-JSON response")
        }

        const responseData = await response.json()

        if (!response.ok) {
            throw new Error(responseData.message || "An error occurred")
        }

        return responseData
    } catch (error) {
        console.error("API request failed:", error)
        throw error
    }
}

export const serverHttpClient = {
    get: <T>(endpoint: string, options: Omit<RequestOptions, "method" | "body"> = {}) =>
        serverRequest<T>(endpoint, { ...options, method: "GET" }),

        post: <T>(endpoint: string, body: RequestBody, options: Omit<RequestOptions, "method"> = {}) =>
    serverRequest<T>(endpoint, { ...options, method: "POST", body }),

    put: <T>(endpoint: string, body: RequestBody, options: Omit<RequestOptions, "method"> = {}) =>
    serverRequest<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T>(endpoint: string, body: RequestBody, options: Omit<RequestOptions, "method"> = {}) =>
    serverRequest<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T>(endpoint: string, options: Omit<RequestOptions, "method"> = {}) =>
    serverRequest<T>(endpoint, { ...options, method: "DELETE" })
}

