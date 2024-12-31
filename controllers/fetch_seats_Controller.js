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
                message: 'No seats found for the given userId.',
            });
        }

        // Add subscriptionStatus without modifying original subscription dates
        const updatedSeats = seats.map(seat => {
            const currentDate = new Date(); // Get current date and time
            const subscriptionEndDate = new Date(seat.subscriptionEndDate); // Parse subscriptionEndDate as Date object

            // Log current date and subscription end date for debugging
            console.log(`Seat ID: ${seat.seatId}`);
            console.log(`Current Date: ${currentDate}`);
            console.log(`Subscription End Date: ${subscriptionEndDate}`);

            // Calculate subscription status: true if current date is on or after subscription end date
            const subscriptionStatus = currentDate >= subscriptionEndDate;

            // Log the comparison result
            console.log(`Subscription Status for Seat ID ${seat.seatId}: ${subscriptionStatus}`);

            // Return a new object with all original properties and calculated subscriptionStatus
            return {
                ...seat,
                subscriptionStatus,
            };
        });

        const totalSeats = updatedSeats.length;
        console.log('Seats retrieved:', updatedSeats);

        // Return the updated response with subscriptionStatus
        return res.status(200).json({
            totalSeats,
            seats: updatedSeats,
        });
    });
};
