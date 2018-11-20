const R = require('ramda');
const GameListItem = require('./GameListItem');
const RequestGamesResult = require('./RequestGamesResult');

class GameService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
  }

  _mapToGameListItem(game) {
    return new GameListItem(
      game.id,
      game.gameProvider,
      game.gameCollectionIds,
      game.thumbnailUrl,
      game.width,
      game.height,
      game.friendlyName
    );
  }

  _getGamesByCollectionIdAndProvider(gameCollectionId, gameProvider) {
    return this.gameRepository
      .filterByGameCollectionId(gameCollectionId)
      .filter(game => game.gameProvider.toUpperCase() === gameProvider.toUpperCase())
      .map(this._mapToGameListItem);
  }

  _getGamesByCollectionId(gameCollectionId) {
    return this.gameRepository
      .filterByGameCollectionId(gameCollectionId)
      .map(this._mapToGameListItem);
  }

  _getGamesByProvider(gameProvider) {
    return this.gameRepository.filterByGameProvider(gameProvider).map(this._mapToGameListItem);
  }
  requestGames({ query = {} }) {
    const { gameCollectionId, gameProvider } = query;
    try {
      const queryByCollectionIdAndProvider = !R.isNil(gameCollectionId) && !R.isNil(gameProvider);
      const queryByGameProvider = !R.isNil(gameProvider);
      const queryByCollectionId = !R.isNil(gameCollectionId);

      if (queryByCollectionIdAndProvider) {
        const filteredGames = this._getGamesByCollectionIdAndProvider(
          gameCollectionId,
          gameProvider
        );
        return RequestGamesResult.success(filteredGames);
      }

      if (queryByCollectionId) {
        const gamesByCollectionId = this._getGamesByCollectionId(gameCollectionId);
        return RequestGamesResult.success(gamesByCollectionId);
      }

      if (queryByGameProvider) {
        const gamesByProvider = this._getGamesByProvider(gameProvider);
        return RequestGamesResult.success(gamesByProvider);
      }

      const gamesByNoFilter = this.gameRepository.getAllGames().map(this._mapToGameListItem);

      return RequestGamesResult.success(gamesByNoFilter);
    } catch (error) {
      // Log error
      return RequestGamesResult.error(error);
    }
  }
}

module.exports = GameService;
