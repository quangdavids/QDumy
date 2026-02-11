const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSessionSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number },
  },
  { timestamps: true },
);
module.exports = mongoose.model("UserSession", userSessionSchema);
