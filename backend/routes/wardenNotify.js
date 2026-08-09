const express = require('express');
const bookingRouter = express.Router();
const BookingRequest = require('../model/bookingSchema');
const RoomDetail = require('../model/hostelDetails');
const authenticator = require('../middleware/tokenAuthentication');
const updateBookingRequest = require('../routes/updateBookingRequest');

const getBookingRequests = async (req, res) => {
  try {
    const { userName } = req.user;
    const bookingRequests = await BookingRequest.find();
    console.log(`inside booking request`)
    console.log(bookingRequests.length)
    if (!bookingRequests.length) {
      console.log("No booking requests found");
      return res.status(404).json({ code: 0, msg: "No booking requests found" });
    }

    const filteredRequests = await Promise.all(bookingRequests.map(async (booking) => {
      const currentRoom = await RoomDetail.findOne({ roomNo: booking.currentRoomNo });
      const newRoom = await RoomDetail.findOne({ roomNo: booking.newRoomNo });

      if ((currentRoom && currentRoom.warden === userName) || (newRoom && newRoom.warden === userName)) {
        return {
          userName:booking.userName,
          roomNo: booking.currentRoomNo,
          newHostelRoomNo: booking.newRoomNo,
          status: booking.status,
          warden1Approval: booking.warden1Approval,
          warden2Approval: booking.warden2Approval,
          bookingId:booking.bookingId
        };
      }
      return null;
    }));

    const response = filteredRequests.filter(request => request !== null);
    
    if (!response.length) {
      return res.status(404).json({ code: 0, msg: "No matching booking requests found" });
    }
    
    return res.status(200).json({ code: 1, msg: "Booking requests found", bookingRequests: response });
  } catch (error) {
    console.log("Error fetching booking requests", error);
    return res.status(500).json({ code: -1, msg: "Internal server error", error });
  }
};

bookingRouter.get('/', authenticator, getBookingRequests);
bookingRouter.put('/:id',authenticator,updateBookingRequest);
module.exports = bookingRouter;
