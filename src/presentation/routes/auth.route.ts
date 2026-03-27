import { Router } from 'express';

const router = Router();

router.post('/sign-up', (req, res) => {
  res.json({
    status: 'success',
    message: 'User registered',
  });
});

export default router;