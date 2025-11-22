"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type CountingTask = {
  id: string
  number: string
  warehouse: string
  location?: string
  product: string
  expectedQuantity: number
  countedQuantity: number
  variance: number
  status: "pending" | "in-progress" | "completed" | "approved"
  assignedTo?: string
  createdDate: string
  completedDate?: string
}

interface ColumnHandlers {
  onView?: (task: CountingTask) => void
  onEdit?: (task: CountingTask) => void
  onDelete?: (task: CountingTask) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<CountingTask>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
  },
  {
    accessorKey: "number",
    header: "Task #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div>{row.getValue("product")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => {
      const task = row.original
      return <div className="text-sm">{task.warehouse} {task.location && `• ${task.location}`}</div>
    },
  },
  {
    accessorKey: "expectedQuantity",
    header: () => <div className="text-center">Expected</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("expectedQuantity")}</div>,
  },
  {
    accessorKey: "countedQuantity",
    header: () => <div className="text-center">Counted</div>,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("countedQuantity")}</div>,
  },
  {
    accessorKey: "variance",
    header: () => <div className="text-center">Variance</div>,
    cell: ({ row }) => {
      const variance = row.getValue("variance") as number
      return (
        <div className={`text-center font-medium ${variance === 0 ? "text-success" : "text-error"}`}>
          {variance > 0 ? "+" : ""}
          {variance}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColors: Record<string, string> = {
        pending: "bg-warning/10 text-warning",
        "in-progress": "bg-info/10 text-info",
        completed: "bg-success/10 text-success",
        approved: "bg-success/10 text-success",
      }
      const statusLabels: Record<string, string> = {
        pending: "Pending",
        "in-progress": "In Progress",
        completed: "Completed",
        approved: "Approved",
      }
      return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || ""}`}>
          {statusLabels[status] || status}
        </span>
      )
    },
  },
  {
    accessorKey: "createdDate",
    header: "Created",
    cell: ({ row }) => <div className="text-sm text-muted">{row.getValue("createdDate")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const task = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(task)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handlers?.onEdit?.(task)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handlers?.onDelete?.(task)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-error"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    },
  },
]

