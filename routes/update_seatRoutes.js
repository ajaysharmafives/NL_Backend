// update_seatRoutes.js
import express from 'express';
import updateSeatsController from '../controllers/update_seatsController.js'; // Importing the controller

const router = express.Router();

// Define the route for updating the seat allocation
router.put('/update', updateSeatsController.updateSeat); // PUT request to update seat allocation

export default router;
