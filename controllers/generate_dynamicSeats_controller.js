import { db } from '../config/db.js';

export const updateTotalSeats = async (req, res) => {
    const { userId, total_seats } = req.body;

    // Validate input fields
    if (!userId || total_seats === undefined) {
        return res.status(400).json({ error: 'Both userId and total_seats are required' });
    }

    try {
        // Step 1: Get the existing number of seats assigned to the given userId
        const getExistingSeatsQuery = `SELECT COUNT(*) AS existingSeats FROM seats_data WHERE userId = ?`;
        db.query(getExistingSeatsQuery, [userId], (err, result) => {
            if (err) {
                console.error('Error checking existing seats:', err);
                return res.status(500).json({ error: 'Failed to check existing seats' });
            }

            const existingSeatsCount = result[0]?.existingSeats || 0;

            // If the user already has the required number of seats, don't create more
            if (existingSeatsCount >= total_seats) {
                return res.status(200).json({
                    message: `UserId ${userId} already has enough seats. No new seats will be created.`,
                    totalSeatsAssigned: existingSeatsCount,
                });
            }

            // Step 2: Calculate how many more seats need to be generated
            const seatsToGenerate = total_seats - existingSeatsCount;

            // Step 3: Get the current highest seatId
            const getMaxSeatIdQuery = `SELECT MAX(seatId) AS maxSeatId FROM seats_data`;
            db.query(getMaxSeatIdQuery, (err, result) => {
                if (err) {
                    console.error('Error fetching max seatId:', err);
                    return res.status(500).json({ error: 'Failed to fetch max seatId' });
                }

                const maxSeatId = result[0]?.maxSeatId || 0; // Default to 0 if no seats exist
                let nextSeatId = maxSeatId + 1; // Start incrementing from the next seatId

                // Step 4: Generate empty seats data for missing seats
                const emptySeats = [];
                for (let i = 0; i < seatsToGenerate; i++) {
                    emptySeats.push([ 
                        nextSeatId++, // Increment the seatId
                        userId,
                        `Seat ${nextSeatId - 1}`, // Use the current seatId for the seat name
                        '',
                        '',
                        null,
                        null,
                        0,
                        0,
                    ]);
                }

                // Step 5: Insert the generated empty seats into the database
                const insertQuery = `
                    INSERT INTO seats_data 
                    (seatId, userId, seatName, studentName, studentNumber, subscriptionStartDate, subscriptionEndDate, isAllocated, subscriptionStatus)
                    VALUES ?`;

                db.query(insertQuery, [emptySeats], (insertErr, results) => {
                    if (insertErr) {
                        console.error('Error inserting empty seats:', insertErr);
                        return res.status(500).json({ error: 'Failed to add empty seats' });
                    }

                    return res.status(200).json({
                        message: `${seatsToGenerate} empty seats added successfully for userId ${userId}.`,
                        totalSeatsAssigned: existingSeatsCount + seatsToGenerate,
                    });
                });
            });
        });
    } catch (err) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
