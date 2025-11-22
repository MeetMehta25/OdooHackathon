"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { CountingTask } from "./columns"

interface CountingFormProps {
  onClose: () => void
  onSubmit?: (formData: Partial<CountingTask>) => void
  task?: CountingTask | null
  viewOnly?: boolean
}

export function CountingForm({ onClose, onSubmit, task, viewOnly = false }: CountingFormProps) {
  const [formData, setFormData] = useState({
    product: "",
    warehouse: "",
    location: "",
    expectedQuantity: 0,
    countedQuantity: 0,
    status: "pending" as CountingTask["status"],
  })

  useEffect(() => {
    if (task) {
      setFormData({
        product: task.product,
        warehouse: task.warehouse,
        location: task.location || "",
        expectedQuantity: task.expectedQuantity,
        countedQuantity: task.countedQuantity,
        status: task.status,
      })
    }
  }, [task])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedQuantity" || name === "countedQuantity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      const variance = formData.countedQuantity - formData.expectedQuantity
      onSubmit({
        ...formData,
        variance,
      })
    } else {
      console.log(task ? "Updating counting task:" : "Creating counting task:", formData)
      onClose()
    }
  }

  const variance = formData.countedQuantity - formData.expectedQuantity

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly ? "View Counting Task" : task ? "Edit Counting Task" : "New Counting Task"}
        </h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      {task && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Task Number</label>
          <input type="text" value={task.number} className="input-field w-full" disabled readOnly />
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
          <label className="block text-sm font-medium mb-2">Location (Optional)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., A1"
            className="input-field w-full"
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Expected Quantity</label>
          <input
            type="number"
            name="expectedQuantity"
            value={formData.expectedQuantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Counted Quantity</label>
          <input
            type="number"
            name="countedQuantity"
            value={formData.countedQuantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Variance</label>
          <input
            type="number"
            value={variance}
            className="input-field w-full"
            disabled
            readOnly
            style={{ color: variance === 0 ? "var(--success)" : "var(--error)" }}
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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {task ? "Update Task" : "Create Task"}
          </button>
        )}
        <button type="button" onClick={onClose} className={viewOnly ? "btn-primary" : "btn-secondary"}>
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  )
}

