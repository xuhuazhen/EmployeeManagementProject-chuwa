import express from "express";
import { get_allProfiles } from "../controllers/hrController.js";

const router = express.Router();

router.route("/profiles").get(get_allProfiles);

export default router;
