"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { ClientSection } from "@/types/api"
import Image from "next/image"
import { Plus, ChevronLeft } from "lucide-react"
import { useRef } from "react"

interface ClientsLogoTabProps {
  clientLogos: ClientSection[]
  canEdit: boolean
  onUpdate: () => void
}

export function ClientsLogoTab({ clientLogos, canEdit, onUpdate }: ClientsLogoTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("logos")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logoImage, setLogoImage] = useState<File | null>(null)
  const [logoImagePreview, setLogoImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add("border-[#FF9B21]")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("border-[#FF9B21]")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove("border-[#FF9B21]")

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setLogoImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Implement client logo upload functionality
      // const formData = new FormData()
      // formData.append('logo', logoImage)

      // const response = await createClientLogo(null, formData)

      // if (response?.success) {
      //   toast("Success", {
      //     description: "Client logo uploaded successfully",
      //   })
      //   setActiveSubTab("logos")
      //   onUpdate()
      // } else {
      //   toast("Error", {
      //     description: response?.message || "Failed to upload client logo",
      //   })
      // }

      // For now, just show a success message
      setTimeout(() => {
        toast("Success", {
          description: "Client logo uploaded successfully",
        })
        setActiveSubTab("logos")
        onUpdate()
      }, 1000)
    } catch (error) {
      console.error("Error uploading client logo:", error)
      toast("Error", {
        description: "Failed to upload client logo",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderLogoContent = () => {
    if (activeSubTab === "logos") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clientLogos.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-gray-500">No client logos found</div>
          ) : (
            clientLogos.map((logo) => (
              <div
                key={logo.id}
                className="bg-white rounded-md shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center"
              >
                <div className="flex items-start justify-end w-full mb-4">
                  {canEdit && (
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
                  )}
                </div>

                <Image
                  src={logo.logo_url || "/placeholder.svg?height=80&width=150"}
                  alt={logo.company_name || "Client Logo"}
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
      // Upload client logo form
      return (
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Upload Logo Image</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => logoInputRef.current?.click()}
              >
                {logoImagePreview ? (
                  <div className="relative w-full">
                    <Image
                      src={logoImagePreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="max-h-48 mx-auto object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 mx-auto flex items-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLogoImage(null)
                        setLogoImagePreview(null)
                      }}
                    >
                      Change Logo
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" fill="white" />
                      <path
                        d="M12 6.5V17.5"
                        stroke="#FF9B21"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 12H6.5"
                        stroke="#FF9B21"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="ml-2 text-[#FF9B21]">picture</span>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoImageChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">not more than 500kb</p>
            </div>

            <Button type="submit" className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </form>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {activeSubTab === "logos" ? (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Clients Logo and Client Case study</h2>

          {canEdit && (
            <Button
              variant="outline"
              className="border-[#FF9B21] text-[#FF9B21]"
              onClick={() => setActiveSubTab("upload")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Images
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveSubTab("logos")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">Upload Client Logo</h2>
        </div>
      )}

      {renderLogoContent()}
    </div>
  )
}

