// File path: C:\Users\ACER\OneDrive\Desktop\drivana_full_stack\backend\src\routes\vehicleRoutes.ts
import { Router } from "express";
import { 
  getVehicleById, 
  updateVehicle, 
  deleteVehicle 
} from "../controllers/vehicleController";
import Vehicle from "../models/Vehicle";

const router = Router();

// GET all vehicles for management overview dashboard view
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Failed to read vehicle collection database records." });
  }
});

// POST to create a brand new fleet asset entry
router.post("/", async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Plate Number configuration must be completely unique." });
    }
    res.status(500).json({ error: "An unexpected asset database build error occurred." });
  }
});

// Dynamic routes linked directly to controller module handlers
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;