import Owner from "./owner.model.js";

//createOwner
export const createOwner = async (data) => {
  const existing = await Owner.findOne({ phone: data.phone });
  if (existing) throw new Error("Phone Number Already Registered");

  return await Owner.create(data);
};
// getAllOwners

export const getAllOwners = async (search) => {
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  return await Owner.find(query).sort({ createAt: -1 });
};

// getOwnerById

export const getOwnerById = async (id) => {
  const owner = await Owner.findById(id);
  if (!owner || !owner.isActive) throw new Error("Owner Not Found");
  return owner;
};

// updateOwner

export const updateOwner = async (id, data) => {
  const owner = await Owner.findById(id);
  if (!owner || !owner.isActive) throw new Error("Owner Not Found");
  Object.assign(owner, data);
  await owner.save();
  return owner;
};

// deleteOwner

export const deleteOwner = async (id) => {
  const owner = await Owner.findById(id);
  if (!owner) throw new Error("Owner Not Found");

  owner.isActive = false;
  await owner.save();

  return { message: "Owner Deleted Successfully" };
};
