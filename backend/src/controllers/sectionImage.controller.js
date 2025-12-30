const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const SectionImage = require('../models/sectionImage.model');

const UPLOAD_DIR = path.resolve('uploads');
const uploadSectionImage = async (req, res) => {
  try {
    const sections = ['sec_1', 'sec_2', 'sec_3'];
    const responseData = {};

    for (let i = 1; i <= 3; i++) {
      const title = req.body[`title${i}`];
      const file = req.files?.[`image${i}`]?.[0];

      // Skip empty rows
      if (!title && !file) continue;

      // Validate row: both title and image required if one is provided
      if (!title || !file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: `Both title and image are required for row ${i}.`,
        });
      }

      const section = sections[i - 1];
      const existing = await SectionImage.findOne({ section });
      if (existing) {
        // Remove old image
        const oldPath = path.join(UPLOAD_DIR, existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

        existing.title = title;
        existing.image = file.filename;
        await existing.save();
      } else {
        await SectionImage.create({ section, title, image: file.filename });
      }
      responseData[section] = { title, imageUrl: `/uploads/${file.filename}` };
    }

    if (Object.keys(responseData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Please provide at least one title and image row.',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Section images uploaded successfully.',
      data: responseData,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to upload section images.',
      error: error.message,
    });
  }
};

/* Get all section images */
const getSectionImages = async (req, res) => {
  try {
    const images = await SectionImage.find();
    const response = { sec_1: null, sec_2: null, sec_3: null };

    images.forEach((item) => {
      response[item.section] = {
        title: item.title,
        imageUrl: `/uploads/${item.image}`,
      };
    });

    return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, data: response });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch section images.',
      error: error.message,
    });
  }
};

module.exports = { uploadSectionImage, getSectionImages };
