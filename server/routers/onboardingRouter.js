import { Router } from 'express';
import {
  get_Onboarding,
  update_Onboarding
} from '../controllers/onboardingController.js';

const router = Router();

router.route('/:id')
  // 获取我的 Onboarding 信息
  .get(get_Onboarding)
  // 提交/更新 Onboarding 表单
  .post(update_Onboarding);

export default router;
