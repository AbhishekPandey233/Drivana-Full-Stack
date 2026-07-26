import { Router } from "express";
import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import {
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController";
import Vehicle from "../models/Vehicle";
import { requireAdmin } from "../middleware/adminMiddleware";
import { releaseExpiredRentings } from "../controllers/rentingController";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../../public/images");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${basename}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const persistImageUrl = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    req.body.image = `/uploads/images/${req.file.filename}`;
  }
  next();
};

// multer leaves multipart text fields as raw strings, but specs/equipment
// are nested objects sent as JSON strings — parse them back before saving.
const parseJsonFields = (req: Request, res: Response, next: NextFunction) => {
  for (const field of ["specs", "equipment"]) {
    if (typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        // leave as-is; schema validation will reject it
      }
    }
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    await releaseExpiredRentings();
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Failed to read vehicle collection database records." });
  }
});

router.post("/", requireAdmin, upload.single("image"), parseJsonFields, async (req, res) => {
  try {
    const vehicleData: any = { ...req.body };
    if (req.file) {
      vehicleData.image = `/uploads/images/${req.file.filename}`;
    }
    const newVehicle = new Vehicle(vehicleData);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Plate Number configuration must be completely unique." });
    }
    res.status(500).json({ error: "An unexpected asset database build error occurred." });
  }
});

router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  persistImageUrl,
  parseJsonFields,
  async (req, res) => {
    await updateVehicle(req, res);
  }
);

router.get("/:id", getVehicleById);
router.delete("/:id", requireAdmin, deleteVehicle);

export default router;
