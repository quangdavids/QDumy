const express= require('express')
const router = express.Router()
const { editUserProfile, getUserAnalytics, getUserProfile, getNumberOfUsers, getCompletedAndRemaining, getAllUsers } = require('../controller/userController')
const { authMiddleware } = require('../middlewares/authMiddlewares')

router.get('/total', getNumberOfUsers)
router.get('/info/:userId', getUserProfile)
router.get('/analytic/:userId', getUserAnalytics)
router.put('/edit/:userId',  editUserProfile)
router.get('/lesson-comparison/:userId', getCompletedAndRemaining)
router.get('/all', getAllUsers)


module.exports = router