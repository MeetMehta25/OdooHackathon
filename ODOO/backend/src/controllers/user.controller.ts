import { Response } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../middleware/errorHandler";
import AppError from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { ApiResponse, UserRole } from "../types";

// Register new user
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, password, full_name, role } = req.body;

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      throw new AppError("Invalid role specified", 400);
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await UserModel.create(
      full_name,
      email,
      hashedPassword,
      role
    );

    // Generate JWT token
    const token = generateToken({ id: userId, email, role });
    const response: ApiResponse = {
      success: true,
      message: "User registered successfully",
      data: {
        id: userId,
        email,
        full_name,
        role,
        token,
      },
    };

    res.status(201).json(response);
  }
);

// Login user
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const response: ApiResponse = {
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token,
    },
  };

  res.status(200).json(response);
});

// Get user profile
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    };

    res.status(200).json(response);
  }
);

// Get all users
export const getAllUsers = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const users = await UserModel.findAll();

    const response: ApiResponse = {
      success: true,
      message: "Users retrieved successfully",
      data: users,
    };

    res.status(200).json(response);
  }
);

// Get user by ID
export const getUserById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response: ApiResponse = {
      success: true,
      message: "User retrieved successfully",
      data: user,
    };

    res.status(200).json(response);
  }
);

// Update user
export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { full_name, email } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updated = await UserModel.update(id, full_name, email);

    if (!updated) {
      throw new AppError("No changes made", 400);
    }

    const response: ApiResponse = {
      success: true,
      message: "User updated successfully",
    };

    res.status(200).json(response);
  }
);

// Delete user
export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await UserModel.delete(id);

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };

    res.status(200).json(response);
  }
);
