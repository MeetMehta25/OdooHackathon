import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { ReceiptModel } from "../models/receipt.model";
import { ApiResponse } from "../types";

// Create receipt
export const createReceipt = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { supplier_name, warehouse_id } = req.body;
    const created_by = req.user?.id;

    if (!created_by) {
      throw new AppError("User not authenticated", 401);
    }

    const receiptId = await ReceiptModel.create({
      supplier_name,
      warehouse_id,
      created_by,
    });

    const response: ApiResponse = {
      success: true,
      message: "Receipt created successfully",
      data: { id: receiptId },
    };

    res.status(201).json(response);
  }
);

// Get all receipts
export const getAllReceipts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status, warehouse_id } = req.query;

    const receipts = await ReceiptModel.findAll({
      status: status as string,
      warehouse_id: warehouse_id as string,
    });

    const response: ApiResponse = {
      success: true,
      message: "Receipts retrieved successfully",
      data: receipts,
    };

    res.status(200).json(response);
  }
);

// Get receipt by ID
export const getReceiptById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const receipt = await ReceiptModel.findById(id);
    if (!receipt) {
      throw new AppError("Receipt not found", 404);
    }

    const items = await ReceiptModel.getItems(id);

    const response: ApiResponse = {
      success: true,
      message: "Receipt retrieved successfully",
      data: { ...receipt, items },
    };

    res.status(200).json(response);
  }
);

// Update receipt status
export const updateReceiptStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const receipt = await ReceiptModel.findById(id);
    if (!receipt) {
      throw new AppError("Receipt not found", 404);
    }

    await ReceiptModel.updateStatus(id, status);

    const response: ApiResponse = {
      success: true,
      message: "Receipt status updated successfully",
    };

    res.status(200).json(response);
  }
);

// Add receipt item
export const addReceiptItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { product_id, quantity_expected, location_id } = req.body;

    const receipt = await ReceiptModel.findById(id);
    if (!receipt) {
      throw new AppError("Receipt not found", 404);
    }

    const itemId = await ReceiptModel.addItem({
      id: "",
      receipt_id: id,
      product_id,
      quantity_expected,
      quantity_received: 0,
      location_id,
    });

    const response: ApiResponse = {
      success: true,
      message: "Receipt item added successfully",
      data: { id: itemId },
    };

    res.status(201).json(response);
  }
);

// Update receipt item received quantity
export const updateReceiptItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { item_id } = req.params;
    const { quantity_received } = req.body;

    await ReceiptModel.updateItemReceived(item_id, quantity_received);

    const response: ApiResponse = {
      success: true,
      message: "Receipt item updated successfully",
    };

    res.status(200).json(response);
  }
);

// Process receipt (mark as done and update stock)
export const processReceipt = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const receipt = await ReceiptModel.findById(id);
    if (!receipt) {
      throw new AppError("Receipt not found", 404);
    }

    if (receipt.status === "done") {
      throw new AppError("Receipt already processed", 400);
    }

    // Note: processReceipt method needs to be implemented in ReceiptModel
    // await ReceiptModel.processReceipt(id);

    const response: ApiResponse = {
      success: true,
      message: "Receipt processed successfully",
    };

    res.status(200).json(response);
  }
);
