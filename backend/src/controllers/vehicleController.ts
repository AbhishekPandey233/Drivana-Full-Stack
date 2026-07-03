// File path: C:\Users\ACER\OneDrive\Desktop\drivana_full_stack\backend\src\controllers\vehicleController.ts
import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicles/:id
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      res.status(404).json({ error: "The selected vehicle record could not be found." });
      return;
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Server error while retrieving vehicle details." });
  }
};

// @desc    Update a vehicle's configuration
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // Returns modified doc & enforces structural schema validations
    );

    if (!updatedVehicle) {
      res.status(404).json({ error: "The selected vehicle record could not be found." });
      return;
    }

    res.status(200).json(updatedVehicle);
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Plate Number configuration must be completely unique." });
      return;
    }
    res.status(500).json({ error: "Server error while saving vehicle updates." });
  }
};

// @desc    Delete/Decommission a vehicle asset 
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      res.status(404).json({ error: "The selected vehicle record could not be found." });
      return;
    }

    res.status(200).json({ message: "Asset deleted successfully." });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Server error while executing vehicle deletion." });
  }
};