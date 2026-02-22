const trainerService = require('./trainer.service');

const getTrainers = async (req, res) => {
    try {
        const trainers = await trainerService.getAllTrainers();
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postTrainer = async (req, res) => {
    try {
        const newTrainer = await trainerService.createTrainer(req.body);
        res.status(201).json(newTrainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const assignClient = async (req, res) => {
    try {
        const { trainerId, clientId } = req.body;
        const updated = await trainerService.addClientToTrainer(trainerId, clientId);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeTrainer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await trainerService.deleteTrainer(id);
        if (!deleted) return res.status(404).json({ message: "Trainer non trovato" });
        res.status(200).json({ message: "Trainer eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const putTrainer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTrainer = await trainerService.updateTrainer(id, req.body);
        
        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer non trovato" });
        }
        
        res.status(200).json(updatedTrainer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTrainers,
    postTrainer,
    assignClient,
    removeTrainer,
    putTrainer
};
