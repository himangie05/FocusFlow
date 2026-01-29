import express from "express";
import bcrypt from "bcryptjs"; // Use bcryptjs to match your installation
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ REMOVED: const hashedPassword = await bcrypt.hash(password, 10);
    // We pass the plain password; the User Model's pre-save hook will hash it once.

    await User.create({
      name,
      email,
      password, // Pass plain text here
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare typed password with the single-hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret");
    res.json({ token, user: { name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;