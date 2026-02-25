const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: false },
  surname: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  birthdate: { type: Date, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  diet: { type: String, required: true },
  goal: { type: String, required: false },
  bmi: { type: Number }, 
  category: { type: String }, 
  exercises: { type: [String] },
  nutrition: { type: [String] },
  myTrainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);