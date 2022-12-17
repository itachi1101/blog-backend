const User = require("../models/user");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, imagePath } = req.body;
    const user = await User.create({ username, email, password, imagePath });
    const token = await user.generateAuthToken();
    res.status(201).json({
      id: user._id, username, email, imagePath,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message, SignUp: "failed" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.Login(email, req.body.password);
    const token = await user.generateAuthToken();
    const { password, createdAt, updatedAt, isAdmin, __v, liked, ...others } =
      user._doc;
    res.status(200).send({
      ...others,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message, login: "Failed" });
  }
};

