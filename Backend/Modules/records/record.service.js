import Visit from "../visits/visit.model.js";
import Record from "./record.model.js";

// createRecord

export const createRecord = async (data) => {
  const visit = await Visit.findById(data.visit);
  if (!visit) throw new Error("Visit not found");

  const existing = await Record.findOne({ visit: data.visit });
  if (existing) throw new Error("Record already exists for this visit");

  const record = await Record.create(data);

  return await Record.findById(record._id) // ← this populate call
    .populate("pet", "name species breed")
    .populate("vet", "name email")
    .populate("visit", "queueNo visitDate status");
};
// getRecordsByPet

export const getRecordsByPet = async (petId) => {
  return await Record.find({ pet: petId })
    .populate("vet", "name")
    .populate("visit", "queueNo visitDate status");
};

// getRecordById

export const getRecordById = async (id) => {
  const record = await Record.findById(id)
    .populate("pet", "name species breed")
    .populate("vet", "name email")
    .populate("visit", "queueNo visitDate status");

  if (!record) throw new Error("Record Not Found");
  return record;
};

// getRecordByVisit

export const getRecordByVisit = async (visitId) => {
  const record = await Record.findOne({ visit: visitId })
    .populate("pet", "name species breed")
    .populate("vet", "name")
    .populate("visit", "queueNo visitDate status");

  if (!record) throw new Error("Record Not Found For This Visit");
  return record;
};

// updateRecord

export const updateRecord = async (id, data) => {
  const record = await Record.findById(id);
  if (!record) throw new Error("Record not found");

  Object.assign(record, data);
  await record.save();

  return await Record.findById(id)
    .populate("pet", "name species breed")
    .populate("vet", "name email")
    .populate("visit", "queueNo visitDate status");
};

// addAttachment

export const addAttachment = async (id, file) => {
  const record = await Record.findById(id);
  if (!record) throw new Error("Record Not Found");

  record.attachments.push({
    filename: file.originalname,
    path: file.path,
    mimetype: file.mimetype,
  });

  await record.save();
  return record;
};
