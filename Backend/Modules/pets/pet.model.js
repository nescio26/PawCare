import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pet Name Is Required"],
      trim: true,
    },
    species: {
      type: String,
      required: [true, "Species is Required"],
      enum: ["dog", "cat", "bird", "rabbit", "hamster", "reptile", "other"],
      set: (value) => value?.toLowerCase(),
    },
    breed: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
      set: (value) => value?.toLowerCase(),
    },
    dateOfBirth: {
      type: Date,
    },
    weight: {
      type: Number,
    },
    color: {
      type: String,
      trim: true,
    },
    microchipNo: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: [true, "Owner Is Required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
