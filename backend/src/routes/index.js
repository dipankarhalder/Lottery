const express = require('express');
const { userSignup, userSignin, userSignout } = require('../controllers/auth.controller');
const { uploadSectionImage, getSectionImages } = require('../controllers/sectionImage.controller');
const { getProfile } = require('../controllers/profile.controller');
const { upload } = require('../middleware/uploadFile');
const verifyToken = require('../middleware/verifyAuthToken');

const router = express.Router();

/* authentication */
router.post('/auth/signup', userSignup);
router.post('/auth/signin', userSignin);
router.post('/auth/signout', userSignout);

/* profile */
router.get('/profile/me', verifyToken, getProfile);

/* image upload */
router.post(
  '/section-image',
  verifyToken,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  uploadSectionImage,
);
router.get('/section-image', getSectionImages);

module.exports = {
  RootRouter: router,
};
