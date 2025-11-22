import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface Delivery {
  id: string;
  customer_name: string;
  reference_no: string;
  status: 'draft' | 'pending' | 'ready' | 'done' | 'canceled';
  warehouse_id: string;
  created_by: string;
  created_at: Date;
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  product_id: string;
  quantity_picked: number;
  quantity_delivered: number;
  location_id: string | null;
}

export class DeliveryModel {
  static async create(data: {
    customer_name: string;
    warehouse_id: string;
    created_by: string;
  }): Promise<string> {
    const id = uuidv4();
    const reference_no = `DEL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    await pool.query(
      'INSERT INTO deliveries (id, customer_name, reference_no, status, warehouse_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, data.customer_name, reference_no, 'draft', data.warehouse_id, data.created_by]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Delivery | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM deliveries WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Delivery) : null;
  }

  static async findAll(filters: {
    status?: string;
    warehouse_id?: string;
  }): Promise<Delivery[]> {
    let query = 'SELECT d.*, u.full_name as created_by_name, w.name as warehouse_name FROM deliveries d JOIN users u ON d.created_by = u.id JOIN warehouses w ON d.warehouse_id = w.id WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      query += ' AND d.status = ?';
      params.push(filters.status);
    }

    if (filters.warehouse_id) {
      query += ' AND d.warehouse_id = ?';
      params.push(filters.warehouse_id);
    }

    query += ' ORDER BY d.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Delivery[];
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    await pool.query('UPDATE deliveries SET status = ? WHERE id = ?', [status, id]);
  }

  static async addItem(data: DeliveryItem): Promise<string> {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO delivery_items (id, delivery_id, product_id, quantity_picked, quantity_delivered, location_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.delivery_id, data.product_id, 0, 0, data.location_id]
    );
    return id;
  }

  static async getItems(deliveryId: string): Promise<DeliveryItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT di.*, p.name as product_name, p.sku, p.uom FROM delivery_items di JOIN products p ON di.product_id = p.id WHERE di.delivery_id = ?',
      [deliveryId]
    );
    return rows as DeliveryItem[];
  }

  static async updateItemPicked(itemId: string, quantity: number): Promise<void> {
    await pool.query('UPDATE delivery_items SET quantity_picked = ? WHERE id = ?', [quantity, itemId]);
  }

  static async updateItemDelivered(itemId: string, quantity: number): Promise<void> {
    await pool.query('UPDATE delivery_items SET quantity_delivered = ? WHERE id = ?', [quantity, itemId]);
  }
}