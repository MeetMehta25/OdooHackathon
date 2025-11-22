"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type Location = {
  id: string
  name: string
  code: string
  capacity: number
}

export type Warehouse = {
  id: string
  name: string
  location: string
  status: "active" | "inactive"
  locations: Location[]
}

interface ColumnHandlers {
  onView?: (warehouse: Warehouse) => void
  onEdit?: (warehouse: Warehouse) => void
  onDelete?: (warehouse: Warehouse) => void
}

export const columns = (handlers?: ColumnHandlers): ColumnDef<Warehouse>[] => [
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
    accessorKey: "name",
    header: "Warehouse Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div className="text-sm">{row.getValue("location")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span className={`px-2 py-1 bg-success/10 text-success text-xs font-medium rounded`}>
          {status === "active" ? "Active" : "Inactive"}
        </span>
      )
    },
  },
  {
    accessorKey: "locations",
    header: () => <div className="text-center">Locations</div>,
    cell: ({ row }) => {
      const locations = row.getValue("locations") as Location[]
      return <div className="text-center">{locations.length}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handlers?.onView?.(warehouse)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handlers?.onEdit?.(warehouse)}
            className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handlers?.onDelete?.(warehouse)}
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

