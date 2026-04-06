import Owner from "../owners/owner.model.js";
import Pet from "../pets/pet.model.js";
import Record from "../records/record.model.js";
import Visit from "../visits/visit.model.js";

export const getDashboardSummary = async () => {
  const [
    totalOwners,
    totalPets,
    totalVisits,
    completedVisits,
    cancelledVisits,
    activeOwners,
    activePets,
  ] = await Promise.all([
    Owner.countDocuments(),
    Pet.countDocuments(),
    Visit.countDocuments(),
    Visit.countDocuments({ status: "done" }),
    Visit.countDocuments({ status: "cancelled" }),
    Owner.countDocuments({ isActive: true }),
    Pet.countDocuments({ isActive: true }),
  ]);

  return {
    totalOwners,
    activeOwners,
    totalPets,
    activePets,
    totalVisits,
    completedVisits,
    cancelledVisits,
    pendingVisits: totalVisits - completedVisits - cancelledVisits,
  };
};
// getVisitTrends

export const getVisitTrends = async (period = "monthly", limit = 12) => {
  const formatMap = {
    daily: "%d-%m-%Y",
    weekly: "%Y-W%V",
    monthly: "%Y-%m",
  };

  const format = formatMap[period] ?? formatMap.monthly;

  const trends = await Visit.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format, date: "$visitDate", timezone: "UTC" },
        },
        total: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        waiting: { $sum: { $cond: [{ $eq: ["$status", "waiting"] }, 1, 0] } },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: Number(limit) },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        period: "$_id",
        total: 1,
        done: 1,
        cancelled: 1,
        waiting: 1,
      },
    },
  ]);

  return trends;
};

// getQueueStats

export const getQueueStats = async () => {
  const [waitTime, peakHours, statusBreakdown] = await Promise.all([
    // Approximate wait: updatedAt - createdAt for completed visits (minutes)
    Visit.aggregate([
      { $match: { status: "done" } },
      {
        $project: {
          waitMinutes: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              60000, // ms → minutes
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgWaitMinutes: { $avg: "$waitMinutes" },
          minWaitMinutes: { $min: "$waitMinutes" },
          maxWaitMinutes: { $max: "$waitMinutes" },
        },
      },
      {
        $project: {
          _id: 0,
          avgWaitMinutes: { $round: ["$avgWaitMinutes", 1] },
          minWaitMinutes: { $round: ["$minWaitMinutes", 1] },
          maxWaitMinutes: { $round: ["$maxWaitMinutes", 1] },
        },
      },
    ]),

    Visit.aggregate([
      {
        $group: {
          _id: { $hour: { date: "$visitDate", timezone: "UTC" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, hour: "$_id", count: 1 } },
    ]),

    Visit.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]),
  ]);

  return {
    waitTime: waitTime[0] ?? {
      avgWaitMinutes: 0,
      minWaitMinutes: 0,
      maxWaitMinutes: 0,
    },
    peakHours,
    statusBreakdown,
  };
};

// getTopBreedsAndDiagnoses

export const getTopBreedsAndDiagnoses = async (topN = 10) => {
  const [breeds, diagnoses, species] = await Promise.all([
    // breed is optional on Pet — filter empty values
    Pet.aggregate([
      { $match: { breed: { $exists: true, $nin: ["", null] } } },
      { $group: { _id: "$breed", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(topN) },
      { $project: { _id: 0, breed: "$_id", count: 1 } },
    ]),

    // diagnosis is optional on Record — filter empty values
    Record.aggregate([
      { $match: { diagnosis: { $exists: true, $nin: ["", null] } } },
      { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(topN) },
      { $project: { _id: 0, diagnosis: "$_id", count: 1 } },
    ]),

    // species is required on Pet — always reliable
    Pet.aggregate([
      { $group: { _id: "$species", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, species: "$_id", count: 1 } },
    ]),
  ]);

  return { breeds, diagnoses, species };
};

// getGrowthOverTime

export const getGrowthOverTime = async (months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const format = "%Y-%m";

  const [ownerGrowth, petGrowth] = await Promise.all([
    Owner.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format, date: "$createdAt", timezone: "UTC" },
          },
          newOwners: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", newOwners: 1 } },
    ]),

    Pet.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format, date: "$createdAt", timezone: "UTC" },
          },
          newPets: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", newPets: 1 } },
    ]),
  ]);

  // Merge both series on the month key
  const monthMap = {};

  for (const { month, newOwners } of ownerGrowth) {
    monthMap[month] = { month, newOwners, newPets: 0 };
  }
  for (const { month, newPets } of petGrowth) {
    if (monthMap[month]) {
      monthMap[month].newPets = newPets;
    } else {
      monthMap[month] = { month, newOwners: 0, newPets };
    }
  }

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};
