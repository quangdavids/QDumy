const Lesson = require("../model/lessonSchema");
const Course = require("../model/courseSchema");
const Lecturer = require("../model/lecturerSchema");
const User = require("../model/userSchema");
const Review = require("../model/reviewSchema");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");
// const uploadToCloudinary = () => {

// }
const addCourse = async (req, res) => {
  try {
    const {
      lecturerId,
      title,
      introduction,
      requirements,
      learningQualities,
      price,
      description,
      level,
    } = req.body;

    let courseImageUrl = "";
    let promotionalVideoUrl = "";

    if (req.files && req.files.courseImage) {
      const imageFile = req.files.courseImage[0];
      try {
        const imageUploadResult = await cloudinary.uploader.upload(
          imageFile.path,
          {
            folder: "course_thumbnails",
            resource_type: "image",
          }
        );
        courseImageUrl = imageUploadResult.secure_url;

        fs.unlinkSync(imageFile.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload error", uploadError);
        return res.status(400).json({
          message: "Failed to upload course image.",
          error: uploadError,
        });
      }
    }
    if (req.files && req.files.promotionalVideo) {
      const videoFile = req.files.promotionalVideo[0];
      try {
        const videoUploadResult = await cloudinary.uploader.upload(
          videoFile.path,
          {
            folder: "course_promotional_videos",
            resource_type: "video",
            allowed_formats: ["mp4", "mov", "avi"],
            chunk_size: 6000000,
            eager: [{ format: "mp4", quality: "auto" }],
            eager_async: true,
          }
        );
        promotionalVideoUrl = videoUploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error", uploadError);
        return res.status(400).json({ message: "Failed to upload video" });
      }
    }

    const newCourse = await Course.create({
      lecturerId: lecturerId,
      title: title,
      introduction: introduction,
      requirements,
      learningQualities,
      promotionalVideo: promotionalVideoUrl,
      courseImage: courseImageUrl,
      price,
      lessons: [],
      description,
      review: [],
      level: level,
      status: 'pending',
      isPublished
    });

    const course = await Course.findById(newCourse._id);
    // .populate([
    //     {path: "ownedByLecturer", select: "lecturerName" },
    // ])

    const lecturer = await Lecturer.findOne({ lecturerId: lecturerId });

    lecturer.ownedCourses.push(course);
    await lecturer.save();
    res.status(201).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating course", error: err.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = parseInt(req.query.skip) || 6;
    const limit = (page - 1) * limit;
    const courses = await Course.find()
      .populate([
        "lecturerId",
        "review",
        // "quiz",
        "lessons",
      ])
      .skip(skip)
      .limit(limit)
      .exec();
    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);
    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
      page,
      limit,
      totalPages,
      totalCourses,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

const getLatestCourses = async (req, res) => {
  try {
    const latestCourses = await Course.find().sort({ createdAt: -1 }).limit(5);
    // .populate("ownedByLecturer")

    res.status(200).json({
      message: "Latest Courses fetched successfully",
      courses: latestCourses,
    });
  } catch (err) {
    res
      .status(200)
      .json({ message: "Failed to fetch latest courses", error: err });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate([
      { path: "lessons" },
      { path: "lecturerId", model: "Lecturer", select: "username" },
    ]);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course fetched successfully", course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch course", error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      lecturerId,
      title,
      introduction,
      requirements,
      description,
      learningQualities,
      price,
      level,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseData = {
      lecturerId: lecturerId,
      title,
      introduction,
      requirements,
      description,
      learningQualities,
      price,
      level,
    };

    if (req.files && req.files.courseImage) {
      const imageFile = req.files.courseImage[0];
      try {
        const imageUploadResult = await cloudinary.uploader.upload(
          imageFile.path,
          {
            folder: "course_thumbnails",
            resource_type: "image",
          }
        );
        courseData.courseImage = imageUploadResult.secure_url;
        fs.unlinkSync(imageFile.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload error", uploadError);
        return res.status(400).json({
          message: "Failed to upload course image.",
          error: uploadError,
        });
      }
    }

    if (req.files && req.files.promotionalVideo) {
      const videoFile = req.files.promotionalVideo[0];
      try {
        const videoUploadResult = await cloudinary.uploader.upload(
          videoFile.path,
          {
            folder: "course_promotional_videos",
            resource_type: "video",
            allowed_formats: ["mp4", "mov", "avi"],
            chunk_size: 6000000,
            eager: [{ format: "mp4", quality: "auto" }],
            eager_async: true,
          }
        );
        courseData.promotionalVideo = videoUploadResult.secure_url;
        fs.unlinkSync(videoFile.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error", uploadError);
        return res.status(400).json({ message: "Failed to upload video" });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, {
      new: true,
    });
    // .populate(["lecturerId", "lessons"]);

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update course", error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete course", error: err.message });
  }
};

const getCoursesByLecturer = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const lecturer = await Lecturer.findById(lecturerId);

    const perPage = parseInt(req.query.limit) || 5;
    const pages = parseInt(req.query.page) || 1;
    const courses = await Course.find({ lecturerId: lecturerId })
      .populate(["lecturerId", "lessons"])
      .skip(perPage * (pages - 1))
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalCourse = await Course.countDocuments({ lecturerId: lecturerId });
    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
      currentPage: pages,
      totalPages: Math.ceil(totalCourse / perPage),
      totalCourse,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

const searchCourse = async (req, res) => {
  try {
    const { query, categories, level, priceType, minPrice, maxPrice } =
      req.query;
    // if (!query) {
    //     res.status(400).json({ message: "Search query not found" });
    //     return;
    // }

    const perPage = parseInt(req.query.limit) || 9;
    const pages = parseInt(req.query.page) || 1;

    let search = {};
    if (query) {
      search.$or = [
        { title: { $regex: query, $options: "i" } },
        { introduction: { $regex: query, $options: "i" } },
      ];
    }

    if (priceType == "Free") {
      search.price = { ...search.price, $in: 0 };
    }

    if (priceType == "Paid") {
      search.price = {...search.price, $gt: 0}
    }

    if (level) {
      const cats = Array.isArray(level) ? level : [level];
      search.level = { $in: cats };
    }

    if (minPrice) {
      search.price = { ...search.price, $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      search.price = { ...search.price, $lte: parseFloat(maxPrice) };
    }

    if (categories) {
      const cats = Array.isArray(categories) ? categories : [categories];
      search.category = { $in: cats };
    }

    const course = await Course.find(search)
      .populate({
        path: "review",
        select: "rating",
      })
      .skip(perPage * (pages - 1))
      .limit(perPage)
      .sort({ createdAt: -1 });
    const totalCourse = await Course.countDocuments(search);
    res.status(200).json({
      message: "Successfully found",
      course,
      currentPage: pages,
      totalPages: Math.ceil(totalCourse / perPage),
      totalCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "Search query error" });
  }
};

const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId format" });
    }

    const lessonsList = await Lesson.find({ courseId });

    res
      .status(200)
      .json({ message: "Successful fetching lesssons", lessonsList });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};
const addLessonToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    let videoData = {};

    // Check if course exists and initialize lessons array if needed
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Initialize lessons array if it doesn't exist
    if (!course.lessons) {
      course.lessons = [];
    }

    // Handle video upload if file exists
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "course-videos",
          allowed_formats: ["mp4", "mov", "avi"],
          chunk_size: 6000000,
          eager: [{ format: "mp4", quality: "auto" }],
          eager_async: true,
        });

        videoData = {
          videoUrl: result.secure_url,
          videoPublicId: result.public_id,
          duration: result.duration,
        };

        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Video upload failed",
          error: uploadError.message,
        });
      }
    }

    // Create new lesson
    const newLesson = await Lesson.create({
      courseId,
      title,
      content,
      ...videoData,
    });

    // Add lesson to course and save
    course.lessons.push(newLesson._id);
    await course.save();

    // Return populated lesson data
    const populatedLesson = await Lesson.findById(newLesson._id);

    res.status(201).json({
      message: "Lesson created successfully",
      lesson: populatedLesson,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      message: "Error creating lesson",
      error: error.message,
    });
  }
};

const updateLessonInCourse = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, content } = req.body;
    let videoData = {};

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Handle video upload if file is provided
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "course-videos",
          allowed_formats: ["mp4", "mov", "avi"],
          chunk_size: 6000000,
          eager: [{ format: "mp4", quality: "auto" }],
          eager_async: true,
        });

        // Delete old video if it exists
        if (lesson.videoPublicId) {
          try {
            await cloudinary.uploader.destroy(lesson.videoPublicId, {
              resource_type: "video",
            });
          } catch (deleteError) {
            console.warn("Failed to delete old video:", deleteError.message);
          }
        }

        videoData = {
          videoUrl: result.secure_url,
          videoPublicId: result.public_id,
          duration: result.duration,
        };

        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          message: "Video upload failed",
          error: uploadError.message,
        });
      }
    }

    // Update lesson with new data
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...videoData,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(500).json({
      message: "Error updating lesson",
      error: err.message,
    });
  }
};

// const deleteLessonInCourse = async (req,res) => {

// }

const searchLesson = async (req, res) => {
  try {
    const query = req.query;

    const lesson = await Lesson.find({
      title: { $regex: query, $option: "i" },
    });
    res
      .status(200)
      .json({ message: "Course found successfully", lessonTitle: lesson });
  } catch (err) {
    res.status(404).json({ message: "Course not found", error: err });
  }
};

const getLatestReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ courseId: courseId })
      .populate({ path: "userId", select: "username profileImg" })
      .limit(2)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Fetched reviews successfully", reviews: reviews });
  } catch (err) {
    res.status(404).json({ message: "Reviews not found", error: err });
  }
};

const getEnrolledCourses = async (req,res) => {
  try {
    const { userId } = req.params;
    const ownedCourses = await User.findById(userId).populate({
      path: "enrolledCourses",
      select: "courseImage title price lecturerId",
      populate: {
        path: "lecturerId",
        select: "lecturerName"
      }
    })

    res.status(200).json({ message: "Fetched courses successfully", 
      ownedCourses: ownedCourses.enrolledCourses,
     })
  } catch (err) {
     res.status(404).json({ message: "User courses not found", error: err });
  }
}


const checkCourseBoughtStatus = async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    const student = await User.findById(userId).populate({
      path: "enrolledCourses",
      select: "_id",
    });
    const course = await Course.findById(courseId);
    if (!student || !course) {
      return res.status(404).json({ message: "Student or course not found" });
    }

    for (let i = 0; i < student.enrolledCourses.length; i++) {
      if (student.enrolledCourses[i]._id.equals(course._id)) {
       return res.status(200).json({
          message: "Found course",
          course: course._id,
          length: student.enrolledCourses.length,
        });
        
      } else  {
        return res.status(404).json({ message: "Course not found" });
      }
    }

    // res.status(200).json({student: student.enrolledCourses[2]._id, course: course._id});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = {
  addCourse,
  getAllCourses,
  getLatestCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  checkCourseBoughtStatus,
  getCoursesByLecturer,
  searchCourse,
  addLessonToCourse,
  updateLessonInCourse,
  getCourseLessons,
  getLatestReviews,
  searchLesson,
  getEnrolledCourses
};
