import express from "express";
import { get_profile } from "../controllers/userController.js";

const router = express.Router();

router.route("/profile/:id").get(get_profile);

export default router;
