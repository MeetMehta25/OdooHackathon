"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, Warehouse } from "@/components/warehouses/columns"
import { WarehouseForm } from "@/components/warehouses/warehouse-form"

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "1",
      name: "Mumbai Central Warehouse",
      location: "Mumbai, Maharashtra, India",
      status: "active",
      locations: [
        { id: "L1", name: "Electronics Section A1", code: "A1", capacity: 500 },
        { id: "L2", name: "Mobile Phones Section A2", code: "A2", capacity: 750 },
      ],
    },
    {
      id: "2",
      name: "Delhi Distribution Hub",
      location: "Delhi, NCR, India",
      status: "active",
      locations: [{ id: "L3", name: "Laptops Section B1", code: "B1", capacity: 600 }],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [viewingWarehouse, setViewingWarehouse] = useState<Warehouse | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleNewWarehouse = () => {
    setEditingWarehouse(null)
    setShowForm(true)
  }

  const handleView = (warehouse: Warehouse) => {
    setViewingWarehouse(warehouse)
    setShowForm(true)
  }

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse)
    setViewingWarehouse(null)
    setShowForm(true)
  }

  const handleDelete = (warehouse: Warehouse) => {
    if (confirm(`Are you sure you want to delete warehouse ${warehouse.name}?`)) {
      setWarehouses((prev) => prev.filter((w) => w.id !== warehouse.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} warehouse(s)?`)) {
      setWarehouses((prev) => prev.filter((w) => !selectedIds.includes(w.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingWarehouse(null)
    setViewingWarehouse(null)
  }

  const handleFormSubmit = (formData: Partial<Warehouse>) => {
    if (editingWarehouse) {
      // Update existing warehouse
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === editingWarehouse.id
            ? {
                ...w,
                ...formData,
                locations: w.locations, // Keep existing locations
              }
            : w
        )
      )
    } else {
      // Create new warehouse
      const newWarehouse: Warehouse = {
        id: Date.now().toString(),
        name: formData.name || "",
        location: formData.location || "",
        status: formData.status || "active",
        locations: [],
      }
      setWarehouses((prev) => [...prev, newWarehouse])
    }
    handleFormClose()
  }

  const columnsWithHandlers = columns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Warehouses</h1>
              <p className="text-muted mt-2">Manage warehouse locations and storage</p>
            </div>
            <button onClick={handleNewWarehouse} className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              Add Warehouse
            </button>
          </div>

          {/* Warehouse Form */}
          {showForm && (
            <div className="mb-8 card">
              <WarehouseForm
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                warehouse={editingWarehouse || viewingWarehouse}
                viewOnly={!!viewingWarehouse && !editingWarehouse}
              />
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Data Table */}
          <DataTable
            columns={columnsWithHandlers}
            data={filteredWarehouses}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
    </>
  )
}
