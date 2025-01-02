import { db } from '../config/db.js';

export const findUserByMobile = (number, callback) => {
    const query = 'SELECT * FROM users WHERE number = ?';
    
    db.query(query, [number], (error, rows) => {
        if (error) {
            console.error(`Error fetching user: ${error.message}`);
            return callback(error); // Pass error to callback
        }
        
        if (rows.length === 0) {
            return callback(null, null); // User not found
        }

        return callback(null, rows[0]); // Return the user
    });
};
