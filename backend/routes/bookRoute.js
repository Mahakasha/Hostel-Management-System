const express = require('express');
const bookingRouter = express.Router();
const UserDetail = require('../model/userDetails');
const RoomDetail = require('../model/hostelDetails');
const BookingRequest = require('../model/bookingSchema');
const tokenAuthenticator = require('../middleware/tokenAuthentication');

const initiateBooking = async (req, res) => {
  try {
      const { userName } = req.user; // Extracted from token via middleware
      const { newHostel, newRoomNo } = req.body;

      if (!userName || !newHostel || !newRoomNo) {
          return res.status(400).json({ code: -1, msg: "Missing required fields" });
      }

      const student = await UserDetail.findOne({ name: userName });
      if (!student) {
          return res.status(404).json({ code: -1, msg: "Student not found" });
      }

      const currentHostel = student.hostel;
      const currentRoomNo = student.roomNo;

      const currentRoom = await RoomDetail.findOne({ hostel: currentHostel, roomNo: currentRoomNo });
      const newRoom = await RoomDetail.findOne({ hostel: newHostel, roomNo: newRoomNo });

      if (!currentRoom || !newRoom) {
          return res.status(404).json({ code: -1, msg: "Room not found" });
      }
      const bookReq = await BookingRequest.findOne({userName});
      if(bookReq){ 
        return res.status(400).json({code:0,msg:"already a booking request exist"});
      }
      const lastBooking = await BookingRequest.findOne().sort({ bookingId: -1 }); 
     const newBookingId = lastBooking ? lastBooking.bookingId + 1 : 1;
      const newBookingRequest = new BookingRequest({
          bookingId:newBookingId,
          userName,
          newHostel,
          newRoomNo,
          currentHostel,
          currentRoomNo,
      });

      await newBookingRequest.save();

      return res.status(201).json({
          code: 1,
          msg: "Booking request successfully created",
          bookingRequestId: newBookingRequest._id,
      });
  } catch (error) {
      console.error("Error during booking initiation:", error);
      return res.status(500).json({ code: -1, msg: "Internal server error" });
  }
};


bookingRouter.post('/initiate-booking', tokenAuthenticator, initiateBooking);
module.exports = bookingRouter;
