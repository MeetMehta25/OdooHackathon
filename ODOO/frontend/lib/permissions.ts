import type { UserRole } from "@/types"

export type Permission = 
  | "view_products"
  | "create_products"
  | "edit_products"
  | "delete_products"
  | "view_inventory"
  | "adjust_inventory"
  | "view_warehouses"
  | "manage_warehouses"
  | "view_receipts"
  | "create_receipts"
  | "edit_receipts"
  | "delete_receipts"
  | "view_deliveries"
  | "create_deliveries"
  | "edit_deliveries"
  | "delete_deliveries"
  | "view_ledger"
  | "create_transfers"
  | "view_transfers"
  | "perform_picking"
  | "perform_counting"
  | "view_dashboard"
  | "view_alerts"
  | "manage_users"

const rolePermissions: Record<UserRole, Permission[]> = {
  inventory_manager: [
    "view_dashboard",
    "view_products",
    "create_products",
    "edit_products",
    "delete_products",
    "view_inventory",
    "adjust_inventory",
    "view_warehouses",
    "view_receipts",
    "create_receipts",
    "edit_receipts",
    "delete_receipts",
    "view_deliveries",
    "create_deliveries",
    "edit_deliveries",
    "delete_deliveries",
    "view_ledger",
    "view_alerts",
  ],
  warehouse_staff: [
    "view_dashboard",
    "view_products",
    "view_inventory",
    "view_warehouses",
    "create_transfers",
    "view_transfers",
    "perform_picking",
    "perform_counting",
    "view_ledger",
    "view_receipts",
    "view_deliveries",
  ],
  admin: [
    "view_dashboard",
    "view_products",
    "create_products",
    "edit_products",
    "delete_products",
    "view_inventory",
    "adjust_inventory",
    "view_warehouses",
    "manage_warehouses",
    "view_receipts",
    "create_receipts",
    "edit_receipts",
    "delete_receipts",
    "view_deliveries",
    "create_deliveries",
    "edit_deliveries",
    "delete_deliveries",
    "view_ledger",
    "create_transfers",
    "view_transfers",
    "perform_picking",
    "perform_counting",
    "view_alerts",
    "manage_users",
  ],
}

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false
  return rolePermissions[role]?.includes(permission) ?? false
}

export function canAccessPage(role: UserRole | undefined, page: string): boolean {
  if (!role) return false

  const pagePermissions: Record<string, Permission[]> = {
    "/dashboard": ["view_dashboard"],
    "/products": ["view_products"],
    "/inventory": ["view_inventory"],
    "/warehouses": ["view_warehouses"],
    "/receipts": ["view_receipts"],
    "/deliveries": ["view_deliveries"],
    "/ledger": ["view_ledger"],
    "/alerts": ["view_alerts"],
    "/transfers": ["view_transfers"],
    "/picking": ["perform_picking"],
    "/counting": ["perform_counting"],
    "/users": ["manage_users"],
    "/settings": ["view_dashboard"], // Everyone can access settings
  }

  const requiredPermissions = pagePermissions[page] || []
  return requiredPermissions.some((perm) => hasPermission(role, perm))
}

