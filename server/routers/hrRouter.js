import express from "express";
import {
  post_sendEmail,
  get_allProfiles,
} from "../controllers/hrController.js";

const router = express.Router();

// router.use(statusValidation, jwtValidation, roleValidation('hr'));

router.route("/signup").post(post_sendEmail);
router.route("/profiles").get(get_allProfiles);

export default router;
