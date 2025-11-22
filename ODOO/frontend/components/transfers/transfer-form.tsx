"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Transfer } from "./columns";

interface TransferFormProps {
  onClose: () => void;
  onSubmit?: (formData: any) => void;
  transfer?: Transfer | null;
  viewOnly?: boolean;
  locations?: any[];
}

export function TransferForm({
  onClose,
  onSubmit,
  transfer,
  viewOnly = false,
  locations = [],
}: TransferFormProps) {
  const [formData, setFormData] = useState({
    source_location_id: "",
    destination_location_id: "",
  });

  useEffect(() => {
    console.log("TransferForm - locations prop:", locations);
  }, [locations]);
  useEffect(() => {
    if (transfer) {
      setFormData({
        source_location_id: transfer.fromWarehouse,
        destination_location_id: transfer.toWarehouse,
      });
    }
  }, [transfer]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log(
        transfer ? "Updating transfer:" : "Creating transfer:",
        formData
      );
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {viewOnly
            ? "View Transfer"
            : transfer
            ? "Edit Transfer"
            : "New Transfer"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-foreground"
        >
          <X size={24} />
        </button>
      </div>

      {transfer && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Transfer Number
          </label>
          <input
            type="text"
            value={transfer.number}
            className="input-field w-full"
            disabled
            readOnly
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Source Location *
          </label>
          <select
            name="source_location_id"
            value={formData.source_location_id}
            onChange={handleChange}
            className="input-field w-full"
            required
            disabled={viewOnly}
          >
            <option value="">Select source location</option>
            {locations.length === 0 ? (
              <option value="" disabled>
                No locations available. Please create warehouses and locations
                first.
              </option>
            ) : (
              locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.warehouse_name} - {location.name}
                  {location.zone ? ` (${location.zone})` : ""}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-muted mt-1">
            Where items will be transferred from
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Destination Location *
          </label>
          <select
            name="destination_location_id"
            value={formData.destination_location_id}
            onChange={handleChange}
            className="input-field w-full"
            required
            disabled={viewOnly}
          >
            <option value="">Select destination location</option>
            {locations.length === 0 ? (
              <option value="" disabled>
                No locations available. Please create warehouses and locations
                first.
              </option>
            ) : (
              locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.warehouse_name} - {location.name}
                  {location.zone ? ` (${location.zone})` : ""}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-muted mt-1">
            Where items will be transferred to
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-md">
        <p className="text-sm text-muted">
          <strong>Note:</strong> After creating the transfer, you can add items
          to it from the transfer details page.
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        {!viewOnly && (
          <button type="submit" className="btn-primary">
            {transfer ? "Update Transfer" : "Create Transfer"}
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
