const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true, // Typically, this would be required
  },
  task: { type: String, required: true, minlength: 3 },
  date: { type: Date, default: () => new Date().toISOString().split('T')[0] },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
