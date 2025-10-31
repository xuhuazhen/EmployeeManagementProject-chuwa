// server/routers/onboardingRouter.js
import express from "express";
import { get_Onboarding, save_Onboarding } from "../controllers/onboardingController.js";

const router = express.Router();

router.get("/me", get_Onboarding);
router.post("/me", save_Onboarding);

export default router;
