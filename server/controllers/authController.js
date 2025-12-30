const User = require("../models/users.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, email, password, profileImg } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.status(400).json({ message: "Email already exists" });

    // let imageUrl = "";
    // if (profileImg) {
    //   const uploadResponse = await cloudinary.uploader.upload(profileImg);
    //   imageUrl = uploadResponse.secure_url;
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profileImg,
      authProvider: "email",
    });

    if (user) {
      const token = generateToken(user._id, res);
      await user.save();
      res.status(200).json({ message: "User succesfully created", user: user, token: token });
    } else {
      res.status(400).json("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ message: "Error in creating user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(findUser._id, res);
    res.status(200).json({ message: "Successfully login", user: findUser, token: token });
  } catch (e) {
    res.status(500).json({ message: "Failed to login", error: e });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  register,
  login,
  logout
};



