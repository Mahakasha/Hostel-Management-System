const express = require('express');
const bookingRouter = express.Router();
const BookingRequest = require('../model/bookingSchema');
const authenticator = require('../middleware/tokenAuthentication');

const getBookingRequest = async (req, res) => {
  try {
    const { userName } = req.user;

    const bookingRequest = await BookingRequest.findOne({ userName });
    console.log(req.user)
    if (!bookingRequest) {
      console.log("Booking request not found");
      return res.status(404).json({ code: 0, msg: "Booking request not found" });
    }

    const response = {
      roomNo: bookingRequest.currentRoomNo,
      newHostelRoomNo: bookingRequest.newRoomNo,
      status: bookingRequest.status,
      warden1Approval: bookingRequest.warden1Approval,
      warden2Approval: bookingRequest.warden2Approval
    };

    return res.status(200).json({ code: 1, msg: "Booking request found", bookingRequest: response });

  } catch (error) {
    console.log("Error fetching booking request", error);
    return res.status(500).json({ code: -1, msg: "Internal server error", error });
  }
};

bookingRouter.get('/', authenticator, getBookingRequest);
module.exports = bookingRouter;
