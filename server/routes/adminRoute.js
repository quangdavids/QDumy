const express = require("express");
const router = express.Router();
const {getPendingCourses, publishCourse, rejectCourse} = require('../controller/adminController')
const { isAdmin } = require('../middlewares/adminMiddlewares')

router.get('/admin/pending', isAdmin, getPendingCourses)
router.put('/admin/publish/:courseId',isAdmin, publishCourse)
router.put('/admin/reject/:courseId', isAdmin, rejectCourse)

module.exports = router