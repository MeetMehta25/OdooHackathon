import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler';
import AppError from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import * as userModel from '../models/user.model';
import config from '../config/config';
import { ApiResponse } from '../types';

// Register new user
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const userId = await userModel.create({
    email,
    password: hashedPassword,
    name,
  });

  // Generate JWT token
  const token = jwt.sign({ id: userId, email }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

  const response: ApiResponse = {
    success: true,
    message: 'User registered successfully',
    data: {
      id: userId,
      email,
      name,
      token,
    },
  };

  res.status(201).json(response);
});

// Login user
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Login successful',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    },
  };

  res.status(200).json(response);
});

// Get user profile
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
  };

  res.status(200).json(response);
});

// Get all users
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await userModel.findAll();

  const response: ApiResponse = {
    success: true,
    message: 'Users retrieved successfully',
    data: users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    })),
  };

  res.status(200).json(response);
});

// Get user by ID
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await userModel.findById(parseInt(id));

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'User retrieved successfully',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
  };

  res.status(200).json(response);
});

// Update user
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await userModel.findById(parseInt(id));
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await userModel.update(parseInt(id), { name, email });

  const response: ApiResponse = {
    success: true,
    message: 'User updated successfully',
  };

  res.status(200).json(response);
});

// Delete user
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await userModel.findById(parseInt(id));
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await userModel.deleteById(parseInt(id));

  const response: ApiResponse = {
    success: true,
    message: 'User deleted successfully',
  };

  res.status(200).json(response);
});
