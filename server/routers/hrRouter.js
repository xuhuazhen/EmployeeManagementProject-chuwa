import express from "express";
import {
  get_employees,
  post_sendEmail,
  updateDocumentStatus,
  post_sendNotificationEmail,
  get_tokenHistory,
  put_application
} from "../controllers/hrController.js";
import { authValidation, roleValidation } from "../middleware/userMiddleware.js";

const router = express.Router();

// router.use(statusValidation, jwtValidation, roleValidation('hr'));

router.use(authValidation, roleValidation('hr'));

router.route("/signup").post(post_sendEmail);
router.route("/profiles").get(get_employees);
router.route("/documents/:docId").patch(updateDocumentStatus);
router.route("/notify/:userId").post(post_sendNotificationEmail);
router.get('/history', get_tokenHistory);
router.put('/application/:id', put_application);

export default router;
