"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Plus, Search } from "lucide-react"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Samsung Phones", productCount: 156, description: "Samsung Galaxy series smartphones" },
    { id: 2, name: "Apple Products", productCount: 234, description: "iPhones, MacBooks, and Apple accessories" },
    { id: 3, name: "Laptops & Electronics", productCount: 89, description: "Laptops, tablets, and electronic devices" },
    { id: 4, name: "Mobile Accessories", productCount: 45, description: "Cases, chargers, and phone accessories" },
  ])

  const [newCategory, setNewCategory] = useState("")
  const [description, setDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          id: Math.max(...categories.map((c) => c.id)) + 1,
          name: newCategory,
          productCount: 0,
          description,
        },
      ])
      setNewCategory("")
      setDescription("")
    }
  }

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Categories</h1>
            <p className="text-muted mt-2">Organize your products by category</p>
          </div>

          {/* Add Category Form */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-6">Add New Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Electronics"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  className="input-field w-full"
                />
              </div>
              <div className="flex items-end">
                <button onClick={handleAddCategory} className="btn-primary w-full">
                  <Plus size={20} className="inline mr-2" />
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="card hover:border-primary transition-colors">
                <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-muted mb-4">{category.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm text-muted">{category.productCount} products</span>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary hover:text-primary-light">Edit</button>
                    <button className="text-sm text-error hover:text-warning">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No categories found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
