const express = require('express');
const router = express.Router();
const GameService = require('../application/GameService');
const GamesController = require('./GamesController');
const gameRepositoryFactory = require('../data/gameRepositoryFactory');
const gamesController = new GamesController(new GameService(gameRepositoryFactory.create()));

router.get('/', gamesController.getGames);

module.exports = router;
