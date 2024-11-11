const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Routes
//For Tours
app.use('/api/v1/tours', tourRouter);

//For Users
app.use('/api/v1/users', userRouter);

module.exports = app;
