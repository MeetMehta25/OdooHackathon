"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"

interface Receipt {
  id: string
  number: string
  supplier: string
  status: "draft" | "pending" | "ready" | "done" | "canceled"
  expectedDate: string
  items: number
  createdDate: string
}

export default function ReceiptsPage() {
  const [receipts] = useState<Receipt[]>([
    {
      id: "1",
      number: "REC-2024-001",
      supplier: "ABC Suppliers",
      status: "done",
      expectedDate: "2024-12-15",
      items: 5,
      createdDate: "2024-12-10",
    },
    {
      id: "2",
      number: "REC-2024-002",
      supplier: "XYZ Corp",
      status: "ready",
      expectedDate: "2024-12-18",
      items: 3,
      createdDate: "2024-12-12",
    },
    {
      id: "3",
      number: "REC-2024-003",
      supplier: "Global Supply",
      status: "pending",
      expectedDate: "2024-12-20",
      items: 8,
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
    done: "Completed",
    canceled: "Canceled",
  }

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Receipts</h1>
              <p className="text-muted mt-2">Manage inbound stock receipts from suppliers</p>
            </div>
            <button className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              New Receipt
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search receipt number or supplier..."
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
              <option value="done">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Receipts List */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Receipt #</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Supplier</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Expected Date</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Items</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Created</th>
                  <th className="text-right py-4 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 font-medium">{receipt.number}</td>
                    <td className="py-4 px-4 text-foreground">{receipt.supplier}</td>
                    <td className="py-4 px-4 text-muted">{receipt.expectedDate}</td>
                    <td className="py-4 px-4 text-center">{receipt.items}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[receipt.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[receipt.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted">{receipt.createdDate}</td>
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

            {filteredReceipts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No receipts found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
