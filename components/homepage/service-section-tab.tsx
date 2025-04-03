"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteServiceSection } from "@/actions/sections"
import type { ServiceSection } from "@/types/api"
import Image from "next/image"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { ServiceSectionForm } from "@/components/homepage/service-section-form"
import { DrawerAlertDialog } from "@/components/ui/drawer-alert-dialog"

interface ServiceSectionTabProps {
  services: ServiceSection[]
  canEdit: boolean
  onUpdate: () => void
}

export function ServiceSectionTab({ services, canEdit, onUpdate }: ServiceSectionTabProps) {
  const [selectedService, setSelectedService] = useState<ServiceSection | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEdit = (service: ServiceSection) => {
    setSelectedService(service)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (serviceId: number) => {
    try {
      const response = await deleteServiceSection(serviceId)

      if (response.success) {
        toast("Success", {
          description: "Service deleted successfully",
        })
        onUpdate()
      } else {
        toast("Error", {
          description: response.error || "Failed to delete service",
        })
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast("Error", {
        description: "Failed to delete service",
      })
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Service Section</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-500">No services found</div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {service.icon_url ? (
                      <Image
                        src={service.icon_url || "/placeholder.svg"}
                        alt={service.title}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center">
                        <span className="text-orange-500">AI</span>
                      </div>
                    )}
                    <h3 className="font-semibold">{service.title}</h3>
                  </div>

                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-gray-600 border-gray-300"
                      onClick={() => handleEdit(service)}
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

                <p className="text-sm text-gray-600">{service.summary}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {canEdit && (
        <DrawerDialog
          trigger={<Button className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white">Add New Service</Button>}
          title="Add New Service"
          description="Create a new service to display on the homepage"
          open={isEditDialogOpen && !selectedService}
          onOpenChange={(open) => {
            if (!selectedService) setIsEditDialogOpen(open)
          }}
        >
          <ServiceSectionForm onSuccess={handleEditSuccess} />
        </DrawerDialog>
      )}

      {/* Edit Service Dialog */}
      {selectedService && (
        <DrawerDialog
          trigger={<></>}
          title="Edit Service"
          description="Update service details"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        >
          <ServiceSectionForm service={selectedService} onSuccess={handleEditSuccess} />
        </DrawerDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedService && (
        <DrawerAlertDialog
          trigger={<></>}
          title="Delete Service"
          description={`Are you sure you want to delete "${selectedService.title}"? This action cannot be undone.`}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => {
            handleDelete(selectedService.id)
            setIsDeleteDialogOpen(false)
          }}
          variant="destructive"
        />
      )}
    </div>
  )
}

