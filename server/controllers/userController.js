const User = require("../model/userSchema");
const Course = require("../model/courseSchema");
const courseCompletion = require("../model/courseCompletionSchema");
// Get all students
// const getAllUsers = async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.status(200).json(students);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getAllUsersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await User.find({ courses: courseId });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.params;

    const listOfOngoingCourses = await courseCompletion.countDocuments({
      userId: userId,
      completionStatus: "ongoing",
    });

    const listOfCompletedCourses = await courseCompletion.countDocuments({
      userId: userId,
      completionStatus: "completed",
    });

    const user = await User.findById(userId);

    const numOfEnrolledCourses = user.enrolledCourses.length;

    res
      .status(201)
      .json({
        message: `Number of course is ${numOfEnrolledCourses}`,
        courseNumber: numOfEnrolledCourses,
        ongoing: listOfOngoingCourses,
        completed: listOfCompletedCourses,
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await User.findById(userId).select("profileImg username email")

    res.status(200).json({message: "User found successfully", userData: userData})

  } catch (err) {
    res.status(500).json({message: "Server error", err: err.message})
  }
};

const editUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = ({ username, email, profileImg } = req.body);

    const isUserFound = await User.findById(userId);
    if (!isUserFound) {
      return res.status(404).json("Failed to find user");
    }
    if (req.files && req.files.profileImg) {
      const imageFile = req.files.profileImg[0];
      try {
        const imageUploadResult = await cloudinary.uploader.upload(
          imageFile.path,
          {
            folder: "profile_images",
            resource_type: "image",
          },
        );
        userData.profileImg = imageUploadResult.secure_url;
        fs.unlinkSync(imageFile.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload error", uploadError);
        return res.status(400).json({
          message: "Failed to upload course image.",
          error: uploadError,
        });
      }
    }
    const profileEdit = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    res.status(200).json({message: "Profile updated successfully", message: profileEdit});
  } catch (err) {
    res.status(400).json({message: "Failed to update profile", err: err.message});
  }
};

module.exports = {
  getUserProfile,
  getAllUsersByCourse,
  editUserProfile,
  getUserAnalytics,
};
