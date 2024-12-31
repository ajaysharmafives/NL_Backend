import { getSeatsByUserId } from '../models/fetch_seatsModel.js';

export const fetchSeats = (req, res) => {
    const userId = req.query.userId || req.body.userId; // Retrieve userId from query or body

    // Validate userId is provided
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    console.log('Fetching seats for userId:', userId);

    getSeatsByUserId(userId, (err, seats) => {
        if (err) {
            console.error('Error fetching seats:', err);
            return res.status(500).json({ error: 'Failed to fetch seats' });
        }
    
        if (seats.length === 0) {
            console.log('No seats found for userId:', userId);
            return res.status(404).json({ 
                totalSeats: 0, 
                seats: [], 
                message: 'No seats found for the given userId.' 
            });
        }
    
        const totalSeats = seats.length;
        console.log('Seats retrieved:', seats);
        return res.status(200).json({
            totalSeats,
            seats,
        });
    });
};
