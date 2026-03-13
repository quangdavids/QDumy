const Lecturer = require('../model/lecturerSchema');
const User = require('../model/userSchema')

 const getLecturer = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const lecturer = await Lecturer.findOne({lecturerId: lecturerId}).populate('ownedCourses');
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }
    res.status(200).json({ message: "Lecturer fetched successfully", lecturer });
  } catch (err) {  
    res.status(400).json({ message: "Failed to fetch lecturer", error: err.message });
  }
 }

 const registerLecturer = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const user = await User.findById(lecturerId)

    const newLecturer = new Lecturer({
      lecturerId: lecturerId,
      lecturerName: user.username,
      revenue: 0
    })
    await newLecturer.save()
    res.status(200).json({message: "Lecturer registered successfully", newLecturer})
  } catch (err) {
    res.status(400).json({message: "Failed to create lecturer", error: err.message})
  }
 }

const getLecturerData = async (req, res) => {
  try {
    const { userId } = req.params;
    const lecturer = await Lecturer.findOne({ lecturerId: userId }).populate(
      "ownedCourses",
    );
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }
    res
      .status(200)
      .json({ message: "Lecturer fetched successfully", lecturer: lecturer });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch lecturer", error: err.message });
  }
};



const editLecturerInfo = async (req, res) => {};

const getLecturerByCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lecturer = await Lecturer.findOne({ ownedCourses: courseId });
    res
      .status(200)
      .json({ message: "Lecturer found successfully", lecturer: lecturer._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch lecturer", error: err.message });
  }
};

const getTotalCompletionvsOngoing = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const ongoingCourses = await CourseCompletion.find({
      lecturerId: lecturerId,
      completionStatus: "ongoing"
    });
     const completedCourses = await CourseCompletion.find({
      lecturerId: lecturerId,
      completionStatus: "completed"
    });

    res.status(200).json({ message: "Fetch course completion successfully", 
      ongoing: ongoingCourses.length,
      completed: completedCourses.length
    })
  } catch (err) {
         res
      .status(500)
      .json({ message: "Failed to fetch course completion", error: err.message });
  }
};

const getDailyEnrollments = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const dailyEnrollments = await CourseCompletion.aggregate([
      {
        $match: { lecturerId: new mongoose.Types.ObjectId(lecturerId) }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }
          },
          totalEnrollments: { $sum: 1 }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    res.status(200).json({ message: "Fetch daily enrollments successfully", dailyEnrollments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily enrollments", error: err.message });
  }
};


module.exports = {
  getLecturer,
  registerLecturer,
  getLecturerData,
  getLecturerByCourses,
  getTotalCompletionvsOngoing,
  getDailyEnrollments
};