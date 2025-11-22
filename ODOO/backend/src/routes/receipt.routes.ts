import { Router } from "express";
import { body, param } from "express-validator";
import * as receiptController from "../controllers/receipt.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createReceiptValidation = [
  body("supplier_name").notEmpty().withMessage("Supplier name is required"),
  body("warehouse_id").isUUID().withMessage("Valid warehouse ID is required"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["draft", "pending", "ready", "done", "canceled"])
    .withMessage("Invalid status"),
];

const addItemValidation = [
  body("product_id").isUUID().withMessage("Valid product ID is required"),
  body("quantity_expected")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity expected must be greater than 0"),
  body("location_id").optional().isUUID().withMessage("Invalid location ID"),
];

const updateItemValidation = [
  body("quantity_received")
    .isFloat({ min: 0 })
    .withMessage("Quantity received must be non-negative"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid receipt ID"),
];

// All routes require authentication
router.use(authenticate);

// Receipt routes
router.post(
  "/",
  validate(createReceiptValidation),
  receiptController.createReceipt
);
router.get("/", receiptController.getAllReceipts);
router.get(
  "/:id",
  validate(idParamValidation),
  receiptController.getReceiptById
);
router.patch(
  "/:id/status",
  validate([...idParamValidation, ...updateStatusValidation]),
  receiptController.updateReceiptStatus
);
router.post(
  "/:id/items",
  validate([...idParamValidation, ...addItemValidation]),
  receiptController.addReceiptItem
);
router.patch(
  "/:id/items/:item_id",
  validate([
    ...idParamValidation,
    param("item_id").isUUID(),
    ...updateItemValidation,
  ]),
  receiptController.updateReceiptItem
);
router.post(
  "/:id/process",
  validate(idParamValidation),
  receiptController.processReceipt
);

export default router;
