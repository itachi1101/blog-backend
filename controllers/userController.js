const User = require("../models/user");
const bcrypt = require("bcrypt");


// updating user profile
module.exports.updateProfile = async (req, res) => {
  const id = req.user._id
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });
    res.status(201).send(updatedUser)
  } catch (error) {
    res.status(400).send({error:error.message})
  }
  
};

// get user details
module.exports.getUser = async (req, res) => {
  try {
    const {username,imagePath}=await User.findById(req.params.id)
    res.status(200).send({username,imagePath})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

