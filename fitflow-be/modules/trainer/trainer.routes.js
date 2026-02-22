const express = require('express');
const router = express.Router();
const trainerController = require('./trainer.controller');

router.get('/', trainerController.getTrainers);
router.post('/', trainerController.postTrainer);
router.post('/add-client', trainerController.assignClient);
router.delete('/:id', trainerController.removeTrainer);
router.put('/:id', trainerController.putTrainer);

module.exports = router;