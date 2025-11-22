import { Router } from "express";
import { body, param } from "express-validator";
import * as warehouseController from "../controllers/warehouse.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createWarehouseValidation = [
  body("name").notEmpty().withMessage("Warehouse name is required"),
  body("address").optional().isString(),
];

const updateWarehouseValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Warehouse name cannot be empty"),
  body("address").optional().isString(),
];

const createLocationValidation = [
  body("warehouse_id").isUUID().withMessage("Valid warehouse ID is required"),
  body("name").notEmpty().withMessage("Location name is required"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid warehouse ID"),
];

const warehouseIdParamValidation = [
  param("warehouse_id").isUUID().withMessage("Invalid warehouse ID"),
];

// All routes require authentication
router.use(authenticate);

// Warehouse routes
router.post(
  "/",
  validate(createWarehouseValidation),
  warehouseController.createWarehouse
);
router.get("/", warehouseController.getAllWarehouses);
router.get(
  "/:id",
  validate(idParamValidation),
  warehouseController.getWarehouseById
);
router.put(
  "/:id",
  validate([...idParamValidation, ...updateWarehouseValidation]),
  warehouseController.updateWarehouse
);

// Location routes
router.post(
  "/locations",
  validate(createLocationValidation),
  warehouseController.createLocation
);
router.get("/locations/all", warehouseController.getAllLocations);
router.get(
  "/:warehouse_id/locations",
  validate(warehouseIdParamValidation),
  warehouseController.getLocationsByWarehouse
);

export default router;
