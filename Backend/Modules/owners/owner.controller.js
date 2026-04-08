import * as ownerService from "./owner.service.js";
import { createOwnerSchema, updateOwnerSchema } from "./owner.validation.js";

export const createOwner = async (req, res, next) => {
  try {
    const validated = createOwnerSchema.parse(req.body);
    const owner = await ownerService.createOwner(validated);
    res.status(201).json({
      success: true,
      message: "Owner registered successfully",
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOwners = async (req, res, next) => {
  try {
    const { search } = req.query;
    const owners = await ownerService.getAllOwners(search);
    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (err) {
    next(err);
  }
};

export const getOwnerById = async (req, res, next) => {
  try {
    const owner = await ownerService.getOwnerById(req.params.id);
    res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOwner = async (req, res, next) => {
  try {
    const validated = updateOwnerSchema.parse(req.body);
    const owner = await ownerService.updateOwner(req.params.id, validated);
    res.status(200).json({
      success: true,
      message: "Owner updated successfully",
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOwner = async (req, res, next) => {
  try {
    const result = await ownerService.deleteOwner(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
