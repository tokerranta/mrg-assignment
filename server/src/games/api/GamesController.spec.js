const expect = require('expect');
const { spy } = require('sinon');
const GamesController = require('./GamesController');
const GameListItem = require('../application/GameListItem');
const RequestGamesResult = require('../application/RequestGamesResult');

describe('GamesController', () => {
  describe('When GameService returns an error result', () => {
    const gameService = {
      requestGames: req => RequestGamesResult.error(new Error()),
    };
    const gamesController = new GamesController(gameService);
    const req = {};
    const res = {
      status: statusCode => ({ json: () => ({ end: () => ({}) }), end: () => ({}) }),
      json: () => ({}),
    };
    const resSpy = spy(res, 'status');
    gamesController.getGames(req, res);

    it('Then it returns a status code of 500', () => {
      expect(resSpy.withArgs(500).calledOnce).toEqual(true);
    });
  });

  describe('When GameService returns an empty result', () => {
    const gameService = {
      requestGames: req => RequestGamesResult.success([]),
    };
    const gamesController = new GamesController(gameService);
    const req = {};
    const res = {
      status: statusCode => ({ json: () => ({ end: () => ({}) }), end: () => ({}) }),
      json: () => ({}),
    };
    const resSpy = spy(res, 'status');
    gamesController.getGames(req, res);

    it('Then it sends back a status code of 404', () => {
      expect(resSpy.withArgs(404).calledOnce).toEqual(true);
    });
  });

  describe('When GameService returns a list of games', () => {
    const gameListItems = [new GameListItem()];
    const gameService = {
      requestGames: ({ query }) => RequestGamesResult.success(gameListItems),
    };
    const gamesController = new GamesController(gameService);
    const req = {};
    const res = {
      status: statusCode => ({ json: () => ({ end: () => ({}) }), end: () => ({}) }),
      json: items => ({}),
    };
    const resSpy = spy(res, 'json');
    gamesController.getGames(req, res);

    it('Then it returns game list items', () => {
      expect(resSpy.withArgs(gameListItems).calledOnce).toEqual(true);
    });
  });
});
