const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imagePath: {
      type:String
    },

    liked: [],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.SECRET
  );
  user.token = token;
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt();
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
userSchema.statics.Login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const check = await bcrypt.compare(password, user.password);
    if (check) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

module.exports = mongoose.model("User", userSchema);
