// backend/src/controllers/userController.ts
import { Request, Response } from "express";
// FIX: Add curly braces around User to match your named export statement!
import { User } from "../models/User"; 

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // 1. Debug check: Ensure the model is loaded correctly
    if (!User || typeof User.find !== "function") {
      console.error("❌ ERROR: User model is undefined or not loaded properly. Check your import statement!");
      return res.status(500).json({ error: "Model import configuration issue." });
    }

    const users = await User.find({}, "-password"); 
    
    // 2. Terminal Log: See what MongoDB actually responds with
    console.log(`🍏 MongoDB found ${users.length} users successfully.`);

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Catch Block Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found to delete" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Catch Block Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};