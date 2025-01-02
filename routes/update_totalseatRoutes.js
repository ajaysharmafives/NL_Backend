// update_seatRoutes.js
import express from 'express';
import { updateTotalSeats } from '../controllers/generate_dynamicSeats_controller.js'; // Importing the controller

const router = express.Router();

// Define the route for updating the seat allocation
router.patch('/update_total_seats', updateTotalSeats); // PATCH request for partial update

export default router;
