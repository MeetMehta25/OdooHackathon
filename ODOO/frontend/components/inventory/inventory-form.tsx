"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { InventoryItem } from "./columns"

interface InventoryFormProps {
  onClose: () => void
  onSubmit?: (formData: Partial<InventoryItem>) => void
  item?: InventoryItem | null
  viewOnly?: boolean
}

export function InventoryForm({ onClose, onSubmit, item, viewOnly = false }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    sku: "",
    warehouse: "",
    location: "",
    quantity: 0,
    reorderLevel: 0,
  })

  useEffect(() => {
    if (item) {
      setFormData({
        product: item.product,
        sku: item.sku,
        warehouse: item.warehouse,
        location: item.location,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
      })
    }
  }, [item])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "reorderLevel" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log(item ? "Updating inventory:" : "Adjusting stock:", formData)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly ? "View Inventory" : item ? "Adjust Stock" : "Adjust Stock"}
        </h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      {item && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Product</label>
          <input type="text" value={item.product} className="input-field w-full" disabled readOnly />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!item && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <input
                type="text"
                name="product"
                value={formData.product}
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
              <label className="block text-sm font-medium mb-2">Warehouse</label>
              <input
                type="text"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                placeholder="e.g., Main WH"
                className="input-field w-full"
                required
                disabled={viewOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., A1"
                className="input-field w-full"
                required
                disabled={viewOnly}
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Reorder Level</label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {item ? "Update Stock" : "Adjust Stock"}
          </button>
        )}
        <button type="button" onClick={onClose} className={viewOnly ? "btn-primary" : "btn-secondary"}>
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  )
}

