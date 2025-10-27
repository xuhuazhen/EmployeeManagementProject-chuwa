import express from 'express';import { 
  get_login,
  post_login,
  post_signup, 
//   get_logout,
  get_signup,
} from '../controllers/authController.js';
import { get_profile } from '../controllers/userController.js';
import { signupUserValidation, loginUserValidation } from '../middleware/userMiddleware.js';

const router = express.Router();

router.route('/profile/:id').get(get_profile);

router.get('/signup/:signupToken', get_signup);
router.post('/signup',signupUserValidation, post_signup);

router.route('/login').get(get_login)
    .post(loginUserValidation, post_login);

export default router;
