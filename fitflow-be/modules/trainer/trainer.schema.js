const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    specialization: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: String,
    clients: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trainer', trainerSchema);