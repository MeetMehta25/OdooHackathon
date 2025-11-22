import { Router } from "express";
import { body, param } from "express-validator";
import * as adjustmentController from "../controllers/adjustment.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createAdjustmentValidation = [
  body("product_id").isUUID().withMessage("Valid product ID is required"),
  body("location_id").isUUID().withMessage("Valid location ID is required"),
  body("counted_quantity")
    .isFloat({ min: 0 })
    .withMessage("Counted quantity must be non-negative"),
  body("previous_quantity")
    .isFloat({ min: 0 })
    .withMessage("Previous quantity must be non-negative"),
  body("reason").notEmpty().withMessage("Reason is required"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid adjustment ID"),
];

// All routes require authentication
router.use(authenticate);

// Adjustment routes
router.post(
  "/",
  validate(createAdjustmentValidation),
  adjustmentController.createAdjustment
);
router.get("/", adjustmentController.getAllAdjustments);
router.get(
  "/:id",
  validate(idParamValidation),
  adjustmentController.getAdjustmentById
);

export default router;
