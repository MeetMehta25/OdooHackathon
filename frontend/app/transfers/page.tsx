"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, Transfer } from "@/components/transfers/columns"
import { TransferForm } from "@/components/transfers/transfer-form"
import { RoleGuard } from "@/components/RoleGuard"

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: "1",
      number: "TRF-2024-001",
      product: "Widget Pro",
      fromWarehouse: "Main WH",
      toWarehouse: "Secondary WH",
      quantity: 50,
      status: "completed",
      createdDate: "2024-12-10",
      completedDate: "2024-12-11",
    },
    {
      id: "2",
      number: "TRF-2024-002",
      product: "Gadget X",
      fromWarehouse: "Secondary WH",
      toWarehouse: "Main WH",
      quantity: 25,
      status: "in-transit",
      createdDate: "2024-12-14",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null)
  const [viewingTransfer, setViewingTransfer] = useState<Transfer | null>(null)

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleNewTransfer = () => {
    setEditingTransfer(null)
    setShowForm(true)
  }

  const handleView = (transfer: Transfer) => {
    setViewingTransfer(transfer)
    setShowForm(true)
  }

  const handleEdit = (transfer: Transfer) => {
    setEditingTransfer(transfer)
    setViewingTransfer(null)
    setShowForm(true)
  }

  const handleDelete = (transfer: Transfer) => {
    if (confirm(`Are you sure you want to delete transfer ${transfer.number}?`)) {
      setTransfers((prev) => prev.filter((t) => t.id !== transfer.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} transfer(s)?`)) {
      setTransfers((prev) => prev.filter((t) => !selectedIds.includes(t.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTransfer(null)
    setViewingTransfer(null)
  }

  const handleFormSubmit = (formData: Partial<Transfer>) => {
    if (editingTransfer) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === editingTransfer.id
            ? {
                ...t,
                ...formData,
                number: t.number,
              }
            : t
        )
      )
    } else {
      const newTransfer: Transfer = {
        id: Date.now().toString(),
        number: `TRF-2024-${String(transfers.length + 1).padStart(3, "0")}`,
        product: formData.product || "",
        fromWarehouse: formData.fromWarehouse || "",
        toWarehouse: formData.toWarehouse || "",
        quantity: formData.quantity || 0,
        status: formData.status || "draft",
        createdDate: new Date().toISOString().split("T")[0],
      }
      setTransfers((prev) => [...prev, newTransfer])
    }
    handleFormClose()
  }

  const columnsWithHandlers = columns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <RoleGuard page="/transfers">
      <div>
        <TopNav />
        <main className="p-4 md:p-8">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Transfers</h1>
                <p className="text-muted mt-2">Transfer stock between warehouses</p>
              </div>
              <button onClick={handleNewTransfer} className="btn-primary flex items-center gap-2 w-fit">
                <Plus size={20} />
                New Transfer
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search transfer number or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {showForm && (
              <div className="mb-8 card">
                <TransferForm
                  onClose={handleFormClose}
                  onSubmit={handleFormSubmit}
                  transfer={editingTransfer || viewingTransfer}
                  viewOnly={!!viewingTransfer && !editingTransfer}
                />
              </div>
            )}

            <DataTable
              columns={columnsWithHandlers}
              data={filteredTransfers}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </main>
      </div>
    </RoleGuard>
  )
}

