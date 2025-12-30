const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');

const sendErrorResponse = (res, error) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong, please try again later.',
    error: error.message,
  });
};

const notFoundItem = (res, messages) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: messages,
  });
};

/* user profile */
const getProfile = async (req, res) => {
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.userid).select('-password');
    if (!user) {
      return notFoundItem(res, 'The user is not found.');
    }
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: user,
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  getProfile,
};
