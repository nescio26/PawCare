import Owner from "./owner.model.js";

export const createOwner = async (data) => {
  const existing = await Owner.findOne({ phone: data.phone });
  if (existing) throw new Error("Phone number already registered");

  return await Owner.create(data);
};

export const getAllOwners = async (search) => {
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  return await Owner.find(query).sort({ createdAt: -1 });
};

export const getOwnerById = async (id) => {
  const owner = await Owner.findById(id);
  if (!owner || !owner.isActive) throw new Error("Owner not found");
  return owner;
};

export const updateOwner = async (id, data) => {
  const owner = await Owner.findById(id);
  if (!owner || !owner.isActive) throw new Error("Owner not found");

  Object.assign(owner, data);
  await owner.save();
  return owner;
};

export const deleteOwner = async (id) => {
  const owner = await Owner.findById(id);
  if (!owner) throw new Error("Owner not found");

  owner.isActive = false;
  await owner.save();

  return { message: "Owner deleted successfully" };
};
