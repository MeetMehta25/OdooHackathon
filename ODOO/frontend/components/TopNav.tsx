"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission } from "@/lib/permissions"
import { BarChart3, Package, Warehouse, TrendingUp, FileText, Users, Settings, LogOut, Menu, X, ArrowLeftRight, PackageSearch, ClipboardCheck } from "lucide-react"
import { useState } from "react"

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3, permission: "view_dashboard" },
    { href: "/products", label: "Products", icon: Package, permission: "view_products" },
    { href: "/warehouses", label: "Warehouses", icon: Warehouse, permission: "view_warehouses" },
    { href: "/inventory", label: "Inventory", icon: TrendingUp, permission: "view_inventory" },
    { href: "/receipts", label: "Receipts", icon: FileText, permission: "view_receipts" },
    { href: "/deliveries", label: "Deliveries", icon: FileText, permission: "view_deliveries" },
    { href: "/transfers", label: "Transfers", icon: ArrowLeftRight, permission: "view_transfers" },
    { href: "/picking", label: "Picking", icon: PackageSearch, permission: "perform_picking" },
    { href: "/counting", label: "Counting", icon: ClipboardCheck, permission: "perform_counting" },
    { href: "/ledger", label: "Stock Ledger", icon: TrendingUp, permission: "view_ledger" },
    { href: "/alerts", label: "Alerts", icon: BarChart3, permission: "view_alerts" },
    { href: "/users", label: "Users", icon: Users, permission: "manage_users" },
    { href: "/settings", label: "Settings", icon: Settings, permission: "view_dashboard" },
  ]

  const visibleItems = menuItems.filter((item) => {
    if (!user) return false
    return hasPermission(user.role, item.permission as any)
  })

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6 w-full gap-2 lg:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-primary whitespace-nowrap">StockMaster</h1>
          </div>
          
          {/* Desktop Navigation - Scrollable */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0 mx-2">
            <div className="flex items-center gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                      isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted-bg"
                    }`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Right Side - Logout (Desktop) */}
          {user && (
            <div className="hidden lg:flex items-center flex-shrink-0">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-md text-foreground hover:bg-muted-bg transition-colors whitespace-nowrap flex-shrink-0"
                title="Logout"
              >
                <LogOut size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted-bg flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 border-t border-white/20 glass-nav">
            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted-bg"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Logout Mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-foreground hover:bg-muted-bg transition-colors mt-2"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-[57px] lg:h-[57px]" />
    </>
  )
}
