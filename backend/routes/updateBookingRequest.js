const BookingRequest = require("../model/bookingSchema");
const RoomDetail = require("../model/hostelDetails");
const userDetails = require("../model/userDetails");

const updateBookingRequest = async (req, res) => {
  try {
    const { userName } = req.user;
    const { status } = req.body;
    const id = Number(req.params.id);

    const bookingSchemaData = await BookingRequest.findOne({ bookingId: id });
    if (!bookingSchemaData) {
      return res.status(404).json({ code: 0, msg: "Booking request not found" });
    }

    const roomDetail = await RoomDetail.findOne({
      hostel: bookingSchemaData.currentHostel,
      roomNo: bookingSchemaData.currentRoomNo,
    });

    const newRoomDetail = await RoomDetail.findOne({
      hostel: bookingSchemaData.newHostel,
      roomNo: bookingSchemaData.newRoomNo,
    });

    if (!roomDetail || !newRoomDetail) {
      return res.status(404).json({ code: 0, msg: "Room details not found" });
    }

    // Normalize status input
    const normalizedStatus = status.toLowerCase();

    // Normalize warden checks
    if (userName.trim().toLowerCase() === roomDetail.warden.trim().toLowerCase()) {
      bookingSchemaData.warden1Approval = normalizedStatus === "approved" ? "approved" : "rejected";
    }
    if (userName.trim().toLowerCase() === newRoomDetail.warden.trim().toLowerCase()) {
      bookingSchemaData.warden2Approval = normalizedStatus === "approved" ? "approved" : "rejected";
    }

    // Update overall status
    if (bookingSchemaData.warden1Approval === "approved" && bookingSchemaData.warden2Approval === "approved") {
      bookingSchemaData.status = "approved";
    } else if (bookingSchemaData.warden1Approval === "rejected" && bookingSchemaData.warden2Approval === "rejected") {
      bookingSchemaData.status = "rejected";
    }

    await bookingSchemaData.save();

    if (bookingSchemaData.status === "approved") {
      const user = await userDetails.findOne({ name: bookingSchemaData.userName }); // Corrected: use user from booking, not logged-in user
      if (!user) {
        return res.status(404).json({ code: 0, msg: "User not found" });
      }

      user.hostel = bookingSchemaData.newHostel;
      user.roomNo = bookingSchemaData.newRoomNo;
      await user.save();

      // Ensure the user is removed from the old room
      const oldUpdate = await RoomDetail.updateOne(
        { hostel: bookingSchemaData.currentHostel, roomNo: bookingSchemaData.currentRoomNo },
        { $pull: { occupied: user.name.trim() } }
      );

      // Ensure the user is added to the new room
      const newUpdate = await RoomDetail.updateOne(
        { hostel: bookingSchemaData.newHostel, roomNo: bookingSchemaData.newRoomNo },
        { $addToSet: { occupied: user.name.trim() } } 
      );

      await BookingRequest.findOneAndDelete({ bookingId: id });
      return res.status(200).json({ code: 1, msg: "Booking request approved and removed" });
    } else if (bookingSchemaData.status === "rejected") {
      await BookingRequest.findOneAndDelete({ bookingId: id });
      return res.status(200).json({ code: 1, msg: "Booking request rejected and removed" });
    }

    return res.status(200).json({ code: 1, msg: "Booking request updated", bookingRequest: bookingSchemaData });
  } catch (error) {
    return res.status(500).json({ code: -1, msg: "Internal server error", error });
  }
};

module.exports = updateBookingRequest;
