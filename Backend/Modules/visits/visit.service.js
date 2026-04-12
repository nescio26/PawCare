import Visit from "./visit.model.js";
import Pet from "../pets/pet.model.js";
import Owner from "../owners/owner.model.js";
import { emitQueueUpdate } from "../../sockets/queue.socket.js";
// getNextQueueNo

const getNextQueueNo = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastVisit = await Visit.findOne({
    visitDate: { $gte: today },
  }).sort({ queueNo: -1 });

  return lastVisit ? lastVisit.queueNo + 1 : 1;
};

// createVisit

export const createVisit = async (data) => {
  const pet = await Pet.findById(data.pet);
  if (!pet || !pet.isActive) throw new Error("Pet not found");

  const owner = await Owner.findById(data.owner);
  if (!owner || !owner.isActive) throw new Error("Owner not found");

  const queueNo = await getNextQueueNo();

  const visit = await Visit.create({
    ...data,
    queueNo,
  });

  const populated = await Visit.findById(visit._id)
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name");

  emitQueueUpdate();
  return populated;
};

// getTodayVisits

export const getTodayVisits = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Visit.find({
    visitDate: { $gte: today },
  })
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name")
    .sort({ queueNo: 1 });
};

// getVisitById

export const getVisitById = async (id) => {
  const visit = await Visit.findById(id)
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name");

  if (!visit) throw new Error("Visit not found");
  return visit;
};

// getVisitByPet

export const getVisitsByPet = async (petId) => {
  return await Visit.find({ pet: petId })
    .populate("vet", "name")
    .sort({ createdAt: -1 });
};

// updateVisitStatus

export const updateVisitStatus = async (id, data) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new Error("Visit not found");

  Object.assign(visit, data);
  await visit.save();

  const populated = await Visit.findById(id)
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name");

  emitQueueUpdate();
  return populated;
};

// cancelVisit

export const cancelVisit = async (id) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new Error("Visit not found");

  visit.status = "cancelled";
  await visit.save();

  emitQueueUpdate();
  return { message: "Visit cancelled successfully" };
};
