import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. GET ALL TASKS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE TASK - Updated to include category and initial progress
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate, category, progress } = req.body;

    const task = new Task({
      title,
      category: category || "Personal",
      progress: progress || 0,
      dueDate: dueDate ? new Date(dueDate) : null, 
      user: req.userId,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. UPDATE TASK - Fixed to ensure numbers are handled correctly
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // We explicitly extract progress to ensure it's a Number
    const updates = req.body;
    if (updates.progress !== undefined) {
      updates.progress = Number(updates.progress);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true } // runValidators ensures it checks your Model types
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;