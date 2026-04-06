// pet.controller.js
import * as petService from "./pet.service.js";
import { createPetSchema, updatePetSchema } from "./pet.validation.js";

export const createPet = async (req, res, next) => {
  try {
    const validated = createPetSchema.parse(req.body);
    const pet = await petService.createPet(validated);
    res.status(201).json({
      status: true,
      message: "Pet Registered Successfully",
      data: pet,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPets = async (req, res, next) => {
  try {
    const { search } = req.query;
    const pets = await petService.getAllPets(search);
    res.status(200).json({
      status: true,
      count: pets.length,
      data: pets,
    });
  } catch (err) {
    next(err);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    res.status(200).json({
      status: true,
      data: pet,
    });
  } catch (err) {
    next(err);
  }
};

export const getPetsByOwner = async (req, res, next) => {
  try {
    const pets = await petService.getPetsByOwner(req.params.ownerId);
    res.status(200).json({
      status: true,
      count: pets.length,
      data: pets,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const validated = updatePetSchema.parse(req.body);
    const pet = await petService.updatePet(req.params.id, validated);
    res.status(200).json({
      status: true,
      message: "Pet Updated Successfully",
      data: pet,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const result = await petService.deletePet(req.params.id);
    res.status(200).json({
      status: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
