import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import pool from "../config/database";
import { ApiResponse } from "../types";
import { RowDataPacket } from "mysql2";

// Get dashboard KPIs
export const getDashboardKPIs = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    // Total products
    const [productsCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products"
    );

    // Total warehouses
    const [warehousesCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM warehouses"
    );

    // Pending receipts
    const [pendingReceipts] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM receipts WHERE status IN ('draft', 'pending', 'ready')"
    );

    // Pending deliveries
    const [pendingDeliveries] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM deliveries WHERE status IN ('draft', 'pending', 'ready')"
    );

    // Pending transfers
    const [pendingTransfers] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM internal_transfers WHERE status IN ('draft', 'pending', 'ready')"
    );

    // Low stock alerts
    const [lowStockAlerts] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM low_stock_alerts WHERE is_read = FALSE"
    );

    // Total stock value (approximate)
    const [totalStockValue] = await pool.query<RowDataPacket[]>(
      "SELECT SUM(quantity) as total_quantity FROM product_stock"
    );

    const response: ApiResponse = {
      success: true,
      message: "Dashboard KPIs retrieved successfully",
      data: {
        total_products: productsCount[0].total,
        total_warehouses: warehousesCount[0].total,
        pending_receipts: pendingReceipts[0].total,
        pending_deliveries: pendingDeliveries[0].total,
        pending_transfers: pendingTransfers[0].total,
        low_stock_alerts: lowStockAlerts[0].total,
        total_stock_quantity: totalStockValue[0].total_quantity || 0,
      },
    };

    res.status(200).json(response);
  }
);

// Get recent activities
export const getRecentActivities = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const [activities] = await pool.query<RowDataPacket[]>(`
    SELECT 
      id,
      product_id,
      warehouse_id,
      location_id,
      quantity_change,
      movement_type,
      document_id,
      timestamp
    FROM stock_ledger
    ORDER BY timestamp DESC
    LIMIT 20
  `);

    const response: ApiResponse = {
      success: true,
      message: "Recent activities retrieved successfully",
      data: activities,
    };

    res.status(200).json(response);
  }
);

// Get stock summary by warehouse
export const getStockSummaryByWarehouse = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const [summary] = await pool.query<RowDataPacket[]>(`
    SELECT 
      w.id as warehouse_id,
      w.name as warehouse_name,
      COUNT(DISTINCT ps.product_id) as total_products,
      SUM(ps.quantity) as total_quantity
    FROM warehouses w
    LEFT JOIN product_stock ps ON w.id = ps.warehouse_id
    GROUP BY w.id, w.name
    ORDER BY w.name
  `);

    const response: ApiResponse = {
      success: true,
      message: "Stock summary retrieved successfully",
      data: summary,
    };

    res.status(200).json(response);
  }
);

// Get low stock products
export const getLowStockProducts = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const [lowStockProducts] = await pool.query<RowDataPacket[]>(`
    SELECT 
      p.id,
      p.name,
      p.sku,
      p.reorder_level,
      SUM(ps.quantity) as current_stock
    FROM products p
    LEFT JOIN product_stock ps ON p.id = ps.product_id
    GROUP BY p.id, p.name, p.sku, p.reorder_level
    HAVING current_stock < p.reorder_level OR current_stock IS NULL
    ORDER BY p.name
  `);

    const response: ApiResponse = {
      success: true,
      message: "Low stock products retrieved successfully",
      data: lowStockProducts,
    };

    res.status(200).json(response);
  }
);

// Get stock movement analytics
export const getStockMovementAnalytics = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { days = "30" } = req.query;

    const [movements] = await pool.query<RowDataPacket[]>(
      `
    SELECT 
      DATE(timestamp) as date,
      movement_type,
      SUM(ABS(quantity_change)) as total_quantity
    FROM stock_ledger
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE(timestamp), movement_type
    ORDER BY date DESC, movement_type
  `,
      [days]
    );

    const response: ApiResponse = {
      success: true,
      message: "Stock movement analytics retrieved successfully",
      data: movements,
    };

    res.status(200).json(response);
  }
);
