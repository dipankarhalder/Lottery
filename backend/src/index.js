const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');
const { dbConnect } = require('./config/db.config');
const { RootRouter } = require('./routes');

dotenv.config({ quiet: true });

/* initial express app */
const app = express();

/* CORS configuration */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.CLIENTURL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

/* all important middleware */
app.use(morgan(process.env.PLATFORM || 'development'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** Serve static uploads directory */
app.use('/uploads', express.static(path.resolve('uploads')));

/* application main endpoint */
app.use('/api', RootRouter);

/* handled undefined routes */
app.use((req, res, next) => {
  const error = new Error('The API url not found.');
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

/* application global errors handled using middleware */
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || 'Internal Server Error',
  });
});

/* connect database and started server */
dbConnect()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server successfully started on port : ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database failed to connect.', err);
    process.exit(1);
  });
