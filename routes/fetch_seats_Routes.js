import express from 'express';
import { fetchSeats } from '../controllers/fetch_seats_Controller.js';

const router = express.Router();

// Define the route for fetching seats based on userId
router.post('/fetch_seats', fetchSeats);

export default router;
