import { Router } from 'express';
import { register, login, simpleResetPassword } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validators';

const router = Router();

router.post('/auth/register', registerValidator, register);
router.post('/auth/login', loginValidator, login);
router.post('/auth/reset-password', simpleResetPassword);

export default router;
