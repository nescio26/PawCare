import * as recordService from "./record.service.js";
import { createRecordSchema, updateRecordSchema } from "./record.validation.js";

// createRecord

export const createRecord = async (req, res, next) => {
  try {
    const validated = createRecordSchema.parse(req.body);
    const record = await recordService.createRecord(validated);
    res.status(201).json({
      status: true,
      message: "Medical Record Created Successfully",
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// getRecordsByPet

export const getRecordsByPet = async (req, res, next) => {
  try {
    const records = await recordService.getRecordsByPet(req.params.petId);
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

// getRecordById

export const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// getRecordByVisit

export const getRecordByVisit = async (req, res, next) => {
  try {
    const record = await recordService.getRecordByVisit(req.params.visitId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "No record found for this visit",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};
// updateRecord

export const updateRecord = async (req, res, next) => {
  try {
    const validated = updateRecordSchema.parse(req.body);
    const record = await recordService.updateRecord(req.params.id, validated);
    res.status(200).json({
      status: true,
      message: "Record Updated Successfully",
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

// addAttachment

export const addAttachment = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("No File Uploaded");
    const record = await recordService.addAttachment(req.params.id, req.file);
    res.status(200).json({
      success: true,
      message: "Attachment Added Successfully",
      data: record,
    });
  } catch (err) {
    next(err);
  }
};
