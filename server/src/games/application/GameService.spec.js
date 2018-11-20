const expect = require('expect');
const { spy } = require('sinon');
const GameService = require('./GameService');

const mockedGame = {
  id: '1_can_2_can_ogs',
  gameProvider: 'OGS',
  gameCollectionIds: ['slots', 'allgames', 'All-Games-A-Z'],
  thumbnailUrl: 'http://testurl.com',
  width: 600,
  height: 800,
  friendlyName: '1-to-can',
};

const mockedRepoWithExistingGames = {
  filterByGameProvider: gameProvider => [mockedGame],
  filterByGameCollectionId: gameCollectionId => [mockedGame],
  getAllGames: () => [mockedGame],
};

const mockedRepoWithNoneExistingGames = {
  filterByGameProvider: gameProvider => [],
};

const ERROR_MESSAGE = 'Something went wrong';

const mockedRepoThrowsException = {
  filterByGameProvider: gameProvider => {
    throw new Error(ERROR_MESSAGE);
  },
  filterByGameCollectionId: gameCollectionId => {
    throw new Error(ERROR_MESSAGE);
  },
  getAllGames: () => {
    throw new Error(ERROR_MESSAGE);
  },
};

describe('GameService', () => {
  describe('When filtering by existing game provider', () => {
    const gameService = new GameService(mockedRepoWithExistingGames);
    const result = gameService.requestGames({ query: { gameProvider: 'OGS' } });

    it('then the result is successful', () => {
      expect(result.hasError).toEqual(false);
    });

    it('then the result is not empty', () => {
      expect(result.isEmpty).toEqual(false);
    });

    it('then the result contains one game list item', () => {
      expect(result.games.length).toEqual(1);
    });
  });

  describe('When filtering by none existing game provider', () => {
    const gameService = new GameService(mockedRepoWithNoneExistingGames);
    const result = gameService.requestGames({
      query: { gameProvider: 'NONE_EXISTING' },
    });

    it('then the result is successful', () => {
      expect(result.hasError).toEqual(false);
    });

    it('then the result is empty', () => {
      expect(result.isEmpty).toEqual(true);
    });

    it('then the result contains no game list items', () => {
      expect(result.games.length).toEqual(0);
    });
  });

  describe('When repository throws exception', () => {
    const gameService = new GameService(mockedRepoThrowsException);
    const result = gameService.requestGames({
      query: { gameProvider: 'EMPTY_PROVIDER' },
    });

    it('then the result has error', () => {
      expect(result.hasError).toEqual(true);
    });

    it('then the result is empty', () => {
      expect(result.isEmpty).toEqual(true);
    });

    it('then the result contains an error message', () => {
      expect(result.errorMessage).toEqual(ERROR_MESSAGE);
    });
  });

  describe('When filtering by existing game provider and game collection id', () => {
    const gameService = new GameService(mockedRepoWithExistingGames);
    const result = gameService.requestGames({
      query: { gameProvider: 'OGS', gameCollectionId: 'slots' },
    });

    it('then the result is successful', () => {
      expect(result.hasError).toEqual(false);
    });

    it('then the result is not empty', () => {
      expect(result.isEmpty).toEqual(false);
    });

    it('then the result has no error message', () => {
      expect(result.errorMessage).toBeUndefined();
    });

    it('then the result contains a game', () => {
      expect(result.games.length).toBe(1);
    });
  });

  describe('When there is no filter', () => {
    mockedRepoWithExistingGames.getAllGames = spy();
    const gameService = new GameService(mockedRepoWithExistingGames);
    const result = gameService.requestGames({
      query: {},
    });

    it('then it gets all games', () => {
      expect(mockedRepoWithExistingGames.getAllGames.calledOnce).toEqual(true);
    });
  });
});
