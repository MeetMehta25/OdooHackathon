import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';

export interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

// Create new user
export const create = async (userData: CreateUserData): Promise<number> => {
  const { email, password, name } = userData;
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name]
  );
  return result.insertId;
};

// Find user by email
export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Find user by ID
export const findById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Get all users
export const findAll = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    'SELECT id, email, name, created_at, updated_at FROM users'
  );
  return rows;
};

// Update user
export const update = async (
  id: number,
  userData: UpdateUserData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: any[] = [];

  if (userData.email) {
    fields.push('email = ?');
    values.push(userData.email);
  }

  if (userData.name) {
    fields.push('name = ?');
    values.push(userData.name);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

// Delete user
export const deleteById = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};
