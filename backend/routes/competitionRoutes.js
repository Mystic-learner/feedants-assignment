const express = require('express');
const router = express.Router();
const { getCompetitionById, getLatestCompetition, registerForCompetition } = require('../controllers/competitionController');

router.get('/latest', getLatestCompetition);
router.get('/:id', getCompetitionById);
router.post('/:id/register', registerForCompetition);

module.exports = router;
