const mongoose = require('mongoose');
const user = require('./model/userDetails');
const login = require('./model/logins')
const hostel = require('./model/hostelDetails')
const dotenv = require('dotenv');
dotenv.config();
 const roomDetails =  
[
  {
    "hostel": "Emerald",
    "roomNo": 101,
    "roomId": 1001,
    "floor": "First Floor",
    "wing": "Left Wing",
    "occupied": ["sameer", "rahul"],
    "warden": "meena"
  },
  {
    "hostel": "Emerald",
    "roomNo": 102,
    "roomId": 1002,
    "floor": "Second Floor",
    "wing": "Right Wing",
    "occupied": ["anisha", "vivek"],
    "warden": "meena"
  },
  {
    "hostel": "Ruby",
    "roomNo": 201,
    "roomId": 2001,
    "floor": "First Floor",
    "wing": "Left Wing",
    "occupied": ["neha", "ravi"],
    "warden": "rajesh"
  },
  {
    "hostel": "Ruby",
    "roomNo": 202,
    "roomId": 2002,
    "floor": "Second Floor",
    "wing": "Right Wing",
    "occupied": ["swati", "amit"],
    "warden": "rajesh"
  },
  {
    "hostel": "Sapphire",
    "roomNo": 301,
    "roomId": 3001,
    "floor": "First Floor",
    "wing": "Left Wing",
    "occupied": ["deepa", "sanjay"],
    "warden": "neetu"
  }
]






const insertData = async () => {
  try {

    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected!');


    const result = await hostel.insertMany(roomDetails);
    console.log('Sample data inserted:', result);


    await mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting data:', error);
    mongoose.connection.close();
  }
};

insertData();