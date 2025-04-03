"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHasPermission } from "@/lib/auth-utils"
import { getHeroSections, getServiceSections, getAboutSections, getProductSections } from "@/actions/sections"
import { toast } from "sonner"
import { HeroSectionTab } from "@/components/homepage/hero-section-tab"
import { ServiceSectionTab } from "@/components/homepage/service-section-tab"
import { AboutSectionTab } from "@/components/homepage/about-section-tab"
import { ProductSectionTab } from "@/components/homepage/product-section-tab"
import { ClientsLogoTab } from "@/components/homepage/clients-logo-tab"
import type { HeroSection, ServiceSection, AboutSection, ProductSection, ClientSection } from "@/types/api"

export default function HomePageManagement() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("hero")
    const [isLoading, setIsLoading] = useState(true)

    // Check permissions
    const canEdit = useHasPermission("home_page_edit")

    // State for different sections
    const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
    const [serviceSections, setServiceSections] = useState<ServiceSection[]>([])
    const [aboutSection, setAboutSection] = useState<AboutSection | null>(null)
    const [productSections, setProductSections] = useState<ProductSection[]>([])
    const [clientLogos, setClientLogos] = useState<ClientSection[]>([])

    // Fetch data based on active tab
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                switch (activeTab) {
                    case "hero":
                        const heroResponse = await getHeroSections()
                        if (heroResponse.success && heroResponse.data) {
                            setHeroSection(heroResponse.data[0] || null)
                        }
                        break
                    case "service":
                        const serviceResponse = await getServiceSections()
                        if (serviceResponse.success && serviceResponse.data) {
                            setServiceSections(serviceResponse.data)
                        }
                        break
                    case "about":
                        const aboutResponse = await getAboutSections()
                        if (aboutResponse.success && aboutResponse.data) {
                            setAboutSection(aboutResponse.data[0] || null)
                        }
                        break
                    case "products":
                        const productsResponse = await getProductSections()
                        if (productsResponse.success && productsResponse.data) {
                            setProductSections(productsResponse.data)
                        }
                        break
                    case "clients":
                        // Fetch client logos (implement this function)
                        // const clientsResponse = await getClientLogos()
                        // if (clientsResponse.success && clientsResponse.data) {
                        //   setClientLogos(clientsResponse.data)
                        // }
                        // For now, use dummy data
                        // setClientLogos([
                        //     {
                        //         id: 1,
                        //         company_name: "Airtel",
                        //         logo_url:
                        //             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Airtel_logo.svg/1200px-Airtel_logo.svg.png",
                        //         order: 1,
                        //         status: 1,
                        //         status_label: "Active",
                        //         status_color: "green",
                        //         user_id: 1,
                        //         has_case_study: false,
                        //         created_at: null,
                        //         updated_at: null,
                        //         deleted_at: null,
                        //     },
                        //     {
                        //         id: 2,
                        //         company_name: "Vodafone",
                        //         logo_url:
                        //             "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/1200px-Vodafone_icon.svg.png",
                        //         order: 2,
                        //         status: 1,
                        //         status_label: "Active",
                        //         status_color: "green",
                        //         user_id: 1,
                        //         has_case_study: false,
                        //         created_at: null,
                        //         updated_at: null,
                        //         deleted_at: null,
                        //     },
                        //     {
                        //         id: 3,
                        //         company_name: "FirstBank",
                        //         logo_url:
                        //             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/FirstBank_logo.svg/1200px-FirstBank_logo.svg.png",
                        //         order: 3,
                        //         status: 1,
                        //         status_label: "Active",
                        //         status_color: "green",
                        //         user_id: 1,
                        //         has_case_study: false,
                        //         created_at: null,
                        //         updated_at: null,
                        //         deleted_at: null,
                        //     },
                        // ])
                        break
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab} section data:`, error)
                toast("Error", {
                    description: `Failed to load ${activeTab} section data`,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [activeTab])

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "hero":
                return <HeroSectionTab heroSection={heroSection} canEdit={canEdit} onUpdate={() => setActiveTab("hero")} />
            case "service":
                return (
                    <ServiceSectionTab services={serviceSections} canEdit={canEdit} onUpdate={() => setActiveTab("service")} />
                )
            case "about":
                return <AboutSectionTab aboutSection={aboutSection} canEdit={canEdit} onUpdate={() => setActiveTab("about")} />
            case "products":
                return (
                    <ProductSectionTab products={productSections} canEdit={canEdit} onUpdate={() => setActiveTab("products")} />
                )
            case "clients":
                return <ClientsLogoTab clientLogos={clientLogos} canEdit={canEdit} onUpdate={() => setActiveTab("clients")} />
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col space-y-6">
                {/* Header with back button and title */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold">Home Page Management</h1>
                </div>

                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "hero" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                        onClick={() => setActiveTab("hero")}
                    >
                        Hero Section
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "service" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                        onClick={() => setActiveTab("service")}
                    >
                        Service Section
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "about" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                        onClick={() => setActiveTab("about")}
                    >
                        About Section
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "products" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                        onClick={() => setActiveTab("products")}
                    >
                        Our Products
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "clients" ? "text-[#FF9B21] border-b-2 border-[#FF9B21]" : "text-gray-600"}`}
                        onClick={() => setActiveTab("clients")}
                    >
                        Clients Logo and Client Case study
                    </button>
                </div>

                {/* Content */}
                {isLoading ? <div className="text-center py-10">Loading...</div> : renderContent()}
            </div>
        </div>
    )
}

