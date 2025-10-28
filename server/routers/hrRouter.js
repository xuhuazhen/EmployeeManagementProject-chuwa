import express from 'express';
import {
  post_sendEmail,
} from '../controllers/hrController.js';

const router = express.Router();

// router.use(statusValidation, jwtValidation, roleValidation('hr'));

router.route('/signup').post(post_sendEmail);

export default router;
