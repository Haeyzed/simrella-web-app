import type { User } from "@/types/api"
import "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken: string
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        user: User
    }
}

