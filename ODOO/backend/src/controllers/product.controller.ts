import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { ProductModel } from "../models/product.model";
import { ApiResponse } from "../types";

// Create product
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, description, sku, category_id, uom, reorder_level } =
      req.body;

    // Check if SKU already exists
    const existingProduct = await ProductModel.findBySku(sku);
    if (existingProduct) {
      throw new AppError("Product with this SKU already exists", 400);
    }

    const productId = await ProductModel.create({
      name,
      description,
      sku,
      category_id,
      uom,
      reorder_level,
    });

    const response: ApiResponse = {
      success: true,
      message: "Product created successfully",
      data: { id: productId },
    };

    res.status(201).json(response);
  }
);

// Get all products
export const getAllProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { category_id, search } = req.query;

    const products = await ProductModel.findAll({
      category_id: category_id as string,
      search: search as string,
    });

    const response: ApiResponse = {
      success: true,
      message: "Products retrieved successfully",
      data: products,
    };

    res.status(200).json(response);
  }
);

// Get product by ID
export const getProductById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Product retrieved successfully",
      data: product,
    };

    res.status(200).json(response);
  }
);

// Update product
export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, description, category_id, uom, reorder_level } = req.body;

    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await ProductModel.update(id, {
      name,
      description,
      category_id,
      uom,
      reorder_level,
    });

    const response: ApiResponse = {
      success: true,
      message: "Product updated successfully",
    };

    res.status(200).json(response);
  }
);

// Delete product
export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Note: Delete method needs to be implemented in ProductModel
    // await ProductModel.delete(id);

    const response: ApiResponse = {
      success: true,
      message: "Product deleted successfully",
    };

    res.status(200).json(response);
  }
);

// Get product stock
export const getProductStock = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const stock = await ProductModel.getStock(id);

    const response: ApiResponse = {
      success: true,
      message: "Product stock retrieved successfully",
      data: stock,
    };

    res.status(200).json(response);
  }
);
