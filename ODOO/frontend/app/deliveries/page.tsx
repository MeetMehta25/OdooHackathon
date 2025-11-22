"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { columns, Delivery } from "@/components/deliveries/columns"
import { DeliveryForm } from "@/components/deliveries/delivery-form"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission } from "@/lib/permissions"

export default function DeliveriesPage() {
  const { user } = useAuthStore()
  const canCreate = hasPermission(user?.role, "create_deliveries")
  const canEdit = hasPermission(user?.role, "edit_deliveries")
  const canDelete = hasPermission(user?.role, "delete_deliveries")

  const [deliveries, setDeliveries] = useState<Delivery[]>([
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
  const [showForm, setShowForm] = useState(false)
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null)
  const [viewingDelivery, setViewingDelivery] = useState<Delivery | null>(null)

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || d.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleNewDelivery = () => {
    setEditingDelivery(null)
    setShowForm(true)
  }

  const handleView = (delivery: Delivery) => {
    setViewingDelivery(delivery)
    setShowForm(true)
  }

  const handleEdit = (delivery: Delivery) => {
    setEditingDelivery(delivery)
    setViewingDelivery(null)
    setShowForm(true)
  }

  const handleDelete = (delivery: Delivery) => {
    if (confirm(`Are you sure you want to delete delivery ${delivery.number}?`)) {
      setDeliveries((prev) => prev.filter((d) => d.id !== delivery.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} delivery(ies)?`)) {
      setDeliveries((prev) => prev.filter((d) => !selectedIds.includes(d.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingDelivery(null)
    setViewingDelivery(null)
  }

  const handleFormSubmit = (formData: Partial<Delivery>) => {
    if (editingDelivery) {
      // Update existing delivery
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === editingDelivery.id
            ? {
                ...d,
                ...formData,
                number: d.number, // Keep the original number
              }
            : d
        )
      )
    } else {
      // Create new delivery
      const newDelivery: Delivery = {
        id: Date.now().toString(),
        number: `DEL-2024-${String(deliveries.length + 1).padStart(3, "0")}`,
        customer: formData.customer || "",
        status: formData.status || "draft",
        expectedDate: formData.expectedDate || "",
        items: formData.items || 0,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setDeliveries((prev) => [...prev, newDelivery])
    }
    handleFormClose()
  }

  // Create columns with handlers
  const columnsWithHandlers = columns({
    onView: handleView,
    onEdit: canEdit ? handleEdit : undefined,
    onDelete: canDelete ? handleDelete : undefined,
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
            {canCreate && (
              <button onClick={handleNewDelivery} className="btn-primary flex items-center gap-2 w-fit">
                <Plus size={20} />
                New Delivery
              </button>
            )}
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="ready">Ready</option>
              <option value="done">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Delivery Form */}
          {showForm && (
            <div className="mb-8 card">
              <DeliveryForm
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                delivery={editingDelivery || viewingDelivery}
                viewOnly={!!viewingDelivery && !editingDelivery}
              />
            </div>
          )}

          {/* ✅ SHADCN DATA TABLE — Correct Placement */}
          <DataTable
            columns={columnsWithHandlers}
            data={filteredDeliveries}
            onDeleteSelected={handleDeleteSelected}
          />

        </div>
      </main>
    </div>
  )
}
