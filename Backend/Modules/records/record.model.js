import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: [true, "Visit is required"],
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [true, "Pet is required"],
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vet is required"],
    },
    symptoms: {
      type: String,
      trim: true,
    },
    diagnosis: {
      type: String,
      trim: true,
    },
    treatment: {
      type: String,
      trim: true,
    },
    prescription: [
      {
        medicine: String,
        dosage: String,
        duration: String,
      },
    ],
    weight: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
      },
    ],
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Record = mongoose.model("Record", recordSchema);
export default Record;
