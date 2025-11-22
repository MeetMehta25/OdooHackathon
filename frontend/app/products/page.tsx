"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { ProductList } from "@/components/products/product-list"
import { ProductForm } from "@/components/products/product-form"
import { Plus, Search } from "lucide-react"

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <>
      <TopNav />
      <main className="pt-4 md:pt-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Products</h1>
              <p className="text-muted mt-2">Manage your product catalog</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="mb-8 card">
              <ProductForm onClose={() => setShowForm(false)} />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="raw">Raw Materials</option>
              <option value="finished">Finished Goods</option>
            </select>
          </div>

          {/* Product List */}
          <ProductList searchQuery={searchQuery} category={selectedCategory} />
        </div>
      </main>
    </>
  )
}
