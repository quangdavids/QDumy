const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = mongoose.Schema(
  {
    title: {type: String},
    introduction: {type: String},
    lecturerId: { type: Schema.Types.ObjectId, ref: "Lecturer" },
    // ownedByLecturer: { type: Schema.Types.ObjectId, ref: "Lecturer"},
    courseImage: { type: String },
    requirements: [{ type: String }],
    learningQualities: [{ type: String }],
    promotionalVideo: { type: String },
    price: { type: Number, min: 0 },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    description: {type: String},
    categories: { type: String },
    level: { type: String },
    review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    status: { type: String, enum: ["In Progress", "Completed"] },
    studentsEnrol: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
