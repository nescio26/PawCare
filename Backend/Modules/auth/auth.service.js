import jwt from "jsonwebtoken";
import { ENV } from "../../config/config.js";
import User from "./auth.model.js";

const signToken = (id, role) => {
  return jwt.sign({ id, role }, ENV.accessTokenSecret, {
    expiresIn: ENV.jwtExpiresIn,
  });
};

export const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email Already Registered");
  }

  const user = await User.create(data);
  const token = signToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) {
    throw new Error("Invalid Email or Password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  const token = signToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw new Error("User Not Found");
  }
  return user;
};
