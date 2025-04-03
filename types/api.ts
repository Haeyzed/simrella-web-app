// User related types
export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string | null
  bio: string | null
  country: string | null
  state: string | null
  postal_code: string | null
  email_verified: boolean
  email_verified_at: string | null
  profile_image: string | null
  profile_image_url: string | null
  status: string
  status_label: string
  status_color: string
  roles: Role[]
  permissions: Permission[]
  created_at: string
  formatted_created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Role {
  id: number
  name: string
  display_name: string
}

export interface Permission {
  id: number
  name: string
  display_name: string
}

// Auth related types
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Blog related types
export interface BlogPost {
  id: number
  title: string
  subtitle: string | null
  body: string
  banner_image: string | null
  banner_image_url: string | null
  caption: string | null
  status: string
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  images: any[]
  images_count: number
  views: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  formatted_created_at: string | null
  formatted_updated_at: string | null
}

// Career related types
export interface Career {
  id: number
  title: string
  subtitle: string | null
  description: string
  location: string
  format: string
  department: string
  employment_type: string
  salary_min: number | null
  salary_max: number | null
  salary_range: string | null
  currency: string
  application_email: string
  requirements: any[] | null
  benefits: any[] | null
  banner_image: string | null
  banner_image_url: string | null
  status: string
  status_label: string
  status_color: string
  published_at: string | null
  expires_at: string | null
  user_id: number | null
  user: any | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  formatted_created_at: string | null
  formatted_updated_at: string | null
  formatted_published_at: string | null
  formatted_expires_at: string | null
}

// Message related types
export interface Message {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  message: string
  response: string | null
  status: string
  status_label: string | null
  status_color: string | null
  responded_by_id: number | null
  responded_by: any | null
  responded_at: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  formatted_created_at: string | null
  formatted_responded_at: string | null
}

// Other section types
export interface AboutSection {
  id: number
  title: string
  summary: string
  image_path: string | null
  image_url: string | null
  status: number
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface HeroSection {
  id: number
  title: string
  subtitle: string | null
  status: string
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  images: any[]
  images_count: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface ServiceSection {
  id: number
  title: string
  title_short: string | null
  summary: string
  summary_short: string | null
  icon: string
  icon_url: string | null
  image_path: string | null
  image_url: string | null
  order: number | null
  status: string
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface ProductSection {
  id: number
  title: string
  summary: string
  image_path: string | null
  image_url: string | null
  order: number
  status: number
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface ClientSection {
  id: number
  company_name: string
  logo_path: string | null
  logo_url: string | null
  order: number
  status: number
  status_label: string | null
  status_color: string | null
  user_id: number | null
  user: any | null
  case_study: any | null
  has_case_study: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface CaseStudySection {
  id: number
  client_section_id: number
  banner_image: string | null
  banner_image_url: string | null
  company_name: string
  subtitle: string | null
  description: string
  challenge: string
  solution: string
  results: string
  status: number
  status_label: string | null
  status_color: string | null
  user_id: number
  user: any | null
  client: ClientSection | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface ContactInformation {
  id: number
  address: string
  phone: string
  email: string
  facebook_link: string | null
  instagram_link: string | null
  linkedin_link: string | null
  twitter_link: string | null
  user_id: number
  user: any | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface Page {
  id: number
  title: string
  slug: string
  subtitle: string | null
  content: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  is_published: boolean
  order: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  formatted_created_at: string | null
  formatted_updated_at: string | null
}

export interface PageImage {
  id: number
  type: string
  type_label: string
  image_path: string
  image_url: string
  title: string | null
  alt_text: string | null
  description: string | null
  created_at: string
  updated_at: string
  formatted_created_at: string | null
  formatted_updated_at: string | null
}

export type DashboardSummary = {
  products: {
    total: number
    published: number
    draft: number
  }
  blogs: {
    total: number
    published: number
    draft: number
  }
  services: {
    total: number
    published: number
    draft: number
  }
}

export type VisitorData = {
  total: number
  by_period: Record<string, number>
  by_browser: Record<string, number>
  period: string
}

export type RecentActivity = {
  type: string
  title: string
  subtitle: string
  image: string | null
  updated_at: string
  formatted_updated_at: string
}

export type DashboardData = {
  summary: DashboardSummary
  visitors: VisitorData
  top_blogs: BlogPost[]
  recent_activity: RecentActivity[]
  detailed_stats: any | null
}