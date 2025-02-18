import express from 'express';
import { signin, signup } from '../controllers/user.controllers.js';

// Initialize express router
const router = express.Router();

// Set default API response
router.post('/register', signup)
router.post('/signin', signin)

// Export API routes
export default router;