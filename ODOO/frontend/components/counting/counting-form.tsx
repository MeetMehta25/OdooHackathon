"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CountingFormProps {
  products: any[];
  locations: any[];
  onClose: () => void;
  onSubmit?: (formData: any) => void;
  task?: any | null;
  viewOnly?: boolean;
}

export function CountingForm({
  products,
  locations,
  onClose,
  onSubmit,
  task,
  viewOnly = false,
}: CountingFormProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    location_id: "",
    previous_quantity: 0,
    counted_quantity: 0,
    reason: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        product_id: task.product_id || "",
        location_id: task.location_id || "",
        previous_quantity: task.previous_quantity || 0,
        counted_quantity: task.counted_quantity || 0,
        reason: task.reason || "",
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "previous_quantity" || name === "counted_quantity"
          ? Number.parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const difference = formData.counted_quantity - formData.previous_quantity;

  // Debug logging
  useEffect(() => {
    console.log("CountingForm - Products received:", products);
    console.log("CountingForm - Products length:", products?.length || 0);
    console.log("CountingForm - Locations received:", locations);
    console.log("CountingForm - Locations length:", locations?.length || 0);
  }, [products, locations]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly
            ? "View Stock Count"
            : task
            ? "Edit Stock Count"
            : "New Stock Count"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-foreground"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product *</label>
          {!products || products.length === 0 ? (
            <div className="input-field w-full bg-muted text-muted">
              No products available (found {products?.length || 0} products)
            </div>
          ) : (
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="input-field w-full"
              required
              disabled={viewOnly}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location *</label>
          {locations.length === 0 ? (
            <div className="input-field w-full bg-muted text-muted">
              No locations available
            </div>
          ) : (
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className="input-field w-full"
              required
              disabled={viewOnly}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.warehouse_name} - {location.name}
                  {location.zone ? ` (${location.zone})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Previous Quantity *
          </label>
          <input
            type="number"
            name="previous_quantity"
            value={formData.previous_quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Counted Quantity *
          </label>
          <input
            type="number"
            name="counted_quantity"
            value={formData.counted_quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field w-full"
            required
            disabled={viewOnly}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Difference</label>
          <input
            type="number"
            value={difference}
            className="input-field w-full"
            disabled
            readOnly
            style={{
              color:
                difference === 0
                  ? "var(--success)"
                  : difference > 0
                  ? "var(--info)"
                  : "var(--warning)",
            }}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Reason *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g., Cycle count, Physical inventory, Damaged goods"
            className="input-field w-full"
            rows={3}
            required
            disabled={viewOnly}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {task ? "Update Count" : "Create Count"}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className={viewOnly ? "btn-primary" : "btn-secondary"}
        >
          {viewOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
