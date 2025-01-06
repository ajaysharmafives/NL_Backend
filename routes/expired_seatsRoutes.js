import express from 'express';

import { fetchExpiredSubscriptions } from '../controllers/expired_seatsController.js'

const router = express.Router();

// Define the route for fetching seats based on userId
router.post('/expiryseats', fetchExpiredSubscriptions);

export default router;
