import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Renting from "../models/Renting";
import Vehicle from "../models/Vehicle";

// Marks past-due active rentals as completed and frees up their vehicles.
// Called wherever vehicle/rental status is read, since nothing else flips
// a vehicle back to "available" once its rental period naturally ends.
export const releaseExpiredRentings = async (): Promise<void> => {
  const expired = await Renting.find({
    status: { $in: ["pending", "confirmed"] },
    endDate: { $lt: new Date() },
  });

  if (expired.length === 0) return;

  await Renting.updateMany(
    { _id: { $in: expired.map((r) => r._id) } },
    { $set: { status: "completed" } }
  );
  await Vehicle.updateMany(
    { _id: { $in: expired.map((r) => r.vehicle.toString()) }, status: "rented" },
    { $set: { status: "available" } }
  );
};

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
    await releaseExpiredRentings();
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
    await releaseExpiredRentings();
    const myRentings = await Renting.find().where("user").equals(userId)
      .populate("vehicle")
      .sort({ createdAt: -1 });

    return res.status(200).json(myRentings);
  } catch (error) {
    console.error("Error getting user rentals:", error);
    return res.status(500).json({ error: "Server error while retrieving your renting logs." });
  }
};

// @desc    Extend rental duration
// @route   PUT /api/rentings/:id/extend
export const extendRenting = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { additionalDays } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    if (!additionalDays || additionalDays <= 0) {
      return res.status(400).json({ error: "Additional days must be a positive number." });
    }

    const renting = await Renting.findById(id).populate("vehicle");
    if (!renting) {
      return res.status(404).json({ error: "Rental record not found." });
    }

    if (renting.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only extend your own rentals." });
    }

    const vehicle = renting.vehicle as any;
    const newEndDate = new Date(renting.endDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDays);

    const newTotalPrice = renting.totalPrice + (additionalDays * vehicle.pricePerDay);

    renting.endDate = newEndDate;
    renting.totalPrice = newTotalPrice;
    await renting.save();

    return res.status(200).json({ success: true, renting });
  } catch (error) {
    console.error("Error extending rental:", error);
    return res.status(500).json({ error: "Server error while extending rental." });
  }
};

// @desc    Decrease rental duration
// @route   PUT /api/rentings/:id/decrease
export const decreaseRenting = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { decreaseDays } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    if (!decreaseDays || decreaseDays <= 0) {
      return res.status(400).json({ error: "Decrease days must be a positive number." });
    }

    const renting = await Renting.findById(id).populate("vehicle");
    if (!renting) {
      return res.status(404).json({ error: "Rental record not found." });
    }

    if (renting.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only modify your own rentals." });
    }

    const vehicle = renting.vehicle as any;
    const newEndDate = new Date(renting.endDate);
    const proposedEndDate = new Date(renting.endDate);
    proposedEndDate.setDate(proposedEndDate.getDate() - decreaseDays);

    const startDate = new Date(renting.startDate);
    if (proposedEndDate <= startDate) {
      return res.status(400).json({ error: "Cannot decrease rental below start date." });
    }

    const dailyRate = vehicle.pricePerDay;

    newEndDate.setDate(newEndDate.getDate() - decreaseDays);
    const newTotalPrice = renting.totalPrice - (decreaseDays * dailyRate);

    renting.endDate = newEndDate;
    renting.totalPrice = Math.max(newTotalPrice, dailyRate);
    await renting.save();

    return res.status(200).json({ success: true, renting });
  } catch (error) {
    console.error("Error decreasing rental:", error);
    return res.status(500).json({ error: "Server error while decreasing rental." });
  }
};

// @desc    Cancel a rental
// @route   DELETE /api/rentings/:id/cancel
export const cancelRenting = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    const renting = await Renting.findById(id);
    if (!renting) {
      return res.status(404).json({ error: "Rental record not found." });
    }

    if (renting.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only cancel your own rentals." });
    }

    const vehicle = await Vehicle.findById(renting.vehicle);
    if (vehicle) {
      vehicle.status = "available";
      await vehicle.save();
    }

    await Renting.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Rental cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling rental:", error);
    return res.status(500).json({ error: "Server error while cancelling rental." });
  }
};

// @desc    Process a rental payment (marks rental as paid)
// @route   POST /api/rentings/:id/pay
// @note    Sensitive card details are validated in-transit but NEVER stored.
export const payRental = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { cardNumber, cvc, expiry, cardholderName } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access profile." });
    }

    // Process (validate) sensitive payment data without persisting it.
    if (!cardholderName || !cardNumber || !expiry || !cvc) {
      return res.status(400).json({ error: "All payment details are required." });
    }

    const renting = await Renting.findById(id).populate("vehicle");
    if (!renting) {
      return res.status(404).json({ error: "Rental record not found." });
    }

    if (renting.user.toString() !== userId) {
      return res.status(403).json({ error: "You can only pay for your own rentals." });
    }

    if (renting.paymentStatus === "paid") {
      return res.status(400).json({ error: "This rental has already been paid." });
    }

    // Mark the rental as paid. Card details are intentionally discarded.
    renting.paymentStatus = "paid";
    await renting.save();

    return res.status(200).json({ success: true, renting });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ error: "Server error while processing payment." });
  }
};

// @desc    Get all rentals (admin only)
// @route   GET /api/rentings/admin/all
export const getAllRentings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    await releaseExpiredRentings();
    const allRentings = await Renting.find()
      .populate("user", "fullName email")
      .populate("vehicle", "name type pricePerDay")
      .sort({ createdAt: -1 });

    return res.status(200).json(allRentings);
  } catch (error) {
    console.error("Error getting all rentals:", error);
    return res.status(500).json({ error: "Server error while retrieving all rentals." });
  }
};

// @desc    Admin cancel a rental
// @route   DELETE /api/rentings/admin/:id/cancel
export const adminCancelRenting = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const renting = await Renting.findById(id);
    if (!renting) {
      return res.status(404).json({ error: "Rental record not found." });
    }

    const vehicle = await Vehicle.findById(renting.vehicle);
    if (vehicle) {
      vehicle.status = "available";
      await vehicle.save();
    }

    await Renting.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Rental cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling rental:", error);
    return res.status(500).json({ error: "Server error while cancelling rental." });
  }
};