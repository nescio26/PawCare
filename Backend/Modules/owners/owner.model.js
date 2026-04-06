import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Owner Name Is Required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone Number Is Required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postcode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;
