import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validator";

const router = Router();

// Validation rules
const createUserValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("role")
    .isIn(["inventory_manager", "warehouse_staff", "admin"])
    .withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

const verifyOTPValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("otp").notEmpty().withMessage("OTP is required"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Public routes
router.post(
  "/register",
  validate(createUserValidation),
  userController.register
);
router.post("/login", validate(loginValidation), userController.login);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  userController.forgotPassword
);
router.post(
  "/verify-otp",
  validate(verifyOTPValidation),
  userController.verifyOTPAndResetPassword
);

// Protected routes (require authentication)
router.get("/profile", authenticate, userController.getProfile);
router.get("/", authenticate, userController.getAllUsers);
router.get("/:id", authenticate, userController.getUserById);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

export default router;
