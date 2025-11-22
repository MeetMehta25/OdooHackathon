"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type PickingOrder = {
  id: string
  number: string
  deliveryNumber: string
  customer: string
  warehouse: string
  items: number
  status: "pending" | "in-progress" | "completed" | "canceled"
  assignedTo?: string
  createdDate: string
  completedDate?: string
}

const statusColors = {
  pending: "bg-warning/10 text-warning",
  "in-progress": "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  canceled: "bg-error/10 text-error",
}

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
  canceled: "Canceled",
}

interface ColumnHandlers {
  onView?: (order: PickingOrder) => void
  onStart?: (order: PickingOrder) => void
  onComplete?: (order: PickingOrder) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<PickingOrder>[] => [
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
    header: "Picking #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "deliveryNumber",
    header: "Delivery #",
    cell: ({ row }) => <div className="text-sm text-muted">{row.getValue("deliveryNumber")}</div>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <div>{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => <div className="text-sm">{row.getValue("warehouse")}</div>,
  },
  {
    accessorKey: "items",
    header: () => <div className="text-center">Items</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("items")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusLabels
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[status]
          }`}
        >
          {statusLabels[status]}
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
      const order = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(order)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
          {order.status === "pending" && (
            <button
              onClick={() => handlers?.onStart?.(order)}
              className="p-1 hover:bg-card-border rounded text-muted hover:text-success"
              title="Start Picking"
            >
              <CheckCircle size={18} />
            </button>
          )}
          {order.status === "in-progress" && (
            <button
              onClick={() => handlers?.onComplete?.(order)}
              className="p-1 hover:bg-card-border rounded text-muted hover:text-success"
              title="Complete"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      )
    },
  },
]

