export type UserRole = "inventory_manager" | "warehouse_staff" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface OTPVerificationRequest {
  email: string
  otp: string
  newPassword: string
}

// Product & Category
export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  categoryId: string
  uom: string
  reorderLevel: number
  createdAt: string
}

// Warehouse & Location
export interface Warehouse {
  id: string
  name: string
  location: string
  createdAt: string
}

export interface WarehouseLocation {
  id: string
  warehouseId: string
  name: string
  code: string
  createdAt: string
}

// Stock
export interface Stock {
  id: string
  productId: string
  warehouseId: string
  locationId: string
  quantity: number
  lastUpdated: string
}

// Receipts & Deliveries
export type DocumentStatus = "draft" | "pending" | "ready" | "done" | "canceled"

export interface Receipt {
  id: string
  status: DocumentStatus
  expectedDate: string
  createdAt: string
}

export interface Delivery {
  id: string
  status: DocumentStatus
  expectedDate: string
  createdAt: string
}
