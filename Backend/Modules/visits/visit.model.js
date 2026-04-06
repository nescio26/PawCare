import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [true, "Pet Is Required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: [true, "Owner Is Required"],
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    queueNo: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["waiting", "in-progress", "done", "cancelled"],
      default: "waiting",
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
