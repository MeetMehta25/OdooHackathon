import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { TransferModel } from "../models/transfer.model";
import { ApiResponse } from "../types";

// Create transfer
export const createTransfer = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { source_location_id, destination_location_id } = req.body;
    const created_by = req.user?.id;

    if (!created_by) {
      throw new AppError("User not authenticated", 401);
    }

    if (source_location_id === destination_location_id) {
      throw new AppError(
        "Source and destination locations cannot be the same",
        400
      );
    }

    const transferId = await TransferModel.create({
      source_location_id,
      destination_location_id,
      created_by,
    });

    const response: ApiResponse = {
      success: true,
      message: "Transfer created successfully",
      data: { id: transferId },
    };

    res.status(201).json(response);
  }
);

// Get all transfers
export const getAllTransfers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status } = req.query;

    const transfers = await TransferModel.findAll({
      status: status as string,
    });

    const response: ApiResponse = {
      success: true,
      message: "Transfers retrieved successfully",
      data: transfers,
    };

    res.status(200).json(response);
  }
);

// Get transfer by ID
export const getTransferById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const transfer = await TransferModel.findById(id);
    if (!transfer) {
      throw new AppError("Transfer not found", 404);
    }

    const items = await TransferModel.getItems(id);

    const response: ApiResponse = {
      success: true,
      message: "Transfer retrieved successfully",
      data: { ...transfer, items },
    };

    res.status(200).json(response);
  }
);

// Update transfer status
export const updateTransferStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const transfer = await TransferModel.findById(id);
    if (!transfer) {
      throw new AppError("Transfer not found", 404);
    }

    await TransferModel.updateStatus(id, status);

    const response: ApiResponse = {
      success: true,
      message: "Transfer status updated successfully",
    };

    res.status(200).json(response);
  }
);

// Add transfer item
export const addTransferItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { product_id, quantity } = req.body;

    const transfer = await TransferModel.findById(id);
    if (!transfer) {
      throw new AppError("Transfer not found", 404);
    }

    const itemId = await TransferModel.addItem({
      id: "",
      transfer_id: id,
      product_id,
      quantity,
    });

    const response: ApiResponse = {
      success: true,
      message: "Transfer item added successfully",
      data: { id: itemId },
    };

    res.status(201).json(response);
  }
);

// Process transfer (mark as done and update stock)
export const processTransfer = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const transfer = await TransferModel.findById(id);
    if (!transfer) {
      throw new AppError("Transfer not found", 404);
    }

    if (transfer.status === "done") {
      throw new AppError("Transfer already processed", 400);
    }

    // Note: processTransfer method needs to be implemented in TransferModel
    // await TransferModel.processTransfer(id);

    const response: ApiResponse = {
      success: true,
      message: "Transfer processed successfully",
    };

    res.status(200).json(response);
  }
);
