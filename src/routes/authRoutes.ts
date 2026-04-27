import { login, me, register } from "#controllers";
import { auth, validate } from "#middleware";
import { Router } from "express";
import { loginSchema, registerSchema } from "#schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", auth, me);

export default router;