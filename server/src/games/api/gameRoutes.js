const express = require('express');
const router = express.Router();
const GameService = require('../application/GameService');
const GamesController = require('./GamesController');
const gameRepository = require('../data/gameRepository');
const gamesController = new GamesController(new GameService(gameRepository));

router.get('/', gamesController.getGames);

module.exports = router;
