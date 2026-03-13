const Course = require("../model/courseSchema");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const UserSession = require("../model/userSessionSchema");
const { generateToken } = require("../config/jwt");



const loginAsAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user by username
    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if user has admin role
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "User does not have admin permissions" });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create session
    const session = await UserSession.create({
      userId: admin._id,
    });

    // Generate token
    const token = generateToken(
      { userId: admin._id, sessionId: session._id },
      res,
    );

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        profileImg: admin.profileImg,
        role: admin.role,
      },
      token: token,
      sessionId: session._id,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Failed to login as admin", error: error.message || "Unknown error" });
  }
}

const getPendingCourses = async (req, res) => {
  try {
    const course = await Course.find({ status: "pending" }).populate([
      "lecturerId",
      "review",
      // "quiz",
      "lessons",
    ]);
    res
      .status(200)
      .json({ message: "Find courses successfully", course: course });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error in finding courses", error: err.message });
  }
};

const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        status: "published",
        isPublished: true,
      },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Course published successfully",
        status: course.status
        
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        status: "rejected"
       
      },
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Course rejected successfully",
        status: course.status,
        isPublished: course.isPublished,
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { getPendingCourses, publishCourse, rejectCourse, loginAsAdmin };
