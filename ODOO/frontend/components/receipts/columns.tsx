"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type Receipt = {
  id: string
  number: string
  supplier: string
  status: "draft" | "pending" | "ready" | "done" | "canceled"
  expectedDate: string
  items: number
  createdDate: string
}

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

interface ColumnHandlers {
  onView?: (receipt: Receipt) => void
  onEdit?: (receipt: Receipt) => void
  onDelete?: (receipt: Receipt) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<Receipt>[] => [
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
    header: "Receipt #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "expectedDate",
    header: "Expected Date",
    cell: ({ row }) => <div className="text-muted">{row.getValue("expectedDate")}</div>,
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
      const receipt = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(receipt)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handlers?.onEdit?.(receipt)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handlers?.onDelete?.(receipt)}
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

