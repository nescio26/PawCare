import Visit from "../visits/visit.model.js";
import Pet from "../pets/pet.model.js";
import Owner from "../owners/owner.model.js";
import User from "../auth/auth.model.js";
import Record from "../records/record.model.js";

export const getOverview = async () => {
  const [totalPets, totalOwners, totalVets, totalVisitsToday] =
    await Promise.all([
      Pet.countDocuments({ isActive: true }),
      Owner.countDocuments({ isActive: true }),
      User.countDocuments({ role: "vet", isActive: true }),
      Visit.countDocuments({
        visitDate: { $gte: new Date().setHours(0, 0, 0, 0) },
      }),
    ]);

  return {
    totalPets,
    totalOwners,
    totalVets,
    totalVisitsToday,
  };
};

export const getVisitStats = async (period = "week") => {
  const now = new Date();
  let startDate;

  if (period === "week") {
    startDate = new Date(now.setDate(now.getDate() - 7));
  } else if (period === "month") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  } else if (period === "year") {
    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
  }

  return await Visit.aggregate([
    {
      $match: {
        visitDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$visitDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getSpeciesStats = async () => {
  return await Pet.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$species",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

export const getVetStats = async () => {
  return await Visit.aggregate([
    {
      $match: {
        vet: { $exists: true },
        status: "done",
      },
    },
    {
      $group: {
        _id: "$vet",
        totalCases: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "vetInfo",
      },
    },
    { $unwind: "$vetInfo" },
    {
      $project: {
        name: "$vetInfo.name",
        email: "$vetInfo.email",
        totalCases: 1,
      },
    },
    { $sort: { totalCases: -1 } },
  ]);
};

export const getQueueStats = async () => {
  return await Visit.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

export const getTopDiagnoses = async () => {
  return await Record.aggregate([
    {
      $match: {
        diagnosis: { $exists: true, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$diagnosis",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
};
