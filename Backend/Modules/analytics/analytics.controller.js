import * as analyticsService from "./analytics.service.js";

export const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getVisitStats = async (req, res, next) => {
  try {
    const { period } = req.query;
    const data = await analyticsService.getVisitStats(period);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getSpeciesStats = async (req, res, next) => {
  try {
    const data = await analyticsService.getSpeciesStats();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getVetStats = async (req, res, next) => {
  try {
    const data = await analyticsService.getVetStats();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getQueueStats = async (req, res, next) => {
  try {
    const data = await analyticsService.getQueueStats();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getTopDiagnoses = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopDiagnoses();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
