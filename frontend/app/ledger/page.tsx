"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Search } from "lucide-react"

interface LedgerEntry {
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

export default function LedgerPage() {
  const [ledger] = useState<LedgerEntry[]>([
    {
      id: "1",
      date: "2024-12-14",
      document: "REC-2024-001",
      type: "receipt",
      product: "Widget Pro",
      warehouse: "Main WH",
      before: 200,
      movement: 50,
      after: 250,
      notes: "Stock received from supplier",
    },
    {
      id: "2",
      date: "2024-12-14",
      document: "DEL-2024-001",
      type: "delivery",
      product: "Widget Pro",
      warehouse: "Main WH",
      before: 250,
      movement: -30,
      after: 220,
      notes: "Order shipped to customer",
    },
    {
      id: "3",
      date: "2024-12-13",
      document: "TRF-2024-001",
      type: "transfer",
      product: "Gadget X",
      warehouse: "Secondary WH",
      before: 100,
      movement: 25,
      after: 125,
      notes: "Transfer from Main WH",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

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

  const filteredLedger = ledger.filter((entry) => {
    const matchesSearch =
      entry.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.document.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || entry.type === filterType
    return matchesSearch && matchesType
  })

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

          {/* Ledger Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Document</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Product</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Before</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">Movement</th>
                  <th className="text-center py-4 px-4 font-semibold text-sm">After</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((entry) => (
                  <tr key={entry.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 text-sm">{entry.date}</td>
                    <td className="py-4 px-4 font-medium text-primary">{entry.document}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          typeColors[entry.type as keyof typeof typeColors]
                        }`}
                      >
                        {typeLabels[entry.type as keyof typeof typeLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4">{entry.product}</td>
                    <td className="py-4 px-4 text-center">{entry.before}</td>
                    <td
                      className={`py-4 px-4 text-center font-medium ${entry.movement > 0 ? "text-success" : "text-error"}`}
                    >
                      {entry.movement > 0 ? "+" : ""}
                      {entry.movement}
                    </td>
                    <td className="py-4 px-4 text-center font-medium">{entry.after}</td>
                    <td className="py-4 px-4 text-sm text-muted">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLedger.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No ledger entries found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
