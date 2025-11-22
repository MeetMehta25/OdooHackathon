"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Transfer } from "./columns"

interface TransferFormProps {
  onClose: () => void
  onSubmit?: (formData: Partial<Transfer>) => void
  transfer?: Transfer | null
  viewOnly?: boolean
}

export function TransferForm({ onClose, onSubmit, transfer, viewOnly = false }: TransferFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: 0,
    status: "draft" as Transfer["status"],
  })

  useEffect(() => {
    if (transfer) {
      setFormData({
        product: transfer.product,
        fromWarehouse: transfer.fromWarehouse,
        toWarehouse: transfer.toWarehouse,
        quantity: transfer.quantity,
        status: transfer.status,
      })
    }
  }, [transfer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log(transfer ? "Updating transfer:" : "Creating transfer:", formData)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly ? "View Transfer" : transfer ? "Edit Transfer" : "New Transfer"}
        </h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      {transfer && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Transfer Number</label>
          <input type="text" value={transfer.number} className="input-field w-full" disabled readOnly />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="1"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Warehouse</label>
          <input
            type="text"
            name="fromWarehouse"
            value={formData.fromWarehouse}
            onChange={handleChange}
            placeholder="e.g., Main WH"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">To Warehouse</label>
          <input
            type="text"
            name="toWarehouse"
            value={formData.toWarehouse}
            onChange={handleChange}
            placeholder="e.g., Secondary WH"
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
            <option value="in-transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {transfer ? "Update Transfer" : "Create Transfer"}
          </button>
        )}
        <button type="button" onClick={onClose} className={viewOnly ? "btn-primary" : "btn-secondary"}>
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  )
}

