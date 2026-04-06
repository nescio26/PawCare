import * as ownerService from "./owner.service.js";
import { createOwnerSchema, updateOwnerSchema } from "./owner.validation.js";

// createOwner

export const createOwner = async (req, res, next) => {
  try {
    const validated = createOwnerSchema.parse(req.body);
    const owner = await ownerService.createOwner(validated);
    res.status(201).json({
      status: true,
      message: " Owner Registered Successfully",
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

// getAllOwners

export const getAllOwners = async (req, res, next) => {
  try {
    const { search } = req.query;
    const owners = await ownerService.getAllOwners(search);
    res.status(200).json({
      status: true,
      count: owners.length,
      data: owners,
    });
  } catch (err) {
    next(err);
  }
};

// getOwnerById

export const getOwnerById = async (req, res, next) => {
  try {
    const owner = await ownerService.getOwnerById(req.params.id);
    res.status(200).json({
      status: true,
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

// updateOwner

export const updateOwner = async (req, res, next) => {
  try {
    const validated = updateOwnerSchema.parse(req.body);
    const owner = await ownerService.updateOwner(req.params.id, validated);
    res.status(200).json({
      status: true,
      message: "Owner Updated Successfully",
      data: owner,
    });
  } catch (err) {
    next(err);
  }
};

// deleteOwner

export const deleteOwner = async (req, res, next) => {
  try {
    const result = await ownerService.deleteOwner(req.params.id);
    res.status(200).json({
      status: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
