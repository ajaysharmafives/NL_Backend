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