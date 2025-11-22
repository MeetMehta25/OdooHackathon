"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { AlertCircle, CheckCircle, Trash2, Search } from "lucide-react"

interface Alert {
  id: string
  type: "low-stock" | "out-of-stock" | "expiring" | "overstock"
  product: string
  warehouse: string
  currentStock: number
  reorderLevel: number
  read: boolean
  date: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "low-stock",
      product: "Widget Pro (SKU-001)",
      warehouse: "Main WH",
      currentStock: 12,
      reorderLevel: 50,
      read: false,
      date: "2024-12-14",
    },
    {
      id: "2",
      type: "out-of-stock",
      product: "Component Y (SKU-003)",
      warehouse: "Secondary WH",
      currentStock: 0,
      reorderLevel: 100,
      read: false,
      date: "2024-12-13",
    },
    {
      id: "3",
      type: "overstock",
      product: "Raw Material A (SKU-003)",
      warehouse: "Main WH",
      currentStock: 2500,
      reorderLevel: 1000,
      read: true,
      date: "2024-12-12",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterRead, setFilterRead] = useState("unread")

  const typeColors: Record<string, string> = {
    "low-stock": "text-warning",
    "out-of-stock": "text-error",
    expiring: "text-error",
    overstock: "text-info",
  }

  const typeLabels = {
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
    expiring: "Expiring Soon",
    overstock: "Overstock",
  }

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch = a.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRead = filterRead === "all" || (filterRead === "read" ? a.read : !a.read)
    return matchesSearch && matchesRead
  })

  return (
    <div>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Stock Alerts</h1>
            <p className="text-muted mt-2">Monitor low stock, overstock, and other inventory issues</p>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {[
              { label: "Unread Alerts", value: alerts.filter((a) => !a.read).length, colorClass: "text-error" },
              { label: "Low Stock", value: alerts.filter((a) => a.type === "low-stock").length, colorClass: "text-warning" },
              { label: "Out of Stock", value: alerts.filter((a) => a.type === "out-of-stock").length, colorClass: "text-error" },
            ].map((stat, i) => (
              <div key={i} className="card">
                <p className="text-muted text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.colorClass}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="input-field">
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="card border border-card-border flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="pt-1">
                    {alert.read ? (
                      <CheckCircle size={24} className="text-success" />
                    ) : (
                      <AlertCircle size={24} className={typeColors[alert.type] || "text-info"} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{alert.product}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          alert.type === "out-of-stock"
                            ? "bg-error/10 text-error"
                            : alert.type === "low-stock"
                            ? "bg-warning/10 text-warning"
                            : alert.type === "overstock"
                            ? "bg-info/10 text-info"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {typeLabels[alert.type as keyof typeof typeLabels]}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-2">{alert.warehouse}</p>
                    <p className="text-sm">
                      Current Stock: <span className="font-medium">{alert.currentStock}</span> | Reorder Level:{" "}
                      <span className="font-medium">{alert.reorderLevel}</span>
                    </p>
                    <p className="text-xs text-muted mt-2">{alert.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-sm text-primary hover:text-primary-light font-medium"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 hover:bg-muted-bg rounded text-muted hover:text-error"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12 card">
                <CheckCircle size={48} className="mx-auto text-success mb-4 opacity-50" />
                <p className="text-muted text-lg">No alerts found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
