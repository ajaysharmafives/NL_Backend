// routes/userRoutes.js
import express from 'express';
import { createAccount } from '../controllers/userController.js';  // Import the controller

const router = express.Router();

// POST route to create a new user account
router.post('/create-account', createAccount);

export default router;
