import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

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

export class WarehouseModel {
  static async create(data: { name: string; address?: string }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO warehouses (id, name, address, created_at) VALUES (?, ?, ?, NOW())',
      [id, data.name, data.address]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Warehouse | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM warehouses WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Warehouse) : null;
  }

  static async findAll(): Promise<Warehouse[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM warehouses ORDER BY name'
    );
    return rows as Warehouse[];
  }

  static async update(id: string, data: { name: string; address?: string }): Promise<void> {
    await pool.query(
      'UPDATE warehouses SET name = ?, address = ? WHERE id = ?',
      [data.name, data.address, id]
    );
  }

  static async createLocation(data: { warehouse_id: string; name: string }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO locations (id, warehouse_id, name) VALUES (?, ?, ?)',
      [id, data.warehouse_id, data.name]
    );
    
    return id;
  }

  static async findLocationById(id: string): Promise<Location | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT l.*, w.name as warehouse_name FROM locations l JOIN warehouses w ON l.warehouse_id = w.id WHERE l.id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Location) : null;
  }

  static async findAllLocations(warehouseId?: string): Promise<Location[]> {
    let query = 'SELECT l.*, w.name as warehouse_name FROM locations l JOIN warehouses w ON l.warehouse_id = w.id';
    const params: any[] = [];

    if (warehouseId) {
      query += ' WHERE l.warehouse_id = ?';
      params.push(warehouseId);
    }

    query += ' ORDER BY w.name, l.name';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Location[];
  }

  static async updateLocation(id: string, name: string): Promise<void> {
    await pool.query('UPDATE locations SET name = ? WHERE id = ?', [name, id]);
  }
}

