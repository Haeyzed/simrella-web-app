"use server"

import { httpClient } from "@/lib/http-client"
import {BlogPost, DashboardData, RecentActivity, VisitorData} from "@/types/api";

export async function getDashboardData() {
    try {
        const response = await httpClient.get<DashboardData>("/admin/dashboard")

        if (!response.data) {
            throw new Error(response.message || "Failed to fetch dashboard data")
        }

        return response.data
    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Return default data structure in case of error
        return {
            summary: {
                products: { total: 0, published: 0, draft: 0 },
                blogs: { total: 0, published: 0, draft: 0 },
                services: { total: 0, published: 0, draft: 0 },
            },
            visitors: {
                total: 0,
                by_period: {},
                by_browser: {},
                period: "daily",
            },
            top_blogs: [],
            recent_activity: [],
            detailed_stats: null,
        }
    }
}

export async function getVisitorStats(period = "daily") {
    try {
        const response = await httpClient.get<VisitorData>(`/admin/dashboard/visitors?period=${period}`)

        if (!response.data) {
            throw new Error(response.message || "Failed to fetch visitor statistics")
        }

        return response.data
    } catch (error) {
        console.error("Error fetching visitor statistics:", error)
        return {
            total: 0,
            by_period: {},
            by_browser: {},
            period: period,
        }
    }
}

export async function getTopBlogs(limit = 3) {
    try {
        const response = await httpClient.get<BlogPost[]>(`/admin/dashboard/top-blogs?limit=${limit}`)

        if (!response.data) {
            throw new Error(response.message || "Failed to fetch top blogs")
        }

        return response.data
    } catch (error) {
        console.error("Error fetching top blogs:", error)
        return []
    }
}

export async function getRecentActivity(limit = 3) {
    try {
        const response = await httpClient.get<RecentActivity[]>(`/admin/dashboard/recent-activity?limit=${limit}`)

        if (!response.data) {
            throw new Error(response.message || "Failed to fetch recent activity")
        }

        return response.data
    } catch (error) {
        console.error("Error fetching recent activity:", error)
        return []
    }
}

