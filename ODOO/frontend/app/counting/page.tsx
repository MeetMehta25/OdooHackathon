"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, CountingTask } from "@/components/counting/columns"
import { CountingForm } from "@/components/counting/counting-form"
import { RoleGuard } from "@/components/RoleGuard"
import { useAuthStore } from "@/lib/auth-store"

export default function CountingPage() {
  const { user } = useAuthStore()
  const [countingTasks, setCountingTasks] = useState<CountingTask[]>([
    {
      id: "1",
      number: "CNT-2024-001",
      warehouse: "Mumbai Warehouse",
      location: "A1",
      product: "Samsung Galaxy S24",
      expectedQuantity: 245,
      countedQuantity: 245,
      variance: 0,
      status: "approved",
      assignedTo: user?.name,
      createdDate: "2024-12-10",
      completedDate: "2024-12-10",
    },
    {
      id: "2",
      number: "CNT-2024-002",
      warehouse: "Mumbai Warehouse",
      location: "A2",
      product: "Apple iPhone 15 Pro",
      expectedQuantity: 12,
      countedQuantity: 10,
      variance: -2,
      status: "completed",
      assignedTo: user?.name,
      createdDate: "2024-12-12",
      completedDate: "2024-12-12",
    },
    {
      id: "3",
      number: "CNT-2024-003",
      warehouse: "Delhi Warehouse",
      location: "B1",
      product: "MacBook Pro M3",
      expectedQuantity: 100,
      countedQuantity: 0,
      variance: -100,
      status: "in-progress",
      assignedTo: user?.name,
      createdDate: "2024-12-14",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<CountingTask | null>(null)
  const [viewingTask, setViewingTask] = useState<CountingTask | null>(null)

  const filteredTasks = countingTasks.filter((t) => {
    const matchesSearch =
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleNewTask = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleView = (task: CountingTask) => {
    setViewingTask(task)
    setShowForm(true)
  }

  const handleEdit = (task: CountingTask) => {
    setEditingTask(task)
    setViewingTask(null)
    setShowForm(true)
  }

  const handleDelete = (task: CountingTask) => {
    if (confirm(`Are you sure you want to delete counting task ${task.number}?`)) {
      setCountingTasks((prev) => prev.filter((t) => t.id !== task.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} task(s)?`)) {
      setCountingTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTask(null)
    setViewingTask(null)
  }

  const handleFormSubmit = (formData: Partial<CountingTask>) => {
    if (editingTask) {
      setCountingTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...formData,
                number: t.number,
              }
            : t
        )
      )
    } else {
      const newTask: CountingTask = {
        id: Date.now().toString(),
        number: `CNT-2024-${String(countingTasks.length + 1).padStart(3, "0")}`,
        product: formData.product || "",
        warehouse: formData.warehouse || "",
        location: formData.location,
        expectedQuantity: formData.expectedQuantity || 0,
        countedQuantity: formData.countedQuantity || 0,
        variance: formData.variance || 0,
        status: formData.status || "pending",
        assignedTo: user?.name,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setCountingTasks((prev) => [...prev, newTask])
    }
    handleFormClose()
  }

  const columnsWithHandlers = columns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <RoleGuard page="/counting">
      <>
        <TopNav />
        <main className="p-4 md:p-8">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Stock Counting</h1>
                <p className="text-muted mt-2">Perform stock counting and adjustments</p>
              </div>
              <button onClick={handleNewTask} className="btn-primary flex items-center gap-2 w-fit">
                <Plus size={20} />
                New Counting Task
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search task number or product..."
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
                <option value="approved">Approved</option>
              </select>
            </div>

            {showForm && (
              <div className="mb-8 card">
                <CountingForm
                  onClose={handleFormClose}
                  onSubmit={handleFormSubmit}
                  task={editingTask || viewingTask}
                  viewOnly={!!viewingTask && !editingTask}
                />
              </div>
            )}

            <DataTable
              columns={columnsWithHandlers}
              data={filteredTasks}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </main>
      </>
    </RoleGuard>
  )
}

