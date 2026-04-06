import Visit from "../visits/visit.model.js";

export const getLiveQueue = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Visit.find({
    visitDate: { $gte: today },
    status: { $in: ["waiting", "in-progress"] },
  })
    .populate("pet", "name species breed")
    .populate("owner", "name phone")
    .populate("vet", "name")
    .sort({ queueNo: 1 });
};

export const resetQueue = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Visit.deleteMany({
    visitDate: { $lt: today },
    status: "waiting",
  });

  return { message: "Queue reset successfully" };
};
