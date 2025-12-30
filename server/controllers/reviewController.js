const Course = require("../models/course");
const Lecturer = require("../models/lecturer");
const User = require("../models/users");
const Review = require("../models/review");

const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("review");

    res
      .status(200)
      .json({ message: "Review fetched successfully", reviews: course.review });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Can't fetch reviews", error: err.message });
  }
};

const addReviewToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.params;
    const { content, rating } = req.body;
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    const newReview = await Review.create({ courseId ,userId, content, rating });

    course.review.push(newReview._id);
    user.review.push(newReview._id);
    await course.save();
    await user.save();
    const review = await Review.findById(newReview._id).populate(
      {path: 'userId',
      select: 'username'})

    res.status(200).json({ message: "Review added", review });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Review can't be created", error: err.message });
  }
};



const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body);
    res
      .status(200)
      .json({ message: "Review updated successfully", updatedReview });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in updating review", error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in deleting review", error: err.message });
  }
};

module.exports = {
  addReviewToCourse,
  editReview,
  deleteReview
}
