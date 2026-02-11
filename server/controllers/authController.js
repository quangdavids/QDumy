const User = require("../model/userSchema.js");
const bcrypt = require("bcrypt");
const UserSession = require("../model/userSessionSchema.js")
const cloudinary = require("../config/cloudinary");
const { generateToken } = require("../config/jwt");
const admin = require("../config/firebase");

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = User.findOne({ email });
    if (user) {
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.authProvider = "google.com";
        user.profileImg = picture;
        user.IsEmailVerified = true;
      }
      await user.save();
    } else {
      user = new User({
        firebaseUid: uid,
        email: email,
        displayName: name,
        photoURL: picture,
        authProvider: "google.com",
        isEmailVerified: true,
      });
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    res.status(500).json({ error: $`Authentication failed ${err}` });
  }
};
const register = async (req, res) => {
  try {
    const { username, email, password, profileImg } = req.body;

    const checkEmail = await User.findOne({ email });
    // if (checkEmail) {
    //   res.status(400).json({ message: "Email already exists" });
    //   return;
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
      await user.save();

      const session = await UserSession.create({
        userId: user._id,
      });

      const token = generateToken(
        { userId: user._id, sessionId: session._id },
        res,
      );

      res.status(200).json({
        message: "User succesfully created",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImg: user.profileImg,
          authProvider: user.authProvider,
        },
        token: token,
      });
    } else {
      res.status(400).json("Invalid credentials");
    }
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Error in creating user", error: error.message || "Unknown error" });
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

    const session = await UserSession.create({
      userId: findUser._id,
    });

    const token = generateToken(
      { userId: findUser._id, sessionId: session._id },
      res,
    );

    res.status(200).json({
      message: "Successfully login",
      user: {
        _id: findUser._id,
        username: findUser.username,
        email: findUser.email,
        profileImg: findUser.profileImg,
        authProvider: findUser.authProvider,
      },
      token: token,
      sessionId: session._id,
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Failed to login", error: e.message || "Unknown error" });
  }
};

const logout = async (req, res) => {
  try {
    if (req.sessionId) {
      const session = await UserSession.findById(req.sessionId)

      if (session && !session.endedAt) {
        session.endedAt = new Date()
        session.duration = Math.floor(
          (session.endedAt - session.startedAt) / 1000
        );
        await session.save()
      }
    }
    res.cookie("jwt", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    console.log(e.message);
  }
};

// Refresh access token using refresh token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const refreshTokenFromCookie = req.cookies.refreshToken;

    const token = refreshToken || refreshTokenFromCookie;

    if (!token) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;

    // Generate new access token
    const { generateAccessToken } = require("../config/jwt");
    const newAccessToken = generateAccessToken(userId);

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  googleLogin,
};
