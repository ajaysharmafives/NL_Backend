import { db } from '../config/db.js';

export const fetchActiveMembersData = async (req, res) => {
    // Access userId from req.body since it's a POST request
    const { userId } = req.body;

    // Validate userId is provided
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        // Step 1: Fetch all seats data for the given userId
        const query = `SELECT * FROM seats_data WHERE userId = ?
       AND studentName IS NOT NULL AND studentName != ''`;
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching seats data:', err);
                return res.status(500).json({ error: 'Failed to fetch seats data' });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    seats: [],
                });
            }

          

            const currentDate = new Date(); // Current date for subscription status calculation

            const updatedSeats = results.map((seat) => {
                // Check if subscriptionEndDate is valid (not null and a valid date)
                const subscriptionEndDate = seat.subscriptionEndDate ? new Date(seat.subscriptionEndDate) : null;
                
                // Only calculate subscription status if subscriptionEndDate is valid
                let subscriptionStatus = false;
                if (subscriptionEndDate && !isNaN(subscriptionEndDate)) {
                    const currentDate = new Date();
                    subscriptionStatus = currentDate >= subscriptionEndDate;
                }
            
               
            
                return {
                    seatId: seat.seatId,
                    userId: seat.userId,
                    seatName: seat.seatName,
                    studentName: seat.studentName,
                    studentNumber: seat.studentNumber,
                    subscriptionStartDate: seat.subscriptionStartDate,
                    subscriptionEndDate: seat.subscriptionEndDate,
                    isAllocated: seat.isAllocated,
                    subscriptionStatus: subscriptionStatus, // Add subscription status to the seat data
                    member_fees: seat.member_fees,
                };
            });
            

            // Step 3: Return the formatted response
            return res.status(200).json({
                seats: updatedSeats, // Return the updated seats with subscription status
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
