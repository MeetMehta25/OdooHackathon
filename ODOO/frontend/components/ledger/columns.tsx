"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type LedgerEntry = {
  id: string
  date: string
  document: string
  type: "receipt" | "delivery" | "transfer" | "adjustment"
  product: string
  warehouse: string
  before: number
  movement: number
  after: number
  notes: string
}

const typeColors = {
  receipt: "bg-success/10 text-success",
  delivery: "bg-warning/10 text-warning",
  transfer: "bg-info/10 text-info",
  adjustment: "bg-error/10 text-error",
}

const typeLabels = {
  receipt: "Receipt",
  delivery: "Delivery",
  transfer: "Transfer",
  adjustment: "Adjustment",
}

export const columns: ColumnDef<LedgerEntry>[] = [
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="text-sm">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => <div className="font-medium text-primary">{row.getValue("document")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof typeLabels
      return (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeColors[type]}`}>
          {typeLabels[type]}
        </span>
      )
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div>{row.getValue("product")}</div>,
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => <div className="text-sm">{row.getValue("warehouse")}</div>,
  },
  {
    accessorKey: "before",
    header: () => <div className="text-center">Before</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("before")}</div>,
  },
  {
    accessorKey: "movement",
    header: () => <div className="text-center">Movement</div>,
    cell: ({ row }) => {
      const movement = row.getValue("movement") as number
      return (
        <div className={`text-center font-medium ${movement > 0 ? "text-success" : "text-error"}`}>
          {movement > 0 ? "+" : ""}
          {movement}
        </div>
      )
    },
  },
  {
    accessorKey: "after",
    header: () => <div className="text-center">After</div>,
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("after")}</div>,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => <div className="text-sm text-muted">{row.getValue("notes")}</div>,
  },
]

