import pool from "../config/database";
import { User, UserResponse } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { generateUUID } from "../utils/uuid";

export class UserModel {
  static async create(
    full_name: string,
    email: string,
    password_hash: string,
    role: string
  ): Promise<string> {
    const id = generateUUID();
    const query = `
      INSERT INTO users (id, full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.execute<ResultSetHeader>(query, [
      id,
      full_name,
      email,
      password_hash,
      role,
    ]);
    return id;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findById(id: string): Promise<UserResponse | null> {
    const query =
      "SELECT id, full_name, email, role, created_at, updated_at FROM users WHERE id = ?";
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? (rows[0] as UserResponse) : null;
  }

  static async findAll(): Promise<UserResponse[]> {
    const query =
      "SELECT id, full_name, email, role, created_at, updated_at FROM users";
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    return rows as UserResponse[];
  }

  static async update(
    id: string,
    full_name?: string,
    email?: string
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (full_name) {
      updates.push("full_name = ?");
      values.push(full_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }

    if (updates.length === 0) return false;

    values.push(id);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    const [result] = await pool.execute<ResultSetHeader>(query, values);
    return result.affectedRows > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }
}
