"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, LedgerEntry } from "@/components/ledger/columns"

export default function LedgerPage() {
  const [ledger] = useState<LedgerEntry[]>([
    {
      id: "1",
      date: "2024-12-14",
      document: "REC-2024-001",
      type: "receipt",
      product: "Samsung Galaxy S24",
      warehouse: "Mumbai Warehouse",
      before: 200,
      movement: 50,
      after: 250,
      notes: "Stock received from Samsung India, Mumbai",
    },
    {
      id: "2",
      date: "2024-12-14",
      document: "DEL-2024-001",
      type: "delivery",
      product: "Apple iPhone 15 Pro",
      warehouse: "Mumbai Warehouse",
      before: 250,
      movement: -30,
      after: 220,
      notes: "Order shipped to Reliance Digital, Delhi",
    },
    {
      id: "3",
      date: "2024-12-13",
      document: "TRF-2024-001",
      type: "transfer",
      product: "MacBook Pro M3",
      warehouse: "Delhi Warehouse",
      before: 100,
      movement: 25,
      after: 125,
      notes: "Transfer from Mumbai Warehouse",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredLedger = ledger.filter((entry) => {
    const matchesSearch =
      entry.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.document.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || entry.type === filterType
    return matchesSearch && matchesType
  })

  const handleDeleteSelected = (selectedIds: string[]) => {
    // Ledger is typically read-only, but we'll add the handler for consistency
    if (confirm(`Are you sure you want to delete ${selectedIds.length} entry(ies)?`)) {
      // In a real app, this would be handled by the backend
      console.log("Delete entries:", selectedIds)
    }
  }

  return (
    <div>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground">Stock Ledger</h1>
            <p className="text-muted mt-2">Complete transaction history and stock movements</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search by product or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field">
              <option value="all">All Types</option>
              <option value="receipt">Receipt</option>
              <option value="delivery">Delivery</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={filteredLedger} onDeleteSelected={handleDeleteSelected} />
        </div>
      </main>
    </div>
  )
}
