const mongoose = require('mongoose');

const SectionImageSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ['sec_1', 'sec_2', 'sec_3'],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SectionImage', SectionImageSchema);
