const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema(
  { 
    bookingId:{type:Number, required:true, unique:true},
    userName: { type: String, required: true },
    newHostel: { type: String, required: true },
    newRoomNo: { type: Number, required: true },
    currentHostel: { type: String, required: true },
    currentRoomNo: { type: Number, required: true },
    status: { type: String, enum: ['waiting', 'approved', 'rejected'], default: 'waiting' },
    warden1Approval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    warden2Approval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

const BookingRequest = mongoose.model('BookingRequest', bookingRequestSchema);

module.exports = BookingRequest;
