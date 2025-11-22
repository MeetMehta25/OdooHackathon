"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, PickingOrder } from "@/components/picking/columns"
import { RoleGuard } from "@/components/RoleGuard"
import { useAuthStore } from "@/lib/auth-store"

export default function PickingPage() {
  const { user } = useAuthStore()
  const [pickingOrders, setPickingOrders] = useState<PickingOrder[]>([
    {
      id: "1",
      number: "PICK-2024-001",
      deliveryNumber: "DEL-2024-001",
      customer: "Reliance Digital, Delhi",
      warehouse: "Mumbai Warehouse",
      items: 4,
      status: "completed",
      assignedTo: user?.name,
      createdDate: "2024-12-10",
      completedDate: "2024-12-10",
    },
    {
      id: "2",
      number: "PICK-2024-002",
      deliveryNumber: "DEL-2024-002",
      customer: "Croma Electronics, Mumbai",
      warehouse: "Mumbai Warehouse",
      items: 6,
      status: "in-progress",
      assignedTo: user?.name,
      createdDate: "2024-12-12",
    },
    {
      id: "3",
      number: "PICK-2024-003",
      deliveryNumber: "DEL-2024-003",
      customer: "Vijay Sales, Pune",
      warehouse: "Delhi Warehouse",
      items: 2,
      status: "pending",
      createdDate: "2024-12-14",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredOrders = pickingOrders.filter((o) => {
    const matchesSearch =
      o.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.deliveryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleView = (order: PickingOrder) => {
    // Open picking details modal or navigate to detail page
    alert(`Viewing picking order ${order.number}`)
  }

  const handleStart = (order: PickingOrder) => {
    if (confirm(`Start picking order ${order.number}?`)) {
      setPickingOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "in-progress",
                assignedTo: user?.name,
              }
            : o
        )
      )
    }
  }

  const handleComplete = (order: PickingOrder) => {
    if (confirm(`Mark picking order ${order.number} as completed?`)) {
      setPickingOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "completed",
                completedDate: new Date().toISOString().split("T")[0],
              }
            : o
        )
      )
    }
  }

  const columnsWithHandlers = columns({
    onView: handleView,
    onStart: handleStart,
    onComplete: handleComplete,
  })

  return (
    <RoleGuard page="/picking">
      <div>
        <TopNav />
        <main className="p-4 md:p-8">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground">Picking</h1>
              <p className="text-muted mt-2">Manage picking orders for deliveries</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search picking order, delivery, or customer..."
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <DataTable columns={columnsWithHandlers} data={filteredOrders} />
          </div>
        </main>
      </div>
    </RoleGuard>
  )
}

