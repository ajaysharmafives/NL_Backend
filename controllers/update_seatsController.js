import updateSeatsModel from '../models/update_seatsModel.js'; // Importing the model

const updateSeatsController = {
  async updateSeat(req, res) {
    try {
      // Get the seat data from the request body
      const {
        seatId,
        userId,
        seatName,
        studentName,
        studentNumber,
        subscriptionStartDate,
        subscriptionEndDate,
        isAllocated, // Added new field
        member_fees,
      } = req.body;

      // Input validation
      if (
        !seatId ||
        !userId || // Validate userId
        !seatName ||
        !studentName ||
        !studentNumber ||
        !subscriptionStartDate ||
        !subscriptionEndDate ||
        !member_fees
      ) {
        return res.status(400).json({ message: 'All fields are required except isAllocated' });
      }

      // Call the model method to update the seat allocation
      const result = await updateSeatsModel.update({
        seatId,
        userId, // Include userId in the update
        seatName,
        studentName,
        studentNumber,
        subscriptionStartDate,
        subscriptionEndDate,
        isAllocated: isAllocated !== undefined ? isAllocated : false, // Default to false if not provided
        member_fees,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Seat not found' });
      }

      // Return the response to the client
      res.status(200).json({
        message: 'Seat allocation updated successfully',
        data: {
          seatId,
          userId, // Return userId in the response
          seatName,
          studentName,
          studentNumber,
          subscriptionStartDate,
          subscriptionEndDate,
          isAllocated: isAllocated !== undefined ? isAllocated : false, // Include in the response
          member_fees, 
        },
      });
    } catch (error) {
      console.error('Error updating seat:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default updateSeatsController;
