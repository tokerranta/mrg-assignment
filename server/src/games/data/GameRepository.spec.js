const expect = require('expect');
const GameRepository = require('./GameRepository');
const dataSource = {
  allGames: [{ gameProvider: 'OGS', gameCollectionIds: ['slots', 'games-A-Z'] }],
};
describe('GameRepository', () => {
  const gameRepository = new GameRepository(dataSource);
  describe('When filtering by existing game provider', () => {
    const games = gameRepository.filterByGameProvider('OGS');
    it('Then it returns a list of games', () => {
      expect(games.length).toEqual(1);
    });
  });

  describe('When filtering by existing game collection id', () => {
    const games = gameRepository.filterByGameCollectionId('slots');
    it('Then it returns a list of games', () => {
      expect(games.length).toEqual(1);
    });
  });
  describe('When filtering by none existing game provider', () => {
    const games = gameRepository.filterByGameProvider('NONE_EXISTING');
    it('Then it returns an empty list', () => {
      expect(games.length).toEqual(0);
    });
  });

  describe('When filtering by none existing game collection id', () => {
    const games = gameRepository.filterByGameCollectionId('NONE_EXISTING');
    it('Then it returns an empty list', () => {
      expect(games.length).toEqual(0);
    });
  });

  describe('When filtering by existing game provider with lower case', () => {
    const games = gameRepository.filterByGameProvider('ogs');
    it('Then it returns a list of games', () => {
      expect(games.length).toEqual(1);
    });
  });
});
