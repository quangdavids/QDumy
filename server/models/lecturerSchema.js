const mongoose = require('mongoose')
const {Schema} = mongoose;

const lecturerSchema = Schema({
    lecturerId: {type: Schema.Types.ObjectId, ref: "User"},
    lecturerName:{type: String},
    profilePic: String,
    biography: String,
    contact: [], // List of contact info
    ownedCourses: [{type: Schema.Types.ObjectId, ref:"Course"}],
    socialLinks: { // Social media links
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String
    },
    revenue: { type: Number, min: 0, default: 0 }
}, { timestamps: true })


module.exports = mongoose.model('Lecturer', lecturerSchema)
