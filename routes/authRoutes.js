const { Router } = require("express");
const env = require('dotenv')
const cloudinary = require('cloudinary').v2
const authController = require("../controllers/authController");
env.config()
const router = Router();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// signup route
router.post("/api/signup/", async (req, res, next) => {
  const file = req.files.image
  try {
    const { url } = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "profile-photos/",
      responsive_breakpoints:
      {
        create_derived: true,
        bytes_step: 20000,
        min_width: 200,
        max_width: 1000
      }
    })
    req.body.imagePath=url
    next()
  }
  catch(error){
    res.status(400).send({error:error.message})
  }
}, authController.signup);

// login route
router.post("/api/login/", authController.login);

module.exports = router;
