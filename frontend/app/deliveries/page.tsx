"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

interface Delivery {
  id: string
  number: string
  customer: string
  status: "draft" | "pending" | "ready" | "done" | "canceled"
  expectedDate: string
  items: number
  createdDate: string
}

export default function DeliveriesPage() {
  const [deliveries] = useState<Delivery[]>([
    {
      id: "1",
      number: "DEL-2024-001",
      customer: "Customer A Ltd",
      status: "done",
      expectedDate: "2024-12-15",
      items: 4,
      createdDate: "2024-12-10",
    },
    {
      id: "2",
      number: "DEL-2024-002",
      customer: "Business Corp",
      status: "ready",
      expectedDate: "2024-12-17",
      items: 6,
      createdDate: "2024-12-12",
    },
    {
      id: "3",
      number: "DEL-2024-003",
      customer: "Retail Store",
      status: "pending",
      expectedDate: "2024-12-19",
      items: 2,
      createdDate: "2024-12-14",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const statusColors = {
    draft: "bg-muted text-muted",
    pending: "bg-warning/10 text-warning",
    ready: "bg-info/10 text-info",
    done: "bg-success/10 text-success",
    canceled: "bg-error/10 text-error",
  }

  const statusLabels = {
    draft: "Draft",
    pending: "Pending",
    ready: "Ready",
    done: "Delivered",
    canceled: "Canceled",
  }

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || d.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Deliveries</h1>
              <p className="text-muted mt-2">Manage outbound stock deliveries to customers</p>
            </div>
            <button className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              New Delivery
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search delivery number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="ready">Ready</option>
              <option value="done">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Deliveries List */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Delivery #</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Customer</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Expected Date</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Items</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Created</th>
                  <th className="text-right py-4 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 font-medium">{delivery.number}</td>
                    <td className="py-4 px-4 text-foreground">{delivery.customer}</td>
                    <td className="py-4 px-4 text-muted">{delivery.expectedDate}</td>
                    <td className="py-4 px-4 text-center">{delivery.items}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[delivery.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[delivery.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted">{delivery.createdDate}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 hover:bg-card-border rounded text-muted hover:text-error">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDeliveries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No deliveries found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
