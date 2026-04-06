import User from "../auth/auth.model.js";

export const getAllUsers = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

// getUserById

export const getUserById = async (id) => {
  const user = await User.findById(id).select("password");
  if (!user) throw new Error("User Not Found");
  return user;
};

// updateUser

export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User Not Found");

  Object.assign(user, data);
  await user.save();

  return await User.findById(id).select("-password");
};

// deactiveUsers

export const deactiveUser = async (id, requestedId) => {
  if (id === requestedId.toString()) {
    throw new Error("You Cannot Deactive Your Own Account");
  }

  const user = await User.findById(id);
  if (!user) throw new Error("User Not Found");

  user.isActive = false;
  await user.save();

  return { message: "User Deactiveted Successfully" };
};

// changeUserPassword

export const changeUserPassword = async (id, password) => {
  const user = await User.findById(id).select("+password");
  if (!user) throw new Error("User Not Found");

  user.password = password;
  await user.save();

  return { message: "Password Changed Successfully" };
};
