const Trainer = require('./trainer.schema');
const User = require("../users/users.schema");

const getAllTrainers = async () => {
    return await Trainer.find().populate('clients');
};

const createTrainer = async (trainerData) => {
    const trainer = new Trainer(trainerData);
    return await trainer.save();
};

const addClientToTrainer = async (trainerId, clientId) => {
    return await Trainer.findByIdAndUpdate(
        trainerId,
        { $addToSet: { clients: clientId } },
        { new: true }
    ).populate('clients');
};

const updateTrainer = async (id, updateData) => {
    return await Trainer.findByIdAndUpdate(id, updateData, { 
        new: true,          
        runValidators: true
    }).populate('clients');
};

const deleteTrainer = async (id) => {
    return await Trainer.findByIdAndDelete(id);
};

const chooseTrainer = async (userId, trainerId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { myTrainer: trainerId },
        { new: true }
    ).populate('myTrainer');

    await Trainer.findByIdAndUpdate(
        trainerId,
        { $addToSet: { clients: userId } }
    );

    return user;
};

module.exports = {
    getAllTrainers,
    createTrainer,
    addClientToTrainer,
    deleteTrainer,
    updateTrainer,
    chooseTrainer
};