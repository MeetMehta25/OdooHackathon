import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface Adjustment {
  id: string;
  product_id: string;
  location_id: string;
  counted_quantity: number;
  previous_quantity: number;
  difference: number;
  reason: string;
  created_by: string;
  created_at: Date;
}

export class AdjustmentModel {
  static async create(data: {
    product_id: string;
    location_id: string;
    counted_quantity: number;
    previous_quantity: number;
    difference: number;
    reason: string;
    created_by: string;
  }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO stock_adjustments (id, product_id, location_id, counted_quantity, previous_quantity, difference, reason, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, data.product_id, data.location_id, data.counted_quantity, data.previous_quantity, data.difference, data.reason, data.created_by]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Adjustment | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM stock_adjustments WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Adjustment) : null;
  }

  static async findAll(filters: {
    product_id?: string;
    location_id?: string;
  }): Promise<Adjustment[]> {
    let query = `SELECT sa.*, p.name as product_name, p.sku, l.name as location_name, w.name as warehouse_name, u.full_name as created_by_name
                 FROM stock_adjustments sa
                 JOIN products p ON sa.product_id = p.id
                 JOIN locations l ON sa.location_id = l.id
                 JOIN warehouses w ON l.warehouse_id = w.id
                 JOIN users u ON sa.created_by = u.id
                 WHERE 1=1`;
    const params: any[] = [];

    if (filters.product_id) {
      query += ' AND sa.product_id = ?';
      params.push(filters.product_id);
    }

    if (filters.location_id) {
      query += ' AND sa.location_id = ?';
      params.push(filters.location_id);
    }

    query += ' ORDER BY sa.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Adjustment[];
  }
}