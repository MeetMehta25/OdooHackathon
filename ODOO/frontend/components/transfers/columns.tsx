"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type Transfer = {
  id: string
  number: string
  product: string
  fromWarehouse: string
  toWarehouse: string
  quantity: number
  status: "draft" | "pending" | "in-transit" | "completed" | "canceled"
  createdDate: string
  completedDate?: string
}

const statusColors = {
  draft: "bg-muted text-muted",
  pending: "bg-warning/10 text-warning",
  "in-transit": "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  canceled: "bg-error/10 text-error",
}

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  "in-transit": "In Transit",
  completed: "Completed",
  canceled: "Canceled",
}

interface ColumnHandlers {
  onView?: (transfer: Transfer) => void
  onEdit?: (transfer: Transfer) => void
  onDelete?: (transfer: Transfer) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<Transfer>[] => [
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
    header: "Transfer #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div>{row.getValue("product")}</div>,
  },
  {
    accessorKey: "fromWarehouse",
    header: "From",
    cell: ({ row }) => <div className="text-sm">{row.getValue("fromWarehouse")}</div>,
  },
  {
    accessorKey: "toWarehouse",
    header: "To",
    cell: ({ row }) => <div className="text-sm">{row.getValue("toWarehouse")}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
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
      const transfer = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(transfer)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handlers?.onEdit?.(transfer)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handlers?.onDelete?.(transfer)}
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

