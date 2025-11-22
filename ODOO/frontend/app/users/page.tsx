"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { Plus, Search, Edit2, Trash2, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "inventory_manager" | "warehouse_staff"
  status: "active" | "inactive"
  joinDate: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@company.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-01",
    },
    {
      id: "2",
      name: "John Manager",
      email: "john@company.com",
      role: "inventory_manager",
      status: "active",
      joinDate: "2024-06-15",
    },
    {
      id: "3",
      name: "Staff Member",
      email: "staff@company.com",
      role: "warehouse_staff",
      status: "active",
      joinDate: "2024-09-20",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const roleColors = {
    admin: "bg-error/10 text-error",
    inventory_manager: "bg-primary/10 text-primary",
    warehouse_staff: "bg-info/10 text-info",
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">User Management</h1>
              <p className="text-muted mt-2">Manage team members and permissions</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 w-fit">
              <Plus size={20} />
              Add User
            </button>
          </div>

          {/* Add User Form */}
          {showForm && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-6">Add New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" placeholder="john@company.com" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select className="input-field w-full">
                    <option>Admin</option>
                    <option>Inventory Manager</option>
                    <option>Warehouse Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input type="password" placeholder="••••••••" className="input-field w-full" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn-primary">Create User</button>
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Users Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Role</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Join Date</th>
                  <th className="text-right py-4 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-card-border hover:bg-muted-bg transition-colors">
                    <td className="py-4 px-4 font-medium">{user.name}</td>
                    <td className="py-4 px-4 text-muted">{user.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          roleColors[user.role as keyof typeof roleColors]
                        }`}
                      >
                        <Shield size={14} />
                        {user.role.replace("_", " ").charAt(0).toUpperCase() + user.role.slice(1).replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted text-sm">{user.joinDate}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="p-1 hover:bg-card-border rounded text-muted hover:text-foreground">
                          <Edit2 size={18} />
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
          </div>
        </div>
      </main>
    </>
  )
}
