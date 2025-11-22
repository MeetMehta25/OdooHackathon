"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { ProductForm } from "@/components/products/product-form"
import { DataTable } from "@/components/ui/data-table"
import { columns, Product } from "@/components/products/columns"
import { Plus, Search } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission } from "@/lib/permissions"

export default function ProductsPage() {
  const { user } = useAuthStore()
  const canCreate = hasPermission(user?.role, "create_products")
  const canEdit = hasPermission(user?.role, "edit_products")
  const canDelete = hasPermission(user?.role, "delete_products")

  const [products, setProducts] = useState<Product[]>([
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

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleNewProduct = () => {
    setEditingProduct(null)
    setViewingProduct(null)
    setShowForm(true)
  }

  const handleView = (product: Product) => {
    setViewingProduct(product)
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setViewingProduct(null)
    setShowForm(true)
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete product ${product.name}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    }
  }

  const handleDeleteSelected = (selectedIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} product(s)?`)) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(String(p.id))))
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    setViewingProduct(null)
  }

  const handleFormSubmit = (formData: Partial<Product> & { description?: string; uom?: string; reorderLevel?: number }) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name || p.name,
                sku: formData.sku || p.sku,
                category: formData.category || p.category,
                // Keep stock and value for now, or calculate based on formData
              }
            : p
        )
      )
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name || "",
        sku: formData.sku || "",
        category: formData.category || "",
        stock: 0,
        value: "₹0",
        status: "out",
      }
      setProducts((prev) => [...prev, newProduct])
    }
    handleFormClose()
  }

  const columnsWithHandlers = columns({
    onView: handleView,
    onEdit: canEdit ? handleEdit : undefined,
    onDelete: canDelete ? handleDelete : undefined,
  })

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
            {canCreate && (
              <button onClick={handleNewProduct} className="btn-primary flex items-center gap-2 w-fit">
                <Plus size={20} />
                Add Product
              </button>
            )}
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="mb-8 card">
              <ProductForm
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                product={editingProduct || viewingProduct}
                viewOnly={!!viewingProduct && !editingProduct}
              />
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

          {/* Data Table */}
          <DataTable
            columns={columnsWithHandlers}
            data={filteredProducts}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
    </>
  )
}
