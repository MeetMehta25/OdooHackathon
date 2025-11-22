"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  BarChart3,
  Package,
  Warehouse,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { href: "/admin?tab=dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin?tab=warehouses", label: "Warehouses", icon: Warehouse },
    { href: "/admin?tab=inventory", label: "Inventory", icon: TrendingUp },
    { href: "/admin?tab=receipts", label: "Receipts", icon: FileText },
    { href: "/admin?tab=deliveries", label: "Deliveries", icon: FileText },
    { href: "/admin?tab=ledger", label: "Stock Ledger", icon: Package },
    { href: "/admin?tab=settings", label: "Settings", icon: Settings },
  ];

  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-card-border">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6 w-full gap-2 lg:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-primary whitespace-nowrap">
              StockMaster Admin
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const tabName = item.href.split("?tab=")[1];
              const isActive = currentTab === tabName;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-medium text-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted capitalize">
                {user?.role.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-card-hover"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-card-border bg-card">
            <div className="flex flex-col p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const tabName = item.href.split("?tab=")[1];
                const isActive = currentTab === tabName;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted hover:bg-card-hover hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[60px]" />
    </>
  );
}
