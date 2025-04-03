"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createServiceSection, updateServiceSection } from "@/actions/sections"
import type { ServiceSection } from "@/types/api"
import { Upload } from "lucide-react"
import Image from "next/image";

interface ServiceSectionFormProps {
  service?: ServiceSection
  onSuccess: () => void
}

export function ServiceSectionForm({ service, onSuccess }: ServiceSectionFormProps) {
  const [title, setTitle] = useState(service?.title || "")
  const [titleShort, setTitleShort] = useState(service?.title_short || "")
  const [summary, setSummary] = useState(service?.summary || "")
  const [summaryShort, setSummaryShort] = useState(service?.summary_short || "")
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(service?.icon_url || null)
  const [image, setImage] = useState<File | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imagePreview, setImagePreview] = useState<string | null>(service?.image_url || null)
  const [order, setOrder] = useState<number>(service?.order || 0)
  const [isActive, setIsActive] = useState(service?.status === "published")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const iconInputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIcon(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setIconPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("title_short", titleShort)
      formData.append("summary", summary)
      formData.append("summary_short", summaryShort)
      formData.append("order", order.toString())
      formData.append("status", isActive ? "published" : "draft")

      if (icon) {
        formData.append("icon", icon)
      }

      if (image) {
        formData.append("image", image)
      }

      let response
      if (service?.id) {
        response = await updateServiceSection(service.id, null, formData)
      } else {
        response = await createServiceSection(null, formData)
      }

      if (response?.success) {
        toast("Success", {
          description: `Service ${service?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
      } else {
        toast("Error", {
          description: response?.message || `Failed to ${service?.id ? "update" : "create"} service`,
        })
      }
    } catch (error) {
      console.error(`Error ${service?.id ? "updating" : "creating"} service:`, error)
      toast("Error", {
        description: `Failed to ${service?.id ? "update" : "create"} service`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Service Icon</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF9B21] transition-colors"
          onClick={() => iconInputRef.current?.click()}
        >
          {iconPreview ? (
            <div className="relative w-full">
              <Image
                src={iconPreview || "/placeholder.svg"}
                alt="Icon preview"
                className="max-h-24 mx-auto object-contain"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 mx-auto flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setIcon(null)
                  setIconPreview(null)
                }}
              >
                Change Icon
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-[#FF9B21] mb-2" />
              <p className="text-[#FF9B21] font-medium">Upload a file</p>
              <p className="text-gray-500 text-sm">or drag and drop</p>
            </>
          )}
          <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
        </div>
        <p className="text-xs text-gray-500 mt-1">Recommended size: 64x64px, not more than 500kb</p>
      </div>

      {/* Service Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Service Title*
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
          placeholder="AI & ML Based Scoring"
        />
      </div>

      {/* Short Title */}
      <div className="mb-6">
        <label htmlFor="titleShort" className="block text-sm font-medium mb-2">
          Short Title
        </label>
        <Input
          id="titleShort"
          value={titleShort}
          onChange={(e) => setTitleShort(e.target.value)}
          className="w-full"
          placeholder="AI Scoring"
        />
      </div>

      {/* Service Summary */}
      <div className="mb-6">
        <label htmlFor="summary" className="block text-sm font-medium mb-2">
          Service Summary*
        </label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="w-full"
          placeholder="At vero eos et accusamus etusto odio praesentium accusamus this etusto odio data center."
          rows={3}
        />
      </div>

      {/* Short Summary */}
      <div className="mb-6">
        <label htmlFor="summaryShort" className="block text-sm font-medium mb-2">
          Short Summary
        </label>
        <Textarea
          id="summaryShort"
          value={summaryShort}
          onChange={(e) => setSummaryShort(e.target.value)}
          className="w-full"
          placeholder="Brief description for mobile view"
          rows={2}
        />
      </div>

      {/* Order */}
      <div className="mb-6">
        <label htmlFor="order" className="block text-sm font-medium mb-2">
          Display Order
        </label>
        <Input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
          className="w-full"
          min={0}
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
          {isSubmitting ? "Saving..." : service?.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

