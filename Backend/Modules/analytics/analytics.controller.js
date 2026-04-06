import {
  getDashboardSummary,
  getVisitTrends,
  getQueueStats,
  getTopBreedsAndDiagnoses,
  getGrowthOverTime,
} from "./analytics.service.js";

export const summary = async (req, res, next) => {
  try {
    const data = await getDashboardSummary();
    res.status(200).json({
      status: true,
      message: "Dashboard summary fetched",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const visitTrends = async (req, res, next) => {
  try {
    const { period = "monthly", limit = 12 } = req.query;

    const allowed = ["daily", "weekly", "monthly"];
    if (!allowed.includes(period)) {
      return res.status(400).json({
        status: false,
        message: `period must be one of: ${allowed.join(", ")}`,
      });
    }

    const data = await getVisitTrends(period, limit);
    res.status(200).json({
      status: true,
      message: "Visit trends fetched",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const queueStats = async (req, res, next) => {
  try {
    const data = await getQueueStats();
    res.status(200).json({
      status: true,
      message: "Queue statistics fetched",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const topBreedsAndDiagnoses = async (req, res, next) => {
  try {
    const { topN = 10 } = req.query;
    const data = await getTopBreedsAndDiagnoses(parseInt(topN));
    res.status(200).json({
      status: true,
      message: "Top breeds and diagnoses fetched",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

export const growthOverTime = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;
    const data = await getGrowthOverTime(parseInt(months));
    res.status(200).json({
      status: true,
      message: "Growth data fetched",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};
