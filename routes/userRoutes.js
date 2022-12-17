const { Router } = require("express");
const env = require('dotenv')
const cloudinary = require('cloudinary').v2
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
env.config()
const router = Router();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

router.post(
  "/api/user/update/",
  authenticate.auth,
  async (req, res, next) => {
    const file = req.files.image
    const currentURL = req.body.imagePath
    if (file) {
      try {
        await cloudinary.uploader.destroy(currentURL)
        const { url } = cloudinary.uploader.upload(file.tempFilePath, {
          folder: "profile-photos/",
          responsive_breakpoints:
          {
            create_derived: true,
            bytes_step: 20000,
            min_width: 200,
            max_width: 1000
          }
        })
        req.body.imagePath = url
        next()
      } catch (error) {
        res.status(400).send({ error: error.message })
      }
    }
    else {
      next()
    }
  },
  userController.updateProfile
);


router.get("/api/user/:id", userController.getUser);


module.exports = router;
