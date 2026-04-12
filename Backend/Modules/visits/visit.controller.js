import * as visitService from "./visit.service.js";
import {
  createVisitSchema,
  updateVisitStatusSchema,
} from "./visit.validation.js";

// createVisit

export const createVisit = async (req, res, next) => {
  try {
    const validated = createVisitSchema.parse(req.body);
    const visit = await visitService.createVisit(validated);
    res.status(201).json({
      status: true,
      message: "Visit Created Successfully",
      data: visit,
    });
  } catch (err) {
    next(err);
  }
};

// getTodayVisits

export const getTodayVisits = async (req, res, next) => {
  try {
    const visits = await visitService.getTodayVisits();
    res.status(200).json({
      status: true,
      count: visits.length,
      data: visits,
    });
  } catch (err) {
    next(err);
  }
};

// getVisitById

export const getVisitById = async (req, res, next) => {
  try {
    const visit = await visitService.getVisitById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    res.status(200).json({
      success: true,
      data: visit,
    });
  } catch (err) {
    next(err);
  }
};

// getVisitByPet

export const getVisitsByPet = async (req, res, next) => {
  try {
    const visits = await visitService.getVisitsByPet(req.params.petId);
    res.status(200).json({
      status: true,
      count: visits.length,
      data: visits,
    });
  } catch (err) {
    next(err);
  }
};

// updateVisitStatus

export const updateVisitStatus = async (req, res, next) => {
  try {
    const validated = updateVisitStatusSchema.parse(req.body);
    const visit = await visitService.updateVisitStatus(
      req.params.id,
      validated,
    );
    res.status(200).json({
      status: true,
      message: "Visit Status Updated Successfully",
      data: visit,
    });
  } catch (err) {
    next(err);
  }
};

// cancelVisit

export const cancelVisit = async (req, res, next) => {
  try {
    const result = await visitService.cancelVisit(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
