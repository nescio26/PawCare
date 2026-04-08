import Owner from "../owners/owner.model.js";
import Pet from "./pet.model.js";

// createPet
export const createPet = async (data) => {
  const owner = await Owner.findById(data.owner);
  if (!owner || !owner.isActive) throw new Error("Owner Not Found");

  return await Pet.create(data);
};

// getAllPets
export const getAllPets = async (search) => {
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { breed: { $regex: search, $options: "i" } },
      { microchipNo: { $regex: search, $options: "i" } },
    ];
  }

  return await Pet.find(query)
    .populate("owner", "name phone email")
    .sort({ createdAt: -1 });
};

// getPetById
export const getPetById = async (id) => {
  const pet = await Pet.findById(id).populate("owner", "name phone email");

  if (!pet || !pet.isActive) throw new Error("Pet Not Found");
  return pet;
};

// getPetsByOwner
export const getPetsByOwner = async (ownerId) => {
  const owner = await Owner.findById(ownerId);
  if (!owner || !owner.isActive) throw new Error("Owner Not Found");

  return await Pet.find({ owner: ownerId, isActive: true })
    .populate("owner", "name phone email")
    .sort({ createdAt: -1 });
};

// updatePet
export const updatePet = async (id, data) => {
  const pet = await Pet.findById(id);
  if (!pet || !pet.isActive) throw new Error("Pet Not Found");

  Object.assign(pet, data);
  await pet.save();
  return pet;
};

// deletePet
export const deletePet = async (id) => {
  const pet = await Pet.findById(id);
  if (!pet) throw new Error("Pet Not Found");

  pet.isActive = false;
  await pet.save();

  return { message: "Pet Deleted Successfully" };
};
