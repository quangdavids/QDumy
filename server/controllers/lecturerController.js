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

 const getStudents = async (req,res) => {
    
 }

module.exports = {
  getLecturer, 
  registerLecturer
}