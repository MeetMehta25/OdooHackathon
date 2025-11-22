import { Router } from "express";
import { body, param } from "express-validator";
import * as transferController from "../controllers/transfer.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createTransferValidation = [
  body("source_location_id")
    .isUUID()
    .withMessage("Valid source location ID is required"),
  body("destination_location_id")
    .isUUID()
    .withMessage("Valid destination location ID is required"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["draft", "pending", "ready", "done", "canceled"])
    .withMessage("Invalid status"),
];

const addItemValidation = [
  body("product_id").isUUID().withMessage("Valid product ID is required"),
  body("quantity")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than 0"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid transfer ID"),
];

// All routes require authentication
router.use(authenticate);

// Transfer routes
router.post(
  "/",
  validate(createTransferValidation),
  transferController.createTransfer
);
router.get("/", transferController.getAllTransfers);
router.get(
  "/:id",
  validate(idParamValidation),
  transferController.getTransferById
);
router.patch(
  "/:id/status",
  validate([...idParamValidation, ...updateStatusValidation]),
  transferController.updateTransferStatus
);
router.post(
  "/:id/items",
  validate([...idParamValidation, ...addItemValidation]),
  transferController.addTransferItem
);
router.post(
  "/:id/process",
  validate(idParamValidation),
  transferController.processTransfer
);

export default router;
