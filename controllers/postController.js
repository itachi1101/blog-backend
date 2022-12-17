
const Posts = require("../models/post");

// create a post
module.exports.create = async (req, res) => {
  try {
    const { title, description, draft, category, author, imagePath, authorId, authorImage } = req.body
    const post = await Posts.create({
      title, description, author, draft, imagePath, category, authorId, authorImage
    })
    res.status(201).send(post)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }

};
// update a post
module.exports.updatePostById = async (req, res) => {
  try {
    const updatedPost = await Posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete a post 
module.exports.deletePostById = async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Posts.findByIdAndDelete(_id);
    if (!post) return res.status(400).send();
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ err: error });
  }
};



// get logged in users post 
module.exports.searchUserPosts = async (req, res) => {
  try {
    const authorId = req.user._id;
    const posts = await Posts.find({ authorId });
    if (posts) {
      res.status(200).send(
        posts
      );
    } else {
      res.status(200).json({
        status: "posts not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: "no post found",
    });
  }
};


// get all posts 
module.exports.getAllPosts = async (req, res) => {
  try {
    const PAGE_SIZE = 6;
    const page = parseInt(req.query.page || "0");
    const total = await Posts.countDocuments({ draft: false });
    const posts = await Posts.find({ draft: false })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    if (!posts)
      res.status(404).json({ posts: "no posts found" });
    else {
      res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), posts });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




// get single post by id 
module.exports.getPostById = async (req, res) => {
  const _id = req.params.id;
  try {
    const allPosts = await Posts.findById(_id);
    if (!allPosts) res.status(404).json({ posts: "no posts found" });
    else {
      res.status(200).json({ data: allPosts });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};


// get post by id 
module.exports.getPostByIdFree = async (req, res) => {
  const _id = req.params.id;
  try {
    const posts = await Posts.find({ authorId: _id, draft: false })
    if (!posts)
      res.status(404).send({ data: "no post found" })
    else {
      res.status(200).send(posts)
    }
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}


// get recent posts
module.exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await Posts.find({ draft: false }).sort({ createdAt: -1 }).limit(6)
    res.status(200).send(posts)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}



