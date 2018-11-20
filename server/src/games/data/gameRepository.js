const R = require('ramda');

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

// const getAllGames = () => {
//   return allGames;
// };

// const filterByGameCollectionId = gameCollectionId => {
//   const containsGameCollectionId = game =>
//     !R.isNil(game.gameCollectionIds) &&
//     R.contains(gameCollectionId.toUpperCase(), game.gameCollectionIds.map(id => id.toUpperCase()));

//   return allGames.filter(containsGameCollectionId);
// };

// const filterByGameProvider = gameProvider =>
//   allGames.filter(game => game.gameProvider.toUpperCase() === gameProvider.toUpperCase());

// module.exports = {
//   getAllGames,
//   filterByGameCollectionId,
//   filterByGameProvider,
// };
