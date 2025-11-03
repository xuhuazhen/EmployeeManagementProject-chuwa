// server/routers/onboardingRouter.js
import express from "express";
import { get_Onboarding, save_Onboarding } from "../controllers/onboardingController.js";
import { authValidation } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/me", get_Onboarding);
router.post("/me", authValidation, save_Onboarding);

export default router;
