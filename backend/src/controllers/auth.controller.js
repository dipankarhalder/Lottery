const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const { NODEENV, EXPTIME } = require('../config');

const sendErrorResponse = (res, error) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong, please try again later.',
    error: error.message,
  });
};

const validateFields = (res, messages) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status: StatusCodes.BAD_REQUEST,
    message: messages,
  });
};

const userInfoSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name should not be blank.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email addesss should not be blank.',
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password should not be blank.',
    'string.min': 'Password must be at least 6 characters.',
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email addesss should not be blank.',
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password should not be blank.',
    'string.min': 'Password must be at least 6 characters.',
  }),
});

/* user signup */
const userSignup = async (req, res) => {
  try {
    const { error, value } = userInfoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res, error.details.map((detail) => detail.message).join(', '));
    }
    const existingEmail = await User.findOne({ email: value.email });
    if (existingEmail) {
      return validateFields(res, 'Provided email is already associated with another user.');
    }
    const user = new User(value);
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'New user created successfully.',
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user signin */
const userSignin = async (req, res) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return validateFields(res, error.details.map((detail) => detail.message).join(', '));
    }
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return validateFields(res, 'Provided email address is not exist!');
    }
    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) {
      return validateFields(res, 'Entered password is invalid, please try again.');
    }
    const token = user.generateAuthToken();
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: NODEENV === 'production',
      maxAge: Number(EXPTIME),
      sameSite: 'Strict',
    });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      token: token,
      message: 'You are successfully logged-in.',
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

/* user signin */
const userSignout = async (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: NODEENV === 'production',
      sameSite: 'Strict',
    });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'You are Logged-out successfully.',
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  userSignup,
  userSignin,
  userSignout,
};
