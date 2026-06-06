import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fileName: String,
  extractedText: String,
  analysis: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);