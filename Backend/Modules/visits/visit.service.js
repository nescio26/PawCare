import mongoose from "mongoose";
import Visit from "./visit.model.js";
import Pet from "../pets/pet.model.js";
import Owner from "../owners/owner.model.js";
import { emitQueueUpdate } from "../../sockets/queue.socket.js";

/* =========================
   ERROR HELPER
========================= */
const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/* =========================
   QUEUE NUMBER
========================= */
const getNextQueueNo = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastVisit = await Visit.findOne({
    visitDate: { $gte: today },
  }).sort({ queueNo: -1 });

  return lastVisit ? lastVisit.queueNo + 1 : 1;
};

/* =========================
   CREATE VISIT
========================= */
export const createVisit = async (data) => {
  const pet = await Pet.findById(data.pet);
  if (!pet || !pet.isActive) {
    throw createError("Pet not found", 404);
  }

  const owner = await Owner.findById(data.owner);
  if (!owner || !owner.isActive) {
    throw createError("Owner not found", 404);
  }

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

/* =========================
   GET TODAY VISITS
========================= */
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

/* =========================
   GET VISIT BY ID
========================= */
export const getVisitById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid visit ID", 400);
  }

  const visit = await Visit.findById(id)
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name");

  if (!visit) {
    throw createError("Visit not found", 404);
  }

  return visit;
};

/* =========================
   GET VISITS BY PET
========================= */
export const getVisitsByPet = async (petId) => {
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    throw createError("Invalid pet ID", 400);
  }

  return await Visit.find({ pet: petId })
    .populate("vet", "name")
    .sort({ createdAt: -1 });
};

/* =========================
   UPDATE VISIT STATUS
========================= */
export const updateVisitStatus = async (id, data) => {
  const visit = await Visit.findById(id);
  if (!visit) {
    throw createError("Visit not found", 404);
  }

  Object.assign(visit, data);
  await visit.save();

  const populated = await Visit.findById(id)
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name");

  emitQueueUpdate();
  return populated;
};

/* =========================
   CANCEL VISIT
========================= */
export const cancelVisit = async (id) => {
  const visit = await Visit.findById(id);
  if (!visit) {
    throw createError("Visit not found", 404);
  }

  visit.status = "cancelled";
  await visit.save();

  emitQueueUpdate();

  return { message: "Visit cancelled successfully" };
};
