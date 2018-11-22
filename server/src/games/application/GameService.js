const R = require("ramda");
const GameListItem = require("./GameListItem");
const RequestGamesResult = require("./RequestGamesResult");
const Joi = require("joi");

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

  async _validateQuery(query) {
    const schema = {
      gameProvider: Joi.string(),
      gameCollectionId: Joi.string()
    };
    try {
      await Joi.validate(query, schema);
      return { isBadRequest: false };
    } catch (error) {
      return {
        isBadRequest: true,
        error: error.details
          .map(e => `${e.context.key} is not supported`)
          .join(" ")
      };
    }
  }

  _getGamesByCollectionIdAndProvider(gameCollectionId, gameProvider) {
    return this.gameRepository
      .filterByGameCollectionId(gameCollectionId)
      .filter(
        game => game.gameProvider.toUpperCase() === gameProvider.toUpperCase()
      )
      .map(this._mapToGameListItem);
  }

  _getGamesByCollectionId(gameCollectionId) {
    return this.gameRepository
      .filterByGameCollectionId(gameCollectionId)
      .map(this._mapToGameListItem);
  }

  _getGamesByProvider(gameProvider) {
    return this.gameRepository
      .filterByGameProvider(gameProvider)
      .map(this._mapToGameListItem);
  }
  async requestGames({ query = {} }) {
    const { gameCollectionId, gameProvider } = query;
    const queryValidationResult = await this._validateQuery(query);

    if (queryValidationResult.isBadRequest) {
      return RequestGamesResult.badRequest(
        new Error(queryValidationResult.error)
      );
    }

    try {
      const queryByCollectionIdAndProvider =
        !R.isNil(gameCollectionId) && !R.isNil(gameProvider);
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
        const gamesByCollectionId = this._getGamesByCollectionId(
          gameCollectionId
        );
        return RequestGamesResult.success(gamesByCollectionId);
      }

      if (queryByGameProvider) {
        const gamesByProvider = this._getGamesByProvider(gameProvider);
        return RequestGamesResult.success(gamesByProvider);
      }

      const gamesByNoFilter = this.gameRepository
        .getAllGames()
        .map(this._mapToGameListItem);

      return RequestGamesResult.success(gamesByNoFilter);
    } catch (error) {
      // Log error
      return RequestGamesResult.error(error);
    }
  }
}

module.exports = GameService;
