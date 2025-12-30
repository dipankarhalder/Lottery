const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltNum = 10;
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true },
);

/* middleware to hash the password */
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(saltNum);
  this.password = await bcrypt.hash(this.password, salt);
});

/* compare both passwords */
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

/* generate JWT token */
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      userid: this._id,
      email: this.email,
    },
    process.env.JWTSECRET,
    { expiresIn: process.env.EXPTIME },
  );
};

module.exports = mongoose.model('User', UserSchema);
