import { Schema, model, Document } from "mongoose";

export interface IRenting extends Document {
  user: Schema.Types.ObjectId;
  vehicle: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
}

const RentingSchema = new Schema<IRenting>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "completed", "cancelled"], 
      default: "confirmed" 
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    },
  },
  { timestamps: true }
);

export default model<IRenting>("Renting", RentingSchema);