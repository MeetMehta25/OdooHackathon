"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Receipt } from "./columns"

interface ReceiptFormProps {
  onClose: () => void
  onSubmit?: (formData: Partial<Receipt>) => void
  receipt?: Receipt | null
  viewOnly?: boolean
}

export function ReceiptForm({ onClose, onSubmit, receipt, viewOnly = false }: ReceiptFormProps) {
  const [formData, setFormData] = useState({
    supplier: "",
    expectedDate: "",
    status: "draft" as Receipt["status"],
    items: 0,
  })

  useEffect(() => {
    if (receipt) {
      setFormData({
        supplier: receipt.supplier,
        expectedDate: receipt.expectedDate,
        status: receipt.status,
        items: receipt.items,
      })
    }
  }, [receipt])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "items" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log(receipt ? "Updating receipt:" : "Creating receipt:", formData)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly ? "View Receipt" : receipt ? "Edit Receipt" : "New Receipt"}
        </h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      {receipt && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Receipt Number</label>
          <input type="text" value={receipt.number} className="input-field w-full" disabled readOnly />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="e.g., ABC Suppliers"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Expected Date</label>
          <input
            type="date"
            name="expectedDate"
            value={formData.expectedDate}
            onChange={handleChange}
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field w-full"
            required
            disabled={viewOnly}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="done">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Items</label>
          <input
            type="number"
            name="items"
            value={formData.items}
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
            {receipt ? "Update Receipt" : "Create Receipt"}
          </button>
        )}
        <button type="button" onClick={onClose} className={viewOnly ? "btn-primary" : "btn-secondary"}>
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  )
}

