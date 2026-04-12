import User from "../auth/auth.model.js";
import * as userService from "./user.service.js";
import { changePasswordSchema, updateUserSchema } from "./user.validation.js";

// getAllUsers

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// getUserById

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// updateUser

export const updateUser = async (req, res, next) => {
  try {
    const validated = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.params.id, validated);
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// deactivateUser

export const deactivateUser = async (req, res, next) => {
  try {
    const result = await userService.deactiveUsers(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

// changeUserPassword

export const changeUserPassword = async (req, res, next) => {
  try {
    const validated = changePasswordSchema.parse(req.body);
    const result = await userService.changeUserPassword(
      req.params.id,
      validated.password,
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export const getVets = async (req, res, next) => {
  try {
    const vets = await User.find({ role: "vet", isActive: true })
      .select("name email role")
      .sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: vets,
    });
  } catch (err) {
    next(err);
  }
};
