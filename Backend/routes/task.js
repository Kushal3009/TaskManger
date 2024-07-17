const express = require("express");
const router = express.Router();
const Note = require("../model/Task.js");
const auth = require("../middleware/fetchUser.js");
const { body, validationResult } = require("express-validator");

const ValidationRulesUpdateTask = [
  body("task", "Task must be at least 3 characters long")
    .isLength({ min: 3 })
    .notEmpty(),
];

// Add Task
router.post("/addTask", ValidationRulesUpdateTask, auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task } = req.body;
    const newNote = new Note({ user_id: req.user.id, task: task });
    await newNote.save();
    res.json(newNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get all Tasks
router.get("/getTask", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user_id: req.user.id });
    if (notes.length === 0) {
      return res.status(404).json({ message: "No Notes Found" });
    }
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Task
router.put("/updateTask/:id", ValidationRulesUpdateTask, auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task } = req.body;
    const id = req.params.id;

    let note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (note.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.task = task;
    await note.save();
    console.log("done")
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete Task
router.delete("/deleteTask/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    let note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
