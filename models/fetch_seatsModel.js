import { db } from '../config/db.js';

export const getSeatsByUserId = (userId, callback) => {
    const query = 'SELECT * FROM seats_data WHERE userId = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, results);
    });

};
    // Fetch totalUsersSeats from users table
export const getTotalUsersSeats = (userId, callback) => {
    const query = 'SELECT total_seats FROM users WHERE Id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, results[0]?.total_seats || 0); // Default to 0 if no result
    });
};


