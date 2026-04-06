import * as authService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.registerUser(validated);

    res.cookie("token", result.token, cookieOptions);
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.loginUser(validated);

    res.cookie("token", result.token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
