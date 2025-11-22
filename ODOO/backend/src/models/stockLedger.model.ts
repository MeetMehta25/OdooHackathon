// models/stockLedger.model.ts
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface StockLedgerEntry {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id?: string;
  quantity_change: number;
  movement_type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  document_id: string;
  before_quantity: number;
  after_quantity: number;
  timestamp: Date;
}

export class StockLedgerModel {
  static async createEntry(data: {
    product_id: string;
    warehouse_id: string;
    location_id?: string;
    quantity_change: number;
    movement_type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
    document_id: string;
    before_quantity: number;
    after_quantity: number;
  }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      `INSERT INTO stock_ledger (id, product_id, warehouse_id, location_id, quantity_change, movement_type, document_id, before_quantity, after_quantity, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, data.product_id, data.warehouse_id, data.location_id, data.quantity_change, data.movement_type, data.document_id, data.before_quantity, data.after_quantity]
    );
    
    return id;
  }

  static async getByProduct(productId: string, movementType?: string): Promise<StockLedgerEntry[]> {
    let query = `SELECT sl.*, p.name as product_name, w.name as warehouse_name, l.name as location_name
                 FROM stock_ledger sl
                 JOIN products p ON sl.product_id = p.id
                 JOIN warehouses w ON sl.warehouse_id = w.id
                 LEFT JOIN locations l ON sl.location_id = l.id
                 WHERE sl.product_id = ?`;
    const params: any[] = [productId];

    if (movementType) {
      query += ' AND sl.movement_type = ?';
      params.push(movementType);
    }

    query += ' ORDER BY sl.timestamp DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as StockLedgerEntry[];
  }

  static async updateStock(
    productId: string,
    warehouseId: string,
    locationId: string | null,
    quantityChange: number
  ): Promise<{ before: number; after: number }> {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT quantity FROM product_stock WHERE product_id = ? AND warehouse_id = ? AND location_id = ?',
      [productId, warehouseId, locationId]
    );

    if (existing.length > 0) {
      const beforeQty = parseFloat(existing[0].quantity);
      const afterQty = beforeQty + quantityChange;
      
      await pool.query(
        'UPDATE product_stock SET quantity = ? WHERE product_id = ? AND warehouse_id = ? AND location_id = ?',
        [afterQty, productId, warehouseId, locationId]
      );
      
      return { before: beforeQty, after: afterQty };
    } else {
      const id = uuidv4();
      await pool.query(
        'INSERT INTO product_stock (id, product_id, warehouse_id, location_id, quantity) VALUES (?, ?, ?, ?, ?)',
        [id, productId, warehouseId, locationId, quantityChange]
      );
      
      return { before: 0, after: quantityChange };
    }
  }

  static async getHistory(filters: {
    product_id?: string;
    warehouse_id?: string;
    movement_type?: string;
  }): Promise<StockLedgerEntry[]> {
    let query = `SELECT sl.*, p.name as product_name, p.sku, w.name as warehouse_name, l.name as location_name
                 FROM stock_ledger sl
                 JOIN products p ON sl.product_id = p.id
                 JOIN warehouses w ON sl.warehouse_id = w.id
                 LEFT JOIN locations l ON sl.location_id = l.id
                 WHERE 1=1`;
    const params: any[] = [];

    if (filters.product_id) {
      query += ' AND sl.product_id = ?';
      params.push(filters.product_id);
    }

    if (filters.warehouse_id) {
      query += ' AND sl.warehouse_id = ?';
      params.push(filters.warehouse_id);
    }

    if (filters.movement_type) {
      query += ' AND sl.movement_type = ?';
      params.push(filters.movement_type);
    }

    query += ' ORDER BY sl.timestamp DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as StockLedgerEntry[];
  }
}

