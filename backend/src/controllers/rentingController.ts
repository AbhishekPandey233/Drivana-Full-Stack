import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Renting from "../models/Renting";
import Vehicle from "../models/Vehicle";

// @desc    Create a new car rental record
// @route   POST /api/rentings
export const createRenting = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    if (!vehicleId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ error: "All rental criteria fields are mandatory." });
    }

    // Verify vehicle availability
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status !== "available") {
      return res.status(400).json({ error: "Vehicle is no longer available for renting." });
    }

    // Create renting documentation
    const newRenting = new Renting({
      user: userId,
      vehicle: vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice
    });

    await newRenting.save();

    // Mark vehicle status as rented
    vehicle.status = "rented";
    await vehicle.save();

    return res.status(201).json({ success: true, renting: newRenting });
  } catch (error) {
    console.error("Error creating rental:", error);
    return res.status(500).json({ error: "Server error while saving the renting transaction." });
  }
};

// @desc    Get all rentings belonging ONLY to the authenticated user
// @route   GET /api/rentings/my-rentings
export const getMyRentings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    // Query exclusively by the specific user ID and populate vehicle parameters
    const myRentings = await Renting.find().where("user").equals(userId)
      .populate("vehicle")
      .sort({ createdAt: -1 });

    return res.status(200).json(myRentings);
  } catch (error) {
    console.error("Error getting user rentals:", error);
    return res.status(500).json({ error: "Server error while retrieving your renting logs." });
  }
};