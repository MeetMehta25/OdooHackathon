import { Router } from "express";
import { body, param } from "express-validator";
import * as productController from "../controllers/product.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createProductValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("uom").notEmpty().withMessage("Unit of measure is required"),
  body("reorder_level")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reorder level must be a positive number"),
];

const updateProductValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("uom")
    .optional()
    .notEmpty()
    .withMessage("Unit of measure cannot be empty"),
  body("reorder_level")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reorder level must be a positive number"),
];

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid product ID"),
];

// All routes require authentication
router.use(authenticate);

// Product routes
router.post(
  "/",
  validate(createProductValidation),
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get(
  "/:id",
  validate(idParamValidation),
  productController.getProductById
);
router.put(
  "/:id",
  validate([...idParamValidation, ...updateProductValidation]),
  productController.updateProduct
);
router.delete(
  "/:id",
  validate(idParamValidation),
  productController.deleteProduct
);
router.get(
  "/:id/stock",
  validate(idParamValidation),
  productController.getProductStock
);

export default router;
