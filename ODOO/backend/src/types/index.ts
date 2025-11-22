// Common response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enums
export enum UserRole {
  INVENTORY_MANAGER = "inventory_manager",
  WAREHOUSE_STAFF = "warehouse_staff",
  ADMIN = "admin",
}

export enum OperationStatus {
  DRAFT = "draft",
  PENDING = "pending",
  READY = "ready",
  DONE = "done",
  CANCELED = "canceled",
}

export enum MovementType {
  RECEIPT = "receipt",
  DELIVERY = "delivery",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
}

// User related
export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface OTPRequest {
  id: string;
  user_id: string;
  otp: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

// Product related
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category_id?: string;
  uom?: string;
  reorder_level: number;
  created_at: Date;
  updated_at: Date;
}

// Warehouse related
export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  created_at: Date;
}

export interface Location {
  id: string;
  warehouse_id: string;
  name: string;
}

export interface ProductStock {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id: string;
  quantity: number;
}

// Receipt related
export interface Receipt {
  id: string;
  supplier_name?: string;
  reference_no?: string;
  status: OperationStatus;
  warehouse_id?: string;
  created_by?: string;
  created_at: Date;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  product_id: string;
  quantity_expected: number;
  quantity_received: number;
  location_id?: string;
}

// Delivery related
export interface Delivery {
  id: string;
  customer_name?: string;
  reference_no?: string;
  status: OperationStatus;
  warehouse_id?: string;
  created_by?: string;
  created_at: Date;
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  product_id: string;
  quantity_picked: number;
  quantity_delivered: number;
  location_id?: string;
}

// Internal Transfer related
export interface InternalTransfer {
  id: string;
  reference_no?: string;
  source_location_id?: string;
  destination_location_id?: string;
  status: OperationStatus;
  created_by?: string;
  created_at: Date;
}

export interface TransferItem {
  id: string;
  transfer_id: string;
  product_id: string;
  quantity: number;
}

// Stock Adjustment
export interface StockAdjustment {
  id: string;
  product_id: string;
  location_id: string;
  counted_quantity: number;
  previous_quantity: number;
  difference: number;
  reason?: string;
  created_by?: string;
  created_at: Date;
}

// Stock Ledger
export interface StockLedger {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id: string;
  quantity_change: number;
  movement_type: MovementType;
  document_id?: string;
  before_quantity?: number;
  after_quantity?: number;
  timestamp: Date;
}

// Low Stock Alert
export interface LowStockAlert {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id: string;
  current_quantity?: number;
  threshold?: number;
  is_read: boolean;
  created_at: Date;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Auth request bodies
export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

// Email options
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  total_products: number;
  total_warehouses: number;
  pending_receipts: number;
  pending_deliveries: number;
  pending_transfers: number;
  low_stock_alerts: number;
  total_stock_quantity: number;
}

// Stock summary by warehouse
export interface StockSummaryByWarehouse {
  warehouse_id: string;
  warehouse_name: string;
  total_products: number;
  total_quantity: number;
}

// Stock summary by product
export interface StockSummaryByProduct {
  product_id: string;
  product_name: string;
  sku: string;
  total_quantity: number;
  warehouses_count: number;
}

// Recent activity
export interface RecentActivity {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id: string;
  quantity_change: number;
  movement_type: MovementType;
  document_id?: string;
  timestamp: Date;
}

// Request body types for operations
export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  category_id?: string;
  uom?: string;
  reorder_level?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  sku?: string;
  category_id?: string;
  uom?: string;
  reorder_level?: number;
}

export interface CreateWarehouseRequest {
  name: string;
  address?: string;
}

export interface CreateLocationRequest {
  warehouse_id: string;
  name: string;
}

export interface CreateReceiptRequest {
  supplier_name?: string;
  reference_no?: string;
  warehouse_id?: string;
  items: Array<{
    product_id: string;
    quantity_expected: number;
    location_id?: string;
  }>;
}

export interface CreateDeliveryRequest {
  customer_name?: string;
  reference_no?: string;
  warehouse_id?: string;
  items: Array<{
    product_id: string;
    quantity_picked: number;
    location_id?: string;
  }>;
}

export interface CreateTransferRequest {
  reference_no?: string;
  source_location_id?: string;
  destination_location_id?: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface CreateAdjustmentRequest {
  product_id: string;
  location_id: string;
  counted_quantity: number;
  previous_quantity: number;
  reason?: string;
}

export interface UpdateStatusRequest {
  status: OperationStatus;
}

// OTP verification request
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

// Password reset request
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}
