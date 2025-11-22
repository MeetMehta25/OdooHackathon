import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard routes
router.get("/kpis", dashboardController.getDashboardKPIs);
router.get("/activities", dashboardController.getRecentActivities);
router.get("/stock-summary", dashboardController.getStockSummaryByWarehouse);
router.get("/low-stock", dashboardController.getLowStockProducts);
router.get("/stock-movements", dashboardController.getStockMovementAnalytics);

export default router;
