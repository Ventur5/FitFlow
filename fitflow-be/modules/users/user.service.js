const User = require("./users.schema");
const Trainer = require("../trainer/trainer.schema");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
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
  createUser,
  findUserByEmail,
  chooseTrainer
};
