"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  onDeleteSelected?: (selectedIds: string[]) => void
}

export function DataTable<TData extends { id: string | number }>({
  columns,
  data,
  onDeleteSelected,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="card overflow-x-auto">

      {/* ⭐ Selection Bar */}
      {selectedCount > 0 && (
        <div className="p-4 border-b border-card-border flex items-center justify-between bg-muted-bg">
          <p className="font-medium">{selectedCount} selected</p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((row) => String(row.original.id))
              onDeleteSelected?.(selectedIds)
              table.resetRowSelection()
            }}
          >
            Delete Selected
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="hover:bg-muted-bg border-b border-card-border"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-12">
                <p className="text-muted">No deliveries found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
