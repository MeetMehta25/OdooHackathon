import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category_id?: string;
  uom: string;
  reorder_level: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductStock {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id?: string;
  quantity: number;
}

export class ProductModel {
  static async create(data: {
    name: string;
    description?: string;
    sku: string;
    category_id?: string;
    uom: string;
    reorder_level?: number;
  }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO products (id, name, description, sku, category_id, uom, reorder_level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, data.name, data.description, data.sku, data.category_id, data.uom, data.reorder_level || 0]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Product) : null;
  }

  static async findBySku(sku: string): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE sku = ?',
      [sku]
    );
    return rows.length > 0 ? (rows[0] as Product) : null;
  }

  static async findAll(filters: {
    category_id?: string;
    search?: string;
  }): Promise<Product[]> {
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params: any[] = [];

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Product[];
  }

  static async update(id: string, data: Partial<Product>): Promise<void> {
    await pool.query(
      'UPDATE products SET name = ?, description = ?, category_id = ?, uom = ?, reorder_level = ?, updated_at = NOW() WHERE id = ?',
      [data.name, data.description, data.category_id, data.uom, data.reorder_level, id]
    );
  }

  static async getStock(productId: string): Promise<ProductStock[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ps.*, w.name as warehouse_name, l.name as location_name 
       FROM product_stock ps
       JOIN warehouses w ON ps.warehouse_id = w.id
       LEFT JOIN locations l ON ps.location_id = l.id
       WHERE ps.product_id = ?`,
      [productId]
    );
    return rows as ProductStock[];
  }

  static async getStockAtLocation(
    productId: string,
    warehouseId: string,
    locationId: string | null
  ): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT quantity FROM product_stock WHERE product_id = ? AND warehouse_id = ? AND location_id = ?',
      [productId, warehouseId, locationId]
    );
    return rows.length > 0 ? rows[0].quantity : 0;
  }
}

