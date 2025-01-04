import express from 'express';
import { fetch_user_seat_details } from '../controllers/view_user_detailsController.js';

const router = express.Router();

// Define the route for fetching seat details
router.post('/fetch_seat_details', fetch_user_seat_details);

export default router;
