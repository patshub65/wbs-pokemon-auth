import { login, register } from "#controllers";
import { validate } from "#middleware";
import { Router } from "express";
import { loginSchema, registerSchema } from "#schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;