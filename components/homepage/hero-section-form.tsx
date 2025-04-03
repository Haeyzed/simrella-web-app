"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updateHeroSection } from "@/actions/sections"
import type { HeroSection } from "@/types/api"
import { Upload } from "lucide-react"
import Image from "next/image";

interface HeroSectionFormProps {
  heroSection?: HeroSection | null
  onSuccess?: () => void
}

export function HeroSectionForm({ heroSection, onSuccess }: HeroSectionFormProps) {
  const [bannerImages, setBannerImages] = useState<File[]>([])
  const [bannerImagesPreview, setBannerImagesPreview] = useState<string[]>(
    heroSection?.images?.map((img) => img.image_url) || [],
  )
  const [title, setTitle] = useState(heroSection?.title || "")
  const [subtitle, setSubtitle] = useState(heroSection?.subtitle || "")
  const [isActive, setIsActive] = useState(heroSection?.status === "draft")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleBannerImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setBannerImages((prev) => [...prev, ...files])

      // Create previews
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setBannerImagesPreview((prev) => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      setBannerImages((prev) => [...prev, ...files])

      // Create previews
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setBannerImagesPreview((prev) => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("subtitle", subtitle)
      formData.append("status", isDraft ? "draft" : isActive ? "published" : "draft")

      // Add banner images if selected
      bannerImages.forEach((file) => {
        formData.append("images[]", file)
      })

      let response
      if (heroSection?.id) {
        response = await updateHeroSection(heroSection.id, null, formData)
      } else {
        // Create new hero section
        // response = await createHeroSection(null, formData)
      }

      if (response?.success) {
        toast("Success", {
          description: `Hero section ${heroSection?.id ? "updated" : "created"} successfully`,
        })
        onSuccess?.()
      } else {
        toast("Error", {
          description: response?.message || `Failed to ${heroSection?.id ? "update" : "create"} hero section`,
        })
      }
    } catch (error) {
      console.error(`Error ${heroSection?.id ? "updating" : "creating"} hero section:`, error)
      toast("Error", {
        description: `Failed to ${heroSection?.id ? "update" : "create"} hero section`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Edit Items on the Hero Screen</h2>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        {/* Carousel Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload Carosel Image</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerImagesPreview.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {bannerImagesPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Carousel image ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBannerImages((prev) => prev.filter((_, i) => i !== index))
                          setBannerImagesPreview((prev) => prev.filter((_, i) => i !== index))
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mx-auto flex items-center">
                  Add More Images
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-[#FF9B21] mb-2" />
                <p className="text-[#FF9B21] font-medium">Upload a file</p>
                <p className="text-gray-500 text-sm">or drag and drop</p>
              </>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleBannerImagesChange}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Note : minimum of 3 images not more than 500kb</p>
        </div>

        {/* Hero Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Hero Title*
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
            placeholder="First Company in the World to launch a Fintech Mobile Services"
          />
        </div>

        {/* Hero Sub-title */}
        <div className="mb-6">
          <label htmlFor="subtitle" className="block text-sm font-medium mb-2">
            Hero Sub-title
          </label>
          <Textarea
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full"
            placeholder="We are serving over 25 companies in 20 countries worldwide and this number is growing with new launches every quarter."
            rows={3}
          />
        </div>

        {/* Set Active */}
        <div className="mb-6 flex items-center gap-2">
          <label htmlFor="active" className="text-sm font-medium">
            Set active
          </label>
          <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
          >
            Save to draft
          </Button>
          <Button type="submit" className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  )
}

