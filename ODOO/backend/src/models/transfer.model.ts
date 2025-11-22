import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface Transfer {
  id: string;
  reference_no: string;
  source_location_id: string;
  destination_location_id: string;
  status: 'draft' | 'pending' | 'ready' | 'done' | 'canceled';
  created_by: string;
  created_at: Date;
}

export interface TransferItem {
  id: string;
  transfer_id: string;
  product_id: string;
  quantity: number;
}

export class TransferModel {
  static async create(data: {
    source_location_id: string;
    destination_location_id: string;
    created_by: string;
  }): Promise<string> {
    const id = uuidv4();
    const reference_no = `TRF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    await pool.query(
      'INSERT INTO internal_transfers (id, reference_no, source_location_id, destination_location_id, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, reference_no, data.source_location_id, data.destination_location_id, 'draft', data.created_by]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Transfer | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM internal_transfers WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Transfer) : null;
  }

  static async findAll(filters: { status?: string }): Promise<Transfer[]> {
    let query = `SELECT it.*, u.full_name as created_by_name,
                 sl.name as source_location_name, sw.name as source_warehouse_name,
                 dl.name as destination_location_name, dw.name as destination_warehouse_name
                 FROM internal_transfers it 
                 JOIN users u ON it.created_by = u.id
                 JOIN locations sl ON it.source_location_id = sl.id
                 JOIN warehouses sw ON sl.warehouse_id = sw.id
                 JOIN locations dl ON it.destination_location_id = dl.id
                 JOIN warehouses dw ON dl.warehouse_id = dw.id
                 WHERE 1=1`;
    const params: any[] = [];

    if (filters.status) {
      query += ' AND it.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY it.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Transfer[];
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await pool.query('UPDATE internal_transfers SET status = ? WHERE id = ?', [status, id]);
  }

  static async addItem(data: TransferItem): Promise<string> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO transfer_items (id, transfer_id, product_id, quantity) VALUES (?, ?, ?, ?)',
      [id, data.transfer_id, data.product_id, data.quantity]
    );
    return id;
  }

  static async getItems(transferId: string): Promise<TransferItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT ti.*, p.name as product_name, p.sku, p.uom FROM transfer_items ti JOIN products p ON ti.product_id = p.id WHERE ti.transfer_id = ?',
      [transferId]
    );
    return rows as TransferItem[];
  }
}

