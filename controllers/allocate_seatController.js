import allocateSeatsModel from '../models/allocate_seatsModel.js';

const allocateSeatController = {
  async allocateSeat(req, res) {
    try {
      // Ensure the table exists before doing anything else
      await allocateSeatsModel.ensureTableExists();

      const {
        seatId,
        userId,
        seatName,
        studentName,
        studentNumber,
        subscriptionStartDate,
        subscriptionEndDate,
        isAllocated, // New field
        subscriptionStatus
      } = req.body;

      // Input validation
      if (
        !seatId ||
        !userId ||
        !seatName ||
        !studentName ||
        !studentNumber ||
        !subscriptionStartDate ||
        !subscriptionEndDate ||
         subscriptionStatus
      ) {
        return res.status(400).json({ message: 'All fields are required except isAllocated' });
      }

      // Create a new seat allocation
      const result = await allocateSeatsModel.create({
        seatId,
        userId,
        seatName,
        studentName,
        studentNumber,
        subscriptionStartDate,
        subscriptionEndDate,
        isAllocated: isAllocated !== undefined ? isAllocated : false, // Default to false if not provided
        subscriptionStatus: subscriptionStatus!==undefined ? subscriptionStatus :false,
      });

      // Send response
      res.status(201).json({
        message: 'Seat allocated successfully',
        data: {
          id: result.insertId,
          seatId,
          userId,
          seatName,
          studentName,
          studentNumber,
          subscriptionStartDate,
          subscriptionEndDate,
          isAllocated: isAllocated !== undefined ? isAllocated : false,
          subscriptionStatus: subscriptionStatus!==undefined ? subscriptionStatus :false,
        },
      });
    } catch (error) {
      console.error('Error allocating seat:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default allocateSeatController;
