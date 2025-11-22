"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search, MapPin, Edit2, Trash2, ChevronDown } from "lucide-react"

interface Location {
  id: string
  name: string
  code: string
  capacity: number
}

interface Warehouse {
  id: string
  name: string
  location: string
  status: "active" | "inactive"
  locations: Location[]
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "1",
      name: "Main Warehouse",
      location: "Mumbai, India",
      status: "active",
      locations: [
        { id: "L1", name: "Shelf A1", code: "A1", capacity: 500 },
        { id: "L2", name: "Shelf A2", code: "A2", capacity: 750 },
      ],
    },
    {
      id: "2",
      name: "Secondary Hub",
      location: "Delhi, India",
      status: "active",
      locations: [{ id: "L3", name: "Shelf B1", code: "B1", capacity: 600 }],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "" })

  const handleAddWarehouse = () => {
    if (newWarehouse.name.trim() && newWarehouse.location.trim()) {
      setWarehouses([
        ...warehouses,
        {
          id: Math.random().toString(),
          name: newWarehouse.name,
          location: newWarehouse.location,
          status: "active",
          locations: [],
        },
      ])
      setNewWarehouse({ name: "", location: "" })
      setShowForm(false)
    }
  }

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Warehouses</h1>
              <p className="text-muted mt-2">Manage warehouse locations and storage</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              Add Warehouse
            </button>
          </div>

          {/* Add Warehouse Form */}
          {showForm && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-6">Add New Warehouse</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Warehouse Name</label>
                  <input
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    placeholder="e.g., Main Warehouse"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    placeholder="e.g., Mumbai, India"
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddWarehouse} className="btn-primary">
                  Create Warehouse
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Warehouses List */}
          <div className="space-y-4">
            {filteredWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="card">
                {/* Warehouse Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedWarehouse(expandedWarehouse === warehouse.id ? null : warehouse.id)}
                >
                  <div className="flex items-center gap-4">
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedWarehouse === warehouse.id ? "rotate-180" : ""}`}
                    />
                    <div>
                      <h3 className="text-lg font-bold">{warehouse.name}</h3>
                      <p className="text-sm text-muted flex items-center gap-1 mt-1">
                        <MapPin size={16} />
                        {warehouse.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                      {warehouse.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted-bg rounded text-muted hover:text-foreground">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-muted-bg rounded text-muted hover:text-error">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Locations */}
                {expandedWarehouse === warehouse.id && (
                  <div className="mt-6 pt-6 border-t border-card-border">
                    <h4 className="font-medium mb-4">Storage Locations</h4>
                    {warehouse.locations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {warehouse.locations.map((location) => (
                          <div key={location.id} className="p-4 bg-muted-bg rounded-lg border border-card-border">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium">{location.name}</p>
                                <p className="text-xs text-muted">Code: {location.code}</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="text-primary text-xs hover:text-primary-light">Edit</button>
                                <button className="text-error text-xs hover:text-warning">Remove</button>
                              </div>
                            </div>
                            <p className="text-sm text-muted mt-3">
                              Capacity: <span className="text-foreground font-medium">{location.capacity} units</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-sm">No locations added yet</p>
                    )}
                    <button className="mt-4 text-primary hover:text-primary-light text-sm font-medium">
                      + Add Location
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredWarehouses.length === 0 && (
            <div className="text-center py-12 card">
              <MapPin size={48} className="mx-auto text-muted mb-4 opacity-50" />
              <p className="text-muted text-lg">No warehouses found</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
