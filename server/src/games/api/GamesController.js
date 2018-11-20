const R = require('ramda');

class GamesController {
  constructor(gameService) {
    this.gameService = gameService;
    this.getGames = this.getGames.bind(this);
  }

  getGames(req, res) {
    const result = this.gameService.requestGames(req);
    if (result.hasError) {
      res.status(500).json({ error: result.errorMessage });
    }
    if (result.isEmpty) {
      res.status(404);
    }

    res.json(result.games);
  }
}

module.exports = GamesController;
