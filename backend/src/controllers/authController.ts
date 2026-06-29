import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../validators/authValidator';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate inputs with Zod
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }

    const { fullName, email, password } = validation.data;

    // Generate a unique username automatically from the email/name for login purposes
    const username = email.split('@')[0] + Math.floor(100 + Math.random() * 900);

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'User registered successfully!',
      username: newUser.username // Give back to the user so they see what username to log in with
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }

    const { username, password } = validation.data;

    // Check if user exists via email or username field
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare Hash Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, username: user.username }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};