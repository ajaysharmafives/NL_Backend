import { db } from '../config/db.js';

export const fetchExpiredSubscriptions = async (req, res) => {
    const { userId } = req.body;

    // Validate userId is provided
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        // Fetch seats data for the given userId
        const query = `SELECT seatId, userId, seatName, studentName, studentNumber, 
                               subscriptionStartDate, subscriptionEndDate, isAllocated, member_fees 
                       FROM seats_data 
                       WHERE userId = ?
                       AND subscriptionEndDate IS NOT NULL`;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching seats data:', err);
                return res.status(500).json({ error: 'Failed to fetch seats data' });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'No seats data found for the given userId.',
                });
            }

            const currentDate = new Date(); // Current date for subscription expiration check

            // Filter only the expired subscriptions
            const expiredSeats = results.filter((seat) => {
                const subscriptionEndDate = new Date(seat.subscriptionEndDate);
                return currentDate > subscriptionEndDate; // Only expired subscriptions
            });

            // If there are no expired subscriptions
            if (expiredSeats.length === 0) {
                return res.status(200).json({
                    expiredSeats,
                    message: 'No expired subscriptions found for the given userId.',
                });
            }

            // Return only the expired seats
            return res.status(200).json({
                expiredSeats,
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
