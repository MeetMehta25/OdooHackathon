import { Router } from "express";
import { body, param } from "express-validator";
import * as deliveryController from "../controllers/delivery.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createDeliveryValidation = [
  body("customer_name").notEmpty().withMessage("Customer name is required"),
  body("warehouse_id").isUUID().withMessage("Valid warehouse ID is required"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["draft", "pending", "ready", "done", "canceled"])
    .withMessage("Invalid status"),
];

const addItemValidation = [
  body("product_id").isUUID().withMessage("Valid product ID is required"),
  body("quantity_picked")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity picked must be greater than 0"),
  body("location_id").optional().isUUID().withMessage("Invalid location ID"),
];

const updateItemValidation = [
  body("quantity_delivered")
    .isFloat({ min: 0 })
    .withMessage("Quantity delivered must be non-negative"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid delivery ID"),
];

// All routes require authentication
router.use(authenticate);

// Delivery routes
router.post(
  "/",
  validate(createDeliveryValidation),
  deliveryController.createDelivery
);
router.get("/", deliveryController.getAllDeliveries);
router.get(
  "/:id",
  validate(idParamValidation),
  deliveryController.getDeliveryById
);
router.patch(
  "/:id/status",
  validate([...idParamValidation, ...updateStatusValidation]),
  deliveryController.updateDeliveryStatus
);
router.post(
  "/:id/items",
  validate([...idParamValidation, ...addItemValidation]),
  deliveryController.addDeliveryItem
);
router.patch(
  "/:id/items/:item_id",
  validate([
    ...idParamValidation,
    param("item_id").isUUID(),
    ...updateItemValidation,
  ]),
  deliveryController.updateDeliveryItem
);
router.post(
  "/:id/process",
  validate(idParamValidation),
  deliveryController.processDelivery
);

export default router;
