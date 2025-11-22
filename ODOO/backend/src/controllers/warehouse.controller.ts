import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { WarehouseModel } from "../models/warehouse.model";
import { ApiResponse } from "../types";

// Create warehouse
export const createWarehouse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, address } = req.body;

    const warehouseId = await WarehouseModel.create({ name, address });

    const response: ApiResponse = {
      success: true,
      message: "Warehouse created successfully",
      data: { id: warehouseId },
    };

    res.status(201).json(response);
  }
);

// Get all warehouses
export const getAllWarehouses = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const warehouses = await WarehouseModel.findAll();

    const response: ApiResponse = {
      success: true,
      message: "Warehouses retrieved successfully",
      data: warehouses,
    };

    res.status(200).json(response);
  }
);

// Get warehouse by ID
export const getWarehouseById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const warehouse = await WarehouseModel.findById(id);
    if (!warehouse) {
      throw new AppError("Warehouse not found", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Warehouse retrieved successfully",
      data: warehouse,
    };

    res.status(200).json(response);
  }
);

// Update warehouse
export const updateWarehouse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, address } = req.body;

    const warehouse = await WarehouseModel.findById(id);
    if (!warehouse) {
      throw new AppError("Warehouse not found", 404);
    }

    await WarehouseModel.update(id, { name, address });

    const response: ApiResponse = {
      success: true,
      message: "Warehouse updated successfully",
    };

    res.status(200).json(response);
  }
);

// Create location
export const createLocation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { warehouse_id, name } = req.body;

    const warehouse = await WarehouseModel.findById(warehouse_id);
    if (!warehouse) {
      throw new AppError("Warehouse not found", 404);
    }

    const locationId = await WarehouseModel.createLocation({
      warehouse_id,
      name,
    });

    const response: ApiResponse = {
      success: true,
      message: "Location created successfully",
      data: { id: locationId },
    };

    res.status(201).json(response);
  }
);

// Get locations by warehouse
export const getLocationsByWarehouse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { warehouse_id } = req.params;

    const locations = await WarehouseModel.findAllLocations(warehouse_id);

    const response: ApiResponse = {
      success: true,
      message: "Locations retrieved successfully",
      data: locations,
    };

    res.status(200).json(response);
  }
);

// Get all locations
export const getAllLocations = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const locations = await WarehouseModel.findAllLocations();

    const response: ApiResponse = {
      success: true,
      message: "Locations retrieved successfully",
      data: locations,
    };

    res.status(200).json(response);
  }
);
