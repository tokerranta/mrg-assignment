const R = require("ramda");

class GamesController {
  constructor(gameService) {
    this.gameService = gameService;
    this.getGames = this.getGames.bind(this);
  }

  async getGames(req, res) {
    const result = await this.gameService.requestGames(req);

    if (result.isBadRequest) {
      res.status(400).json(result.errorMessage);
    }

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
