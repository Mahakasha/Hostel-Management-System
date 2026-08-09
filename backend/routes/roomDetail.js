const express = require('express');
const roomRouter = express.Router();
const hostelDetail = require('../model/hostelDetails');
const userDetails = require('../model/userDetails');
const authenticator = require('../middleware/tokenAuthentication'); // Middleware for token authentication

// POST route to get room details
const getRoomDetails = async (req, res) => {
    try {
        const { jwt, roomid } = req.body;

        if (!jwt || !roomid) {
            console.log("Validation failed: Missing required fields");
            return res.status(400).json({ code: 0, msg: "jwt and roomid are required" });
        }

        // Find the room by roomId
        const room = await hostelDetail.findOne({ roomId: roomid });
        if (!room) {
            return res.status(404).json({ code: 0, msg: "Room not found" });
        }

        // Fetch details of the warden
        const warden = await userDetails.findOne({
            hostel: room.hostel,
            userType: "warden",
            roomNo: room.roomNo
        });

        const wardenName = warden ? warden.name : "Not assigned";

        // Fetch student details for the room's occupants
        const students = await Promise.all(
            room.occupied.map(async (occupant) => {
                const student = await userDetails.findOne({ name: occupant });
                return student
                    ? {
                        name: student.name,
                        mailid: student.email,
                        phone: student.phoneNo
                    }
                    : null;
            })
        );

        // Filter out any null values in case some occupants are not found
        const validStudents = students.filter(student => student !== null);

        // Build the response
        const response = {
            roomno: room.roomNo,
            floor: room.floor,
            hostel: room.hostel,
            warden: wardenName,
            occupied: validStudents.length,
            capacity: 4-validStudents.length,
            students: validStudents
        };

        console.log("Successfully fetched room details:", response);

        return res.status(200).json(response);

    } catch (error) {
        console.error("Error in getRoomDetails:", error);
        return res.status(500).json({ code: -1, msg: "Internal server error" });
    }
};

roomRouter.post('/', authenticator, getRoomDetails);

module.exports = roomRouter;
