"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Search, Download, Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, InventoryItem } from "@/components/inventory/columns"
import { InventoryForm } from "@/components/inventory/inventory-form"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission } from "@/lib/permissions"

export default function InventoryPage() {
  const { user } = useAuthStore()
  const canAdjust = hasPermission(user?.role, "adjust_inventory")

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      product: "Samsung Galaxy S24",
      sku: "SAM-GAL-S24",
      warehouse: "Mumbai Warehouse",
      location: "A1",
      quantity: 245,
      reorderLevel: 50,
      status: "in-stock",
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      product: "Apple iPhone 15 Pro",
      sku: "APP-IPH-15P",
      warehouse: "Mumbai Warehouse",
      location: "A2",
      quantity: 12,
      reorderLevel: 50,
      status: "low",
      lastUpdate: "1 hour ago",
    },
    {
      id: "3",
      product: "MacBook Pro M3",
      sku: "APP-MBP-M3",
      warehouse: "Delhi Warehouse",
      location: "B1",
      quantity: 0,
      reorderLevel: 100,
      status: "out",
      lastUpdate: "30 minutes ago",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null)

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAdjustStock = () => {
    setViewingItem(null)
    setShowForm(true)
  }

  const handleView = (item: InventoryItem) => {
    setViewingItem(item)
    setShowForm(true)
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
      setInventory((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setViewingItem(null)
  }

  const handleFormSubmit = (formData: Partial<InventoryItem>) => {
    if (viewingItem) {
      // Update existing item
      setInventory((prev) =>
        prev.map((item) =>
          item.id === viewingItem.id
            ? {
                ...item,
                ...formData,
                status: (formData.quantity || 0) === 0 ? "out" : (formData.quantity || 0) < (formData.reorderLevel || 0) ? "low" : "in-stock",
                lastUpdate: "Just now",
              }
            : item
        )
      )
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        product: formData.product || "",
        sku: formData.sku || "",
        warehouse: formData.warehouse || "",
        location: formData.location || "",
        quantity: formData.quantity || 0,
        reorderLevel: formData.reorderLevel || 0,
        status: (formData.quantity || 0) === 0 ? "out" : (formData.quantity || 0) < (formData.reorderLevel || 0) ? "low" : "in-stock",
        lastUpdate: "Just now",
      }
      setInventory((prev) => [...prev, newItem])
    }
    handleFormClose()
  }

  const columnsWithHandlers = columns({
    onView: handleView,
  })

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Inventory</h1>
              <p className="text-muted mt-2">View and manage stock across all locations</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-2">
                <Download size={20} />
                Export
              </button>
              {canAdjust && (
                <button onClick={handleAdjustStock} className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Adjust Stock
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field flex items-center gap-2"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Inventory Form */}
          {showForm && (
            <div className="mb-8 card">
              <InventoryForm
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                item={viewingItem}
                viewOnly={!!viewingItem}
              />
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columnsWithHandlers}
            data={filteredInventory}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
    </>
  )
}
