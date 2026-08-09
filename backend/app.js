
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors=require('cors');
const connectDb = require('./config/connectDb');
const loginRouter = require('./routes/loginRoute');
const homeRouter = require('./routes/homeRoute');
const hostelRouter = require('./routes/hostelRoute');
const roomRouter = require('./routes/roomDetail');
const bookRouter=require('./routes/bookRoute');
const studentNotify = require('./routes/studentNotify');
const wardenNotify = require('./routes/wardenNotify');
const cookieParser = require('cookie-parser');
dotenv.config(); 
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:'http://localhost:5173'}))
app.use('/api/v1/login',loginRouter);
app.use('/api/v1/home',homeRouter);
app.use('/api/v1/availability',hostelRouter);
app.use('/api/v1/roomDetails',roomRouter);
app.use('/api/v1/book',bookRouter);
app.use('/api/v1/studentNotify',studentNotify);
app.use('/api/v1/wardenNotify',wardenNotify);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port no ${process.env.PORT}`);
});