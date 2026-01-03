const express = require("express");
const router = express.Router();
const {getReviewsByCourse,addReviewToCourse, editReview, deleteReview} = require("../controllers/reviewController")

router.get("/reviews/:courseId", getReviewsByCourse);
router.post("/review/:courseId/:userId", addReviewToCourse);
router.put("/review/:reviewId", editReview);
router.delete("/review/:reviewId", deleteReview);

module.exports = router

