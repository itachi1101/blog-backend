const { Router } = require("express");
const authenticate = require("../middlewares/authMiddleware");
const postController = require("../controllers/postController");
const env = require("dotenv");
const cloudinary = require('cloudinary').v2
env.config()
const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// for creating a new post
router.post("/api/post/create", async (req, res, next) => {
  const file = req.files.image
  try {
    const { url } = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "post-photos/",
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
    res.status(400).send(error.message)
  }
}, postController.create)

// updating a  post
router.put("/api/post/:id", authenticate.auth, async (req, res, next) => {
  let file = null

  if (req["files"]) {
    file = req.files.image
  }
  const Currenturl = req.body.imagePublicId
  if (file) {
    await cloudinary.uploader.destroy(Currenturl)
    const { url } = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "post-photos/",
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
  }
  else {

    next()
  }

}, postController.updatePostById);


// deleting  a post
router.delete(
  "/api/post/:id", authenticate.auth, postController.deletePostById
);


// get recent posts
router.get("/api/post/recent", postController.getRecentPosts)

// get all posts 
router.get("/api/post/allposts", postController.getAllPosts);


/// get logged in user post  posts 
router.get(
  "/api/post/myposts/",
  authenticate.auth,
  postController.searchUserPosts
);

// single post 
router.get("/api/post/:id", postController.getPostById);

// post serach by user 
router.get("/api/post/public/:id", postController.getPostByIdFree)



module.exports = router;
