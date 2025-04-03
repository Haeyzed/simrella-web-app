import { z } from "zod"

// Login schema
export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    remember: z.boolean().optional().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Register schema
export const registerSchema = z
    .object({
        first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
        last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        password_confirmation: z.string(),
        roles: z.array(z.string()).optional(),
        permissions: z.array(z.string()).optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    })

export type RegisterFormValues = z.infer<typeof registerSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// Reset password schema
export const resetPasswordSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        otp: z.string().min(6, { message: "OTP must be 6 digits" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// Verify OTP schema
export const verifyOTPSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be 6 digits" }),
})

export type VerifyOTPFormValues = z.infer<typeof verifyOTPSchema>

// Change password schema
export const changePasswordSchema = z
    .object({
        current_password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

// Update profile schema
export const updateProfileSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    postal_code: z.string().optional().nullable(),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

// Message schema
export const messageSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type MessageFormValues = z.infer<typeof messageSchema>

// Respond to message schema
export const respondToMessageSchema = z.object({
    response: z.string().min(10, { message: "Response must be at least 10 characters" }),
    send_email: z.boolean().optional().default(false),
})

export type RespondToMessageFormValues = z.infer<typeof respondToMessageSchema>

// Blog post schema
export const blogPostSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    subtitle: z.string().optional().nullable(),
    body: z.string().min(10, { message: "Body must be at least 10 characters" }),
    banner_image: z.any().optional(),
    caption: z.string().optional().nullable(),
    status: z.enum(["draft", "published", "archived"]),
    related_images: z.array(z.any()).optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>

// Career schema
export const careerSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    subtitle: z.string().optional().nullable(),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    location: z.string().min(2, { message: "Location must be at least 2 characters" }),
    format: z.string().min(2, { message: "Format must be at least 2 characters" }),
    department: z.string().optional().nullable(),
    employment_type: z.enum(["full-time", "part-time", "contract"]).optional().nullable(),
    salary_min: z.number().optional().nullable(),
    salary_max: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    application_email: z.string().email({ message: "Please enter a valid email address" }),
    requirements: z.string().optional().nullable(),
    benefits: z.string().optional().nullable(),
    banner_image: z.any().optional(),
    status: z.enum(["draft", "published", "open", "closed", "archived"]).optional(),
    published_at: z.string().optional().nullable(),
    expires_at: z.string().optional().nullable(),
})

export type CareerFormValues = z.infer<typeof careerSchema>

// About section schema
export const aboutSectionSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
    image: z.any().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
})

export type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>

// Hero section schema
export const heroSectionSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    subtitle: z.string().optional().nullable(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    images: z.array(z.any()),
})

export type HeroSectionFormValues = z.infer<typeof heroSectionSchema>

// Service section schema
export const serviceSectionSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    title_short: z.string().optional().nullable(),
    summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
    summary_short: z.string().optional().nullable(),
    icon: z.any().optional(),
    image: z.any().optional(),
    order: z.number().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
})

export type ServiceSectionFormValues = z.infer<typeof serviceSectionSchema>

// Product section schema
export const productSectionSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
    image: z.any().optional(),
    order: z.number().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
})

export type ProductSectionFormValues = z.infer<typeof productSectionSchema>

// Client section schema
export const clientSectionSchema = z.object({
    company_name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
    logo: z.any().optional(),
    order: z.number().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
})

export type ClientSectionFormValues = z.infer<typeof clientSectionSchema>

// Case study section schema
export const caseStudySectionSchema = z.object({
    client_section_id: z.number(),
    banner_image: z.any().optional(),
    company_name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
    subtitle: z.string().optional().nullable(),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    challenge: z.string().optional().nullable(),
    solution: z.string().optional().nullable(),
    results: z.string().optional().nullable(),
    status: z.enum(["draft", "published", "archived"]).optional(),
})

export type CaseStudySectionFormValues = z.infer<typeof caseStudySectionSchema>

// Contact information schema
export const contactInformationSchema = z.object({
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    phone: z.string().min(5, { message: "Phone must be at least 5 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    facebook_link: z.string().url().optional().nullable(),
    instagram_link: z.string().url().optional().nullable(),
    linkedin_link: z.string().url().optional().nullable(),
    twitter_link: z.string().url().optional().nullable(),
})

export type ContactInformationFormValues = z.infer<typeof contactInformationSchema>

// Page schema
export const pageSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    slug: z.string().optional(),
    subtitle: z.string().optional().nullable(),
    content: z.string().min(10, { message: "Content must be at least 10 characters" }),
    meta_title: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),
    meta_keywords: z.string().optional().nullable(),
    is_published: z.boolean().optional().default(false),
    order: z.number().optional(),
})

export type PageFormValues = z.infer<typeof pageSchema>

// Page image schema
export const pageImageSchema = z.object({
    type: z.enum(["service_page", "about_page", "career_page", "contact_page", "logo", "nigerian_flag"]),
    image: z.any(),
    title: z.string().optional().nullable(),
    alt_text: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
})

export type PageImageFormValues = z.infer<typeof pageImageSchema>

// Permission schema
export const permissionSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    display_name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    roles: z.array(z.string()).optional(),
})

export type PermissionFormValues = z.infer<typeof permissionSchema>

// Role schema
export const roleSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    display_name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    permissions: z.array(z.string()).optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>

// User schema
export const userSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    postal_code: z.string().optional().nullable(),
    status: z.enum(["active", "inactive", "suspended", "pending"]).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
    profile_image: z.any().optional(),
    roles: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
})

export type UserFormValues = z.infer<typeof userSchema>

