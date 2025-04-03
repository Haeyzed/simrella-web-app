"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteProductSection } from "@/actions/sections"
import type { ProductSection } from "@/types/api"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { ProductSectionForm } from "@/components/homepage/product-section-form"
import { DrawerAlertDialog } from "@/components/ui/drawer-alert-dialog"

interface ProductSectionTabProps {
  products: ProductSection[]
  canEdit: boolean
  onUpdate: () => void
}

export function ProductSectionTab({ products, canEdit, onUpdate }: ProductSectionTabProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductSection | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEdit = (product: ProductSection) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (productId: number) => {
    try {
      const response = await deleteProductSection(productId)

      if (response.success) {
        toast("Success", {
          description: "Product deleted successfully",
        })
        onUpdate()
      } else {
        toast("Error", {
          description: response.error || "Failed to delete product",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast("Error", {
        description: "Failed to delete product",
      })
    }
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Our Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-gray-500">No products found</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-[#2D2D8D] text-white rounded-md p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-xl">{product.title || "Daas"}</h3>

                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-white border-white/30 hover:bg-white/10"
                      onClick={() => handleEdit(product)}
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

                <p className="text-sm">
                  {product.summary ||
                    "Data as a service is a complex approach aimed at monetization of MNO's Big Data relying on advanced techniques in analyzing telco usage. A user friendly and fast ecosystem is built for various providers of goods and services be equipped with access to valuable data for making lending decisions."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {canEdit && (
        <DrawerDialog
          trigger={<Button className="bg-[#FF9B21] hover:bg-[#e88c1d] text-white">Add New Product</Button>}
          title="Add New Product"
          description="Create a new product to display on the homepage"
          open={isEditDialogOpen && !selectedProduct}
          onOpenChange={(open) => {
            if (!selectedProduct) setIsEditDialogOpen(open)
          }}
        >
          <ProductSectionForm onSuccess={handleEditSuccess} />
        </DrawerDialog>
      )}

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <DrawerDialog
          trigger={<></>}
          title="Edit Product"
          description="Update product details"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        >
          <ProductSectionForm product={selectedProduct} onSuccess={handleEditSuccess} />
        </DrawerDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedProduct && (
        <DrawerAlertDialog
          trigger={<></>}
          title="Delete Product"
          description={`Are you sure you want to delete "${selectedProduct.title}"? This action cannot be undone.`}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => {
            handleDelete(selectedProduct.id)
            setIsDeleteDialogOpen(false)
          }}
          variant="destructive"
        />
      )}
    </div>
  )
}

