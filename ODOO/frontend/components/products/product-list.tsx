"use client"

import { Pencil, Trash2, Eye } from "lucide-react"
import { useState } from "react"

interface ProductListProps {
  searchQuery: string
  category: string
}

export function ProductList({ searchQuery, category }: ProductListProps) {
  const [products] = useState([
    {
      id: 1,
      name: "Widget Pro",
      sku: "SKU-001",
      category: "electronics",
      stock: 245,
      value: "₹2.45L",
      status: "in-stock",
    },
    { id: 2, name: "Gadget X", sku: "SKU-002", category: "electronics", stock: 8, value: "₹1.20L", status: "low" },
    {
      id: 3,
      name: "Raw Material A",
      sku: "SKU-003",
      category: "raw",
      stock: 1205,
      value: "₹8.45L",
      status: "in-stock",
    },
    { id: 4, name: "Finished Prod B", sku: "SKU-004", category: "finished", stock: 0, value: "₹0", status: "out" },
  ])

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || p.category === category
    return matchesSearch && matchesCategory
  })

  const statusColors = {
    "in-stock": "text-success",
    low: "text-warning",
    out: "text-error",
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-3 px-4 font-semibold text-sm">Product</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">SKU</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
            <th className="text-right py-3 px-4 font-semibold text-sm">Stock</th>
            <th className="text-right py-3 px-4 font-semibold text-sm">Value</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-b border-white/20 hover:bg-muted-bg transition-colors">
              <td className="py-4 px-4">{product.name}</td>
              <td className="py-4 px-4 text-muted">{product.sku}</td>
              <td className="py-4 px-4 text-sm text-muted capitalize">{product.category}</td>
              <td className="py-4 px-4 text-right">{product.stock.toLocaleString()}</td>
              <td className="py-4 px-4 text-right font-medium">{product.value}</td>
              <td className="py-4 px-4">
                <span
                  className={`text-sm font-medium capitalize ${statusColors[product.status as keyof typeof statusColors]}`}
                >
                  {product.status === "in-stock" ? "In Stock" : product.status === "low" ? "Low Stock" : "Out of Stock"}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex gap-2 justify-end">
                  <button className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground">
                    <Eye size={18} />
                  </button>
                  <button className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground">
                    <Pencil size={18} />
                  </button>
                  <button className="p-1 hover:bg-card-border rounded text-muted hover:text-error">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No products found</p>
        </div>
      )}
    </div>
  )
}
