import express from "express";
import {
  get_employees,
  post_sendEmail,
  // getInProgressEmployees,
  updateDocumentStatus,
  post_sendNotificationEmail,
} from "../controllers/hrController.js";

const router = express.Router();

// router.use(statusValidation, jwtValidation, roleValidation('hr'));

router.route("/signup").post(post_sendEmail);
router.route("/profiles").get(get_employees);
// router.route("/in-progress").get(getInProgressEmployees);
router.route("/documents/:docId").patch(updateDocumentStatus);
router.route("/:userId/notify").post(post_sendNotificationEmail);

export default router;
