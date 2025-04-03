"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { AboutSection } from "@/types/api"
import Image from "next/image"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { AboutSectionForm } from "@/components/homepage/about-section-form"

interface AboutSectionTabProps {
  aboutSection: AboutSection | null
  canEdit: boolean
  onUpdate: () => void
}

export function AboutSectionTab({ aboutSection, canEdit, onUpdate }: AboutSectionTabProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">About Section</h2>

      {aboutSection ? (
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Image
                src={aboutSection.image_url || "/placeholder.svg?height=300&width=300"}
                alt="About Us"
                width={300}
                height={300}
                className="rounded-md w-full h-auto object-cover"
              />
            </div>

            <div className="w-full md:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">{aboutSection.title || "Who we are"}</h3>

                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-gray-600 border-gray-300"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
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
                )}
              </div>

              <p className="text-gray-700 mb-4">{aboutSection.summary}</p>

              <div className="text-sm text-gray-500">
                Published {aboutSection.formatted_created_at || aboutSection.created_at?.substring(0, 10) || "25/11/24"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No about section found
          {canEdit && (
            <div className="mt-4">
              <Button className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white" onClick={() => setIsEditDialogOpen(true)}>
                Create About Section
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit About Section Dialog */}
      <DrawerDialog
        trigger={<></>}
        title={aboutSection ? "Edit About Section" : "Create About Section"}
        description="Update the about section on your homepage"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <AboutSectionForm aboutSection={aboutSection} onSuccess={handleEditSuccess} />
      </DrawerDialog>
    </div>
  )
}

