import { db } from '../config/db.js'; // Importing the db connection pool

const updateSeatsModel = {
  /**
   * Updates an existing seat allocation in the seats_data table.
   * @param {Object} seatData - The seat allocation data to update.
   * @returns {Promise<Object>} - The result of the update operation.
   */
  update(seatData) {
    const query = `
      UPDATE seats_data
      SET 
        userId = ?, 
        seatName = ?, 
        studentName = ?, 
        studentNumber = ?, 
        subscriptionStartDate = ?, 
        subscriptionEndDate = ?, 
        isAllocated = ?, 
        member_fees = ?
      WHERE seatId = ?;
    `;

    const values = [
      seatData.userId,           // Update userId
      seatData.seatName,         // Update seatName
      seatData.studentName,      // Update studentName
      seatData.studentNumber,    // Update studentNumber
      seatData.subscriptionStartDate, // Update subscriptionStartDate
      seatData.subscriptionEndDate,   // Update subscriptionEndDate
      seatData.isAllocated,      // Update isAllocated
      seatData.member_fees,
      seatData.seatId,           // Use seatId to identify which record to update
    ];

    // Return a Promise for handling the query asynchronously
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(new Error('Error updating data: ' + err.message));
        } else {
          resolve(result); // Return the query result
        }
      });
    });
  },
};

export default updateSeatsModel;
