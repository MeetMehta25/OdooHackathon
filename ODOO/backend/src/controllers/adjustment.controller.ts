import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { AdjustmentModel } from "../models/adjustment.model";
import { ApiResponse } from "../types";

// Create adjustment
export const createAdjustment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      product_id,
      location_id,
      counted_quantity,
      previous_quantity,
      reason,
    } = req.body;
    const created_by = req.user?.id;

    if (!created_by) {
      throw new AppError("User not authenticated", 401);
    }

    const difference = counted_quantity - previous_quantity;

    const adjustmentId = await AdjustmentModel.create({
      product_id,
      location_id,
      counted_quantity,
      previous_quantity,
      difference,
      reason,
      created_by,
    });

    const response: ApiResponse = {
      success: true,
      message: "Stock adjustment created successfully",
      data: { id: adjustmentId, difference },
    };

    res.status(201).json(response);
  }
);

// Get all adjustments
export const getAllAdjustments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { product_id, location_id } = req.query;

    const adjustments = await AdjustmentModel.findAll({
      product_id: product_id as string,
      location_id: location_id as string,
    });

    const response: ApiResponse = {
      success: true,
      message: "Adjustments retrieved successfully",
      data: adjustments,
    };

    res.status(200).json(response);
  }
);

// Get adjustment by ID
export const getAdjustmentById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const adjustment = await AdjustmentModel.findById(id);
    if (!adjustment) {
      throw new AppError("Adjustment not found", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Adjustment retrieved successfully",
      data: adjustment,
    };

    res.status(200).json(response);
  }
);
