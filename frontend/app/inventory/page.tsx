"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Search, Download, Plus } from "lucide-react"

interface InventoryItem {
  id: string
  product: string
  sku: string
  warehouse: string
  location: string
  quantity: number
  reorderLevel: number
  status: "in-stock" | "low" | "out"
  lastUpdate: string
}

export default function InventoryPage() {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: "1",
      product: "Widget Pro",
      sku: "SKU-001",
      warehouse: "Main WH",
      location: "A1",
      quantity: 245,
      reorderLevel: 50,
      status: "in-stock",
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      product: "Gadget X",
      sku: "SKU-002",
      warehouse: "Main WH",
      location: "A2",
      quantity: 12,
      reorderLevel: 50,
      status: "low",
      lastUpdate: "1 hour ago",
    },
    {
      id: "3",
      product: "Component Y",
      sku: "SKU-003",
      warehouse: "Secondary",
      location: "B1",
      quantity: 0,
      reorderLevel: 100,
      status: "out",
      lastUpdate: "30 minutes ago",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    "in-stock": "text-success bg-success/10",
    low: "text-warning bg-warning/10",
    out: "text-error bg-error/10",
  }

  const statusLabels = {
    "in-stock": "In Stock",
    low: "Low Stock",
    out: "Out of Stock",
  }

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
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                Adjust Stock
              </button>
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

          {/* Inventory Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Product</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">SKU</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Warehouse</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Quantity</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Reorder Level</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Last Update</th>
                  <th className="text-right py-4 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 font-medium">{item.product}</td>
                    <td className="py-4 px-4 text-muted text-sm">{item.sku}</td>
                    <td className="py-4 px-4 text-sm">
                      {item.warehouse} • {item.location}
                    </td>
                    <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
                    <td className="py-4 px-4 text-center text-muted">{item.reorderLevel}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[item.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[item.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted">{item.lastUpdate}</td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-primary hover:text-primary-light text-sm font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInventory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No inventory items found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
