// allocate_seatRoutes.js
import express from 'express';
import allocateSeatController from '../controllers/allocate_seatController.js';

const router = express.Router();

/**
 * POST /api/seats/allocate
 * Endpoint to allocate a seat.
 */
router.post('/allocate', allocateSeatController.allocateSeat);

export default router;
