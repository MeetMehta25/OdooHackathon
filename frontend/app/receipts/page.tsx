"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, Receipt } from "@/components/receipts/columns"
import { ReceiptForm } from "@/components/receipts/receipt-form"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([
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
  const [showForm, setShowForm] = useState(false)
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null)
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null)

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleNewReceipt = () => {
    setEditingReceipt(null)
    setShowForm(true)
  }

  const handleView = (receipt: Receipt) => {
    setViewingReceipt(receipt)
    setShowForm(true)
  }

  const handleEdit = (receipt: Receipt) => {
    setEditingReceipt(receipt)
    setViewingReceipt(null)
    setShowForm(true)
  }

  const handleDelete = (receipt: Receipt) => {
    if (confirm(`Are you sure you want to delete receipt ${receipt.number}?`)) {
      setReceipts((prev) => prev.filter((r) => r.id !== receipt.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} receipt(s)?`)) {
      setReceipts((prev) => prev.filter((r) => !selectedIds.includes(r.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingReceipt(null)
    setViewingReceipt(null)
  }

  const handleFormSubmit = (formData: Partial<Receipt>) => {
    if (editingReceipt) {
      // Update existing receipt
      setReceipts((prev) =>
        prev.map((r) =>
          r.id === editingReceipt.id
            ? {
                ...r,
                ...formData,
                number: r.number, // Keep the original number
              }
            : r
        )
      )
    } else {
      // Create new receipt
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        number: `REC-2024-${String(receipts.length + 1).padStart(3, "0")}`,
        supplier: formData.supplier || "",
        status: formData.status || "draft",
        expectedDate: formData.expectedDate || "",
        items: formData.items || 0,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setReceipts((prev) => [...prev, newReceipt])
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
              <h1 className="text-4xl font-bold text-foreground">Receipts</h1>
              <p className="text-muted mt-2">Manage inbound stock receipts from suppliers</p>
            </div>
            <button onClick={handleNewReceipt} className="btn-primary flex items-center gap-2 w-fit">
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

          {/* Receipt Form */}
          {showForm && (
            <div className="mb-8 card">
              <ReceiptForm
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                receipt={editingReceipt || viewingReceipt}
                viewOnly={!!viewingReceipt && !editingReceipt}
              />
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columnsWithHandlers}
            data={filteredReceipts}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
    </>
  )
}
