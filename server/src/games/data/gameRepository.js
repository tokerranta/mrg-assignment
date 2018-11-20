const R = require("ramda");

class GameRepository {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  getAllGames() {
    return this.dataSource.allGames;
  }

  filterByGameProvider(gameProvider) {
    return this.dataSource.allGames.filter(
      game => game.gameProvider.toUpperCase() === gameProvider.toUpperCase()
    );
  }

  filterByGameCollectionId(gameCollectionId) {
    const containsGameCollectionId = game =>
      !R.isNil(game.gameCollectionIds) &&
      R.contains(
        gameCollectionId.toUpperCase(),
        game.gameCollectionIds.map(id => id.toUpperCase())
      );

    return this.dataSource.allGames.filter(containsGameCollectionId);
  }
}

module.exports = GameRepository;
