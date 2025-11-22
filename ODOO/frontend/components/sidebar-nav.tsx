"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { BarChart3, Package, Warehouse, TrendingUp, FileText, Users, Settings, LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3, all: true },
    { href: "/products", label: "Products", icon: Package, all: true },
    { href: "/warehouses", label: "Warehouses", icon: Warehouse, all: true },
    { href: "/inventory", label: "Inventory", icon: TrendingUp, all: true },
    { href: "/receipts", label: "Receipts", icon: FileText, all: true },
    { href: "/deliveries", label: "Deliveries", icon: FileText, all: true },
    { href: "/ledger", label: "Stock Ledger", icon: TrendingUp, all: true },
    { href: "/alerts", label: "Alerts", icon: BarChart3, all: true },
    { href: "/users", label: "Users", icon: Users, admin: true },
    { href: "/settings", label: "Settings", icon: Settings, all: true },
  ]

  const visibleItems = menuItems.filter((item) => {
    if (item.all) return true
    if (item.admin && user?.role === "admin") return true
    return false
  })

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden glass-nav p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-nav transition-transform md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <h1 className="text-2xl font-bold text-primary">StockMaster</h1>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-white/20">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{user?.role.replace("_", " ")}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted-bg"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-foreground hover:bg-muted-bg transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
