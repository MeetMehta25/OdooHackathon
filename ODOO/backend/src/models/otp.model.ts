import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { generateUUID } from "../utils/uuid";

export interface OTPRecord {
  id: string;
  user_id: string;
  otp_hash: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

export class OTPModel {
  // Create OTP record
  static async create(
    user_id: string,
    otp_hash: string,
    expires_at: Date
  ): Promise<string> {
    const id = generateUUID();
    const query = `
      INSERT INTO otps (id, user_id, otp_hash, expires_at, is_used)
      VALUES (?, ?, ?, ?, false)
    `;
    await pool.execute<ResultSetHeader>(query, [
      id,
      user_id,
      otp_hash,
      expires_at,
    ]);
    return id;
  }

  // Find active OTP by user ID
  static async findActiveByUserId(user_id: string): Promise<OTPRecord | null> {
    const query = `
      SELECT * FROM otps 
      WHERE user_id = ? 
      AND is_used = false 
      AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(query, [user_id]);
    return rows.length > 0 ? (rows[0] as OTPRecord) : null;
  }

  // Mark OTP as used
  static async markAsUsed(id: string): Promise<boolean> {
    const query = `UPDATE otps SET is_used = true WHERE id = ?`;
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  // Invalidate all OTPs for a user
  static async invalidateUserOTPs(user_id: string): Promise<boolean> {
    const query = `UPDATE otps SET is_used = true WHERE user_id = ? AND is_used = false`;
    const [result] = await pool.execute<ResultSetHeader>(query, [user_id]);
    return result.affectedRows > 0;
  }
}

