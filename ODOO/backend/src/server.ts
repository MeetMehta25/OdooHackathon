import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import config from "./config/config";
import { testConnection } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import AppError from "./middleware/errorHandler";

// Import routes
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import receiptRoutes from "./routes/receipt.routes";
import deliveryRoutes from "./routes/delivery.routes";
import transferRoutes from "./routes/transfer.routes";
import adjustmentRoutes from "./routes/adjustment.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: config.corsOrigin, credentials: true })); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Logging

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "ODOO Warehouse Management API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/api/users",
      products: "/api/products",
      warehouses: "/api/warehouses",
      receipts: "/api/receipts",
      deliveries: "/api/deliveries",
      transfers: "/api/transfers",
      adjustments: "/api/adjustments",
      dashboard: "/api/dashboard",
    },
  });
});

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Favicon handler (prevents 404 warnings)
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.status(204).end();
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/adjustments", adjustmentRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.all("*", (req: Request, _res: Response) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
