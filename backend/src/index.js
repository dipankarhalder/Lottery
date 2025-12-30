const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');
const { PORT, CLIENTURL, PLATFORM, dbConfig } = require('./config');
const { RootRouter } = require('./routes');

/* initial express app */
const app = express();

/* CORS configuration */
const corsOptions = {
  origin: function (origin, callback) {
    // allow local dev and frontend
    const allowedOrigins = [CLIENTURL, 'http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

/* all important middleware */
app.use(morgan(PLATFORM));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** Serve static uploads directory */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
dbConfig()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server successfully started on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database failed to connect.', err);
    process.exit(1);
  });
