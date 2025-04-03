"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createAboutSection, updateAboutSection } from "@/actions/sections"
import type { AboutSection } from "@/types/api"
import { Upload } from "lucide-react"
import Image from "next/image";

interface AboutSectionFormProps {
  aboutSection?: AboutSection | null
  onSuccess: () => void
}

export function AboutSectionForm({ aboutSection, onSuccess }: AboutSectionFormProps) {
  const [title, setTitle] = useState(aboutSection?.title || "")
  const [summary, setSummary] = useState(aboutSection?.summary || "")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(aboutSection?.image_url || null)
  const [isActive, setIsActive] = useState(aboutSection?.status === 1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
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
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("summary", summary)
      formData.append("status", isActive ? "1" : "0")

      if (image) {
        formData.append("image", image)
      }

      let response
      if (aboutSection?.id) {
        response = await updateAboutSection(aboutSection.id, null, formData)
      } else {
        response = await createAboutSection(null, formData)
      }

      if (response?.success) {
        toast("Success", {
          description: `About section ${aboutSection?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
      } else {
        toast("Error", {
          description: response?.message || `Failed to ${aboutSection?.id ? "update" : "create"} about section`,
        })
      }
    } catch (error) {
      console.error(`Error ${aboutSection?.id ? "updating" : "creating"} about section:`, error)
      toast("Error", {
        description: `Failed to ${aboutSection?.id ? "update" : "create"} about section`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">About Image</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => imageInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="relative w-full">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="About image preview"
                className="max-h-48 mx-auto object-contain"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 mx-auto flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setImage(null)
                  setImagePreview(null)
                }}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-[#FF9B21] mb-2" />
              <p className="text-[#FF9B21] font-medium">Upload a file</p>
              <p className="text-gray-500 text-sm">or drag and drop</p>
            </>
          )}
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
        <p className="text-xs text-gray-500 mt-1">Recommended size: 600x400px, not more than 500kb</p>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title*
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
          placeholder="Who we are"
        />
      </div>

      {/* Summary */}
      <div className="mb-6">
        <label htmlFor="summary" className="block text-sm font-medium mb-2">
          Summary*
        </label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="w-full"
          placeholder="Simbrella is a technology solutions company with a focus on developing digital products and services..."
          rows={6}
        />
      </div>

      {/* Set Active */}
      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="active" className="text-sm font-medium">
          Active
        </label>
        <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : aboutSection?.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

