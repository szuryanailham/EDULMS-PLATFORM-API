import { Router } from 'express';
import { signupHandler, loginHandler } from '../handlers/auth.handler.js';

const router = Router();

router.post('/sign-up', signupHandler);
router.post('/login', loginHandler);

export default router;