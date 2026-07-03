import { Schema, model, Document } from "mongoose";

export interface IVehicle extends Document {
  name: string;
  type: string;
  plateNumber: string;
  pricePerDay: number;
  status: "available" | "rented" | "maintenance";
  specs: {
    gearBox: string;
    fuel: string;
    doors: number;
    seats: number;
    distance: number;
  };
  equipment: {
    hasABS: boolean;
    hasAirBags: boolean;
    hasCruiseControl: boolean;
    hasAirConditioner: boolean;
  };
}

const VehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, enum: ["available", "rented", "maintenance"], default: "available" },
    specs: {
      gearBox: { type: String, default: "Automatic" },
      fuel: { type: String, default: "Petrol" },
      doors: { type: Number, default: 4 },
      seats: { type: Number, default: 5 },
      distance: { type: Number, default: 500 },
    },
    equipment: {
      hasABS: { type: Boolean, default: false },
      hasAirBags: { type: Boolean, default: false },
      hasCruiseControl: { type: Boolean, default: false },
      hasAirConditioner: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default model<IVehicle>("Vehicle", VehicleSchema);