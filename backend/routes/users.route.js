import express from 'express';
import { signup } from '../controllers/user.controllers.js';

// Initialize express router
const router = express.Router();

// Set default API response
router.post('/register', signup)

// Export API routes
export default router;