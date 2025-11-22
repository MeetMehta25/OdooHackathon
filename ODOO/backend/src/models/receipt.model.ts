import pool from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2";

export interface Receipt {
  id: string;
  supplier_name: string;
  reference_no: string;
  status: "draft" | "pending" | "ready" | "done" | "canceled";
  warehouse_id: string;
  created_by: string;
  created_at: Date;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  product_id: string;
  quantity_expected: number;
  quantity_received: number;
  location_id: string | null;
}

export class ReceiptModel {
  static async create(data: {
    supplier_name: string;
    warehouse_id: string;
    created_by: string;
  }): Promise<string> {
    const id = uuidv4();
    const reference_no = `RCP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await pool.query(
      "INSERT INTO receipts (id, supplier_name, reference_no, status, warehouse_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        id,
        data.supplier_name,
        reference_no,
        "draft",
        data.warehouse_id,
        data.created_by,
      ]
    );

    return id;
  }

  static async findById(id: string): Promise<Receipt | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM receipts WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? (rows[0] as Receipt) : null;
  }

  static async findAll(filters: {
    status?: string;
    warehouse_id?: string;
  }): Promise<Receipt[]> {
    let query =
      "SELECT r.*, u.full_name as created_by_name, w.name as warehouse_name FROM receipts r JOIN users u ON r.created_by = u.id JOIN warehouses w ON r.warehouse_id = w.id WHERE 1=1";
    const params: any[] = [];

    if (filters.status) {
      query += " AND r.status = ?";
      params.push(filters.status);
    }

    if (filters.warehouse_id) {
      query += " AND r.warehouse_id = ?";
      params.push(filters.warehouse_id);
    }

    query += " ORDER BY r.created_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Receipt[];
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await pool.query("UPDATE receipts SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }

  static async addItem(data: ReceiptItem): Promise<string> {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO receipt_items (id, receipt_id, product_id, quantity_expected, quantity_received, location_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        data.receipt_id,
        data.product_id,
        data.quantity_expected,
        0,
        data.location_id,
      ]
    );
    return id;
  }

  static async getItems(receiptId: string): Promise<ReceiptItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT ri.*, p.name as product_name, p.sku, p.uom FROM receipt_items ri JOIN products p ON ri.product_id = p.id WHERE ri.receipt_id = ?",
      [receiptId]
    );
    return rows as ReceiptItem[];
  }

  static async updateItemReceived(
    itemId: string,
    quantity: number
  ): Promise<void> {
    await pool.query(
      "UPDATE receipt_items SET quantity_received = ? WHERE id = ?",
      [quantity, itemId]
    );
  }
}
