// models/category.model.ts
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export class CategoryModel {
  static async create(data: { name: string; description?: string }): Promise<string> {
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, data.name, data.description]
    );
    
    return id;
  }

  static async findById(id: string): Promise<Category | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Category) : null;
  }

  static async findAll(): Promise<Category[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories ORDER BY name'
    );
    return rows as Category[];
  }

  static async update(id: string, data: { name: string; description?: string }): Promise<void> {
    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [data.name, data.description, id]
    );
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  }
}