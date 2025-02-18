import express from 'express';
import { logout, signin, signup } from '../controllers/user.controllers.js';

// Initialize express router
const router = express.Router();

// Set default API response
router.post('/register', signup)
router.post('/signin', signin)
router.get('/logout', logout)

// Export API routes
export default router;