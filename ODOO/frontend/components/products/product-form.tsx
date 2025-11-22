"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Product } from "./columns"

interface ProductFormProps {
  onClose: () => void
  onSubmit?: (formData: Partial<Product> & { description?: string; uom?: string; reorderLevel?: number }) => void
  product?: Product | null
  viewOnly?: boolean
}

export function ProductForm({ onClose, onSubmit, product, viewOnly = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    uom: "pcs",
    reorderLevel: 0,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: "",
        sku: product.sku,
        category: product.category,
        uom: "pcs",
        reorderLevel: 0,
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "reorderLevel" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log(product ? "Updating product:" : "Creating product:", formData)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly ? "View Product" : product ? "Edit Product" : "Add New Product"}
        </h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Widget Pro"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g., SKU-001"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field w-full"
            required
            disabled={viewOnly}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="raw">Raw Materials</option>
            <option value="finished">Finished Goods</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Unit of Measure</label>
          <select name="uom" value={formData.uom} onChange={handleChange} className="input-field w-full" disabled={viewOnly}>
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="l">Liters</option>
            <option value="m">Meters</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reorder Level</label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            placeholder="0"
            className="input-field w-full"
            disabled={viewOnly}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            rows={3}
            className="input-field w-full"
            disabled={viewOnly}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {product ? "Update Product" : "Create Product"}
          </button>
        )}
        <button type="button" onClick={onClose} className={viewOnly ? "btn-primary" : "btn-secondary"}>
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  )
}
