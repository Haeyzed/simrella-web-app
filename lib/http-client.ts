'use client'

import { getSession } from "next-auth/react"

const BASE_URL = "https://simbrella-api.laravel.cloud/api"

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: any
  cache?: RequestCache
  next?: NextFetchRequestConfig
  auth?: boolean
}

type ApiResponse<T> = {
  meta: Meta;
  success: boolean
  message: string
  data: T
}

type Meta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

class HttpClient {
  private static instance: HttpClient

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, cache, next, auth = true } = options

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    }

    // Add auth token if required and available
    if (auth) {
      const session = await getSession()
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
      requestOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions)

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API returned non-JSON response")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "An error occurred")
      }

      return data as ApiResponse<T>
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, body: any, options: Omit<RequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  async put<T>(endpoint: string, body: any, options: Omit<RequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  async patch<T>(endpoint: string, body: any, options: Omit<RequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body })
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const httpClient = HttpClient.getInstance()

