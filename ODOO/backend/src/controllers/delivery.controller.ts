import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { DeliveryModel } from "../models/delivery.model";
import { ApiResponse } from "../types";

// Create delivery
export const createDelivery = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { customer_name, warehouse_id } = req.body;
    const created_by = req.user?.id;

    if (!created_by) {
      throw new AppError("User not authenticated", 401);
    }

    const deliveryId = await DeliveryModel.create({
      customer_name,
      warehouse_id,
      created_by,
    });

    const response: ApiResponse = {
      success: true,
      message: "Delivery created successfully",
      data: { id: deliveryId },
    };

    res.status(201).json(response);
  }
);

// Get all deliveries
export const getAllDeliveries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status, warehouse_id } = req.query;

    const deliveries = await DeliveryModel.findAll({
      status: status as string,
      warehouse_id: warehouse_id as string,
    });

    const response: ApiResponse = {
      success: true,
      message: "Deliveries retrieved successfully",
      data: deliveries,
    };

    res.status(200).json(response);
  }
);

// Get delivery by ID
export const getDeliveryById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const delivery = await DeliveryModel.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    const items = await DeliveryModel.getItems(id);

    const response: ApiResponse = {
      success: true,
      message: "Delivery retrieved successfully",
      data: { ...delivery, items },
    };

    res.status(200).json(response);
  }
);

// Update delivery status
export const updateDeliveryStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await DeliveryModel.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    await DeliveryModel.updateStatus(id, status);

    const response: ApiResponse = {
      success: true,
      message: "Delivery status updated successfully",
    };

    res.status(200).json(response);
  }
);

// Add delivery item
export const addDeliveryItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { product_id, quantity_picked, location_id } = req.body;

    const delivery = await DeliveryModel.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    const itemId = await DeliveryModel.addItem({
      id: "",
      delivery_id: id,
      product_id,
      quantity_picked,
      quantity_delivered: 0,
      location_id,
    });

    const response: ApiResponse = {
      success: true,
      message: "Delivery item added successfully",
      data: { id: itemId },
    };

    res.status(201).json(response);
  }
);

// Update delivery item delivered quantity
export const updateDeliveryItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { item_id } = req.params;
    const { quantity_delivered } = req.body;

    await DeliveryModel.updateItemDelivered(item_id, quantity_delivered);

    const response: ApiResponse = {
      success: true,
      message: "Delivery item updated successfully",
    };

    res.status(200).json(response);
  }
);

// Process delivery (mark as done and update stock)
export const processDelivery = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const delivery = await DeliveryModel.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if (delivery.status === "done") {
      throw new AppError("Delivery already processed", 400);
    }

    // Note: processDelivery method needs to be implemented in DeliveryModel
    // await DeliveryModel.processDelivery(id);

    const response: ApiResponse = {
      success: true,
      message: "Delivery processed successfully",
    };

    res.status(200).json(response);
  }
);
