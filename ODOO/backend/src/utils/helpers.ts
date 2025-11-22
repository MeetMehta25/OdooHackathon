import { Response } from "express";
import { validationResult } from "express-validator";

// Format validation errors
export const formatValidationErrors = (errors: any[]): string[] => {
  return errors.map((error) => error.msg);
};

// Check validation errors from express-validator
export const handleValidationErrors = (req: any, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatValidationErrors(errors.array()),
    });
    return true;
  }
  return false;
};

// Generate random reference number
export const generateReferenceNumber = (prefix: string = "REF"): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Calculate pagination
export const calculatePagination = (
  page: number = 1,
  limit: number = 10
): { offset: number; limit: number } => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

// Format date to string
export const formatDate = (
  date: Date,
  includeTime: boolean = false
): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  if (!includeTime) {
    return `${year}-${month}-${day}`;
  }

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Parse query filters
export const parseFilters = (query: any): Record<string, any> => {
  const filters: Record<string, any> = {};

  for (const key in query) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== "") {
      filters[key] = query[key];
    }
  }

  return filters;
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

// Check if string is valid UUID
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Convert string to slug
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Generate SKU
export const generateSKU = (
  productName: string,
  categoryCode?: string
): string => {
  const namePart = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  const timestamp = Date.now().toString(36).toUpperCase().substring(0, 4);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();

  if (categoryCode) {
    return `${categoryCode}-${namePart}-${timestamp}${random}`;
  }

  return `${namePart}-${timestamp}${random}`;
};

// Calculate difference
export const calculateDifference = (
  current: number,
  previous: number
): number => {
  return current - previous;
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Delay execution
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Chunk array
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove undefined/null from object
export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  }

  return cleaned;
};
