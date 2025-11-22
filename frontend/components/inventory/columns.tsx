"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type InventoryItem = {
  id: string
  product: string
  sku: string
  warehouse: string
  location: string
  quantity: number
  reorderLevel: number
  status: "in-stock" | "low" | "out"
  lastUpdate: string
}

const statusColors = {
  "in-stock": "text-success bg-success/10",
  low: "text-warning bg-warning/10",
  out: "text-error bg-error/10",
}

const statusLabels = {
  "in-stock": "In Stock",
  low: "Low Stock",
  out: "Out of Stock",
}

interface ColumnHandlers {
  onView?: (item: InventoryItem) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<InventoryItem>[] => [
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
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div className="font-medium">{row.getValue("product")}</div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="text-muted text-sm">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => {
      const item = row.original
      return <div className="text-sm">{item.warehouse} • {item.location}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "reorderLevel",
    header: () => <div className="text-center">Reorder Level</div>,
    cell: ({ row }) => <div className="text-center text-muted">{row.getValue("reorderLevel")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusLabels
      return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      )
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Last Update",
    cell: ({ row }) => <div className="text-sm text-muted">{row.getValue("lastUpdate")}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(item)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
        </div>
      )
    },
  },
]

