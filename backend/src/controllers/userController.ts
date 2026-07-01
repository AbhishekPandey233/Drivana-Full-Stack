import { Request, Response } from "express";
import { User } from "../models/User"; 
import bcrypt from "bcryptjs";

const toSafeUser = (user: {
  _id: unknown;
  fullName: string;
  email: string;
  username: string;
  role: string;
}) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  username: user.username,
  role: user.role,
});

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!User || typeof User.find !== "function") {
      console.error("❌ ERROR: User model is undefined or not loaded properly.");
      return res.status(500).json({ error: "Model import configuration issue." });
    }
    const users = await User.find({}, "-password"); 
    console.log(`🍏 MongoDB found ${users.length} users successfully.`);
    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Catch Block Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Catch Block Error fetching user by id:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create a new user (Admin Only Action)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, username, password, role } = req.body;

    // Validate inputs
    if (!fullName || !email || !username || !password || !role) {
      return res.status(400).json({ error: "All fields are required, including role." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already in use." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Return created user without password field
    const userResponse = newUser.toObject() as {
      password?: string;
      _id: unknown;
      fullName: string;
      email: string;
      username: string;
      role: string;
    };
    delete userResponse.password;

    return res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("❌ Catch Block Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, username, role, password } = req.body;

    if (!fullName || !email || !username || !role) {
      return res.status(400).json({ error: "Full name, email, username, and role are required." });
    }

    const duplicateUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ email }, { username }]
    });

    if (duplicateUser) {
      return res.status(400).json({ error: "Username or Email already in use." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.fullName = fullName;
    user.email = email;
    user.username = username;
    user.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const savedUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: savedUser
    });
  } catch (error) {
    console.error("❌ Catch Block Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
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