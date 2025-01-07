import express from 'express';
import { fetchActiveMembersData } from '../controllers/fetchActiveMembersControllers.js';

const router = express.Router();

// Define the route for fetching seats based on userId
router.post('/fetch_seats', fetchActiveMembersData);

export default router;







