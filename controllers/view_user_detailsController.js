import { db } from '../config/db.js';

// Fetch a specific seat based on userId and seatId
export const fetch_user_seat_details = (req, res) => {
    const { userId, seatId } = req.body;

    // Check if both userId and seatId are provided
    if (!userId || !seatId) {
        return res.status(400).json({ error: 'userId and seatId are required' });
    }

    const query = 'SELECT * FROM seats_data WHERE userId = ? AND seatId = ?';

    db.query(query, [userId, seatId], (err, results) => {
        if (err) {
            console.error('Error fetching seat details:', err);
            return res.status(500).json({ error: 'Failed to fetch seat details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No seat found for the given userId and seatId' });
        }

        res.status(200).json({ seatDetails: results[0] });
    });
};
