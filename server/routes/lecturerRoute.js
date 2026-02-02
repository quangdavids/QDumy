const express = require("express");
const router = express.Router();

const { registerLecturer, getLecturer } = require("../controller/lecturerController")


router.post("/lecturer/:lecturerId", registerLecturer)
router.get("/lecturer/:lecturerId", getLecturer)
module.exports = router