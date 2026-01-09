const Course = require("../model/courseSchema");

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
        status: course.status,
        isPublished: course.isPublished,
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
        status: "rejected",
        isPublished: false,
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

module.exports = { getPendingCourses, publishCourse, rejectCourse };
