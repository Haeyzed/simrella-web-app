"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { HeroSection } from "@/types/api"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

interface HeroSectionTabProps {
  heroSection: HeroSection
  // Using underscore prefix to indicate intentionally unused variable
  _canEdit?: boolean
  onUpdate: () => void
}

export function HeroSectionTab({ heroSection, onUpdate }: HeroSectionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("view")

  const renderHeroContent = () => {
    if (activeSubTab === "view") {
      return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {heroSection.images && heroSection.images.length === 0 ? (
                <div className="col-span-3 text-center py-10 text-gray-500">No hero images found</div>
            ) : (
                heroSection.images?.map((image) => (
                    <div
                        key={image.id}
                        className="bg-white rounded-md shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center"
                    >
                      <div className="flex items-start justify-end w-full mb-4">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-gray-600 border-gray-300">
                          <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1"
                          >
                            <path
                                d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            ></path>
                          </svg>
                          Edit
                        </Button>
                      </div>

                      <Image
                          src={image.image_url || "/placeholder.svg?height=80&width=150"}
                          alt="Hero Image"
                          width={150}
                          height={80}
                          className="object-contain"
                      />
                    </div>
                ))
            )}
          </div>
      )
    } else {
      // Upload hero image form
      return (
          <div className="space-y-6">
            <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast("Success", {
                    description: "Hero section updated successfully",
                  })
                  setActiveSubTab("view")
                  onUpdate()
                }}
            >
              {/* Form content would go here */}
              <Button type="submit" className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white">
                Publish
              </Button>
            </form>
          </div>
      )
    }
  }

  return (
      <div className="space-y-6">
        {activeSubTab === "view" ? (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Hero Section</h2>

              <Button variant="outline" className="border-[#FF9B21] text-[#FF9B21]" onClick={() => setActiveSubTab("edit")}>
                Edit Hero Section
              </Button>
            </div>
        ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveSubTab("view")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-semibold">Edit Hero Section</h2>
            </div>
        )}

        {renderHeroContent()}
      </div>
  )
}

