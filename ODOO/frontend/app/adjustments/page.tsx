"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Plus, Search } from "lucide-react"

interface Adjustment {
  id: string
  product: string
  warehouse: string
  reason: "counting" | "damage" | "correction" | "other"
  previousQty: number
  countedQty: number
  difference: number
  date: string
}

export default function AdjustmentsPage() {
  const [adjustments] = useState<Adjustment[]>([
    {
      id: "1",
      product: "Samsung Galaxy S24 (SAM-GAL-S24)",
      warehouse: "Mumbai Warehouse - A1",
      reason: "counting",
      previousQty: 250,
      countedQty: 245,
      difference: -5,
      date: "2024-12-14",
    },
    {
      id: "2",
      product: "Apple iPhone 15 Pro (APP-IPH-15P)",
      warehouse: "Mumbai Warehouse - A2",
      reason: "damage",
      previousQty: 50,
      countedQty: 45,
      difference: -5,
      date: "2024-12-13",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAdjustments = adjustments.filter((a) => a.product.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Stock Adjustments</h1>
              <p className="text-muted mt-2">Track inventory corrections and discrepancies</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              New Adjustment
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-6">Record Stock Adjustment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product</label>
                  <input type="text" placeholder="Select product" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <select className="input-field w-full">
                    <option>Physical Count</option>
                    <option>Damage</option>
                    <option>Correction</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Previous Quantity</label>
                  <input type="number" placeholder="0" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Counted Quantity</label>
                  <input type="number" placeholder="0" className="input-field w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea placeholder="Additional notes..." rows={3} className="input-field w-full" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn-primary">Record Adjustment</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Adjustments Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Product</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Warehouse</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Reason</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Previous</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Counted</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Difference</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdjustments.map((adj) => (
                  <tr key={adj.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 font-medium">{adj.product}</td>
                    <td className="py-4 px-4 text-muted">{adj.warehouse}</td>
                    <td className="py-4 px-4 text-sm capitalize">{adj.reason}</td>
                    <td className="py-4 px-4 text-center">{adj.previousQty}</td>
                    <td className="py-4 px-4 text-center">{adj.countedQty}</td>
                    <td
                      className={`py-4 px-4 text-center font-medium ${adj.difference < 0 ? "text-error" : "text-success"}`}
                    >
                      {adj.difference > 0 ? "+" : ""}
                      {adj.difference}
                    </td>
                    <td className="py-4 px-4 text-muted">{adj.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
