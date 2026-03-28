import { Router } from 'express';
import { signupHandler } from '../handlers/auth.handler.js';

const router = Router();

router.post('/signup', signupHandler);

export default router;