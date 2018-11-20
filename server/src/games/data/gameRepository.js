const R = require('ramda');
const allGames = require('./all-games.json');

const getAllGames = () => {
  return allGames;
};

const filterByGameCollectionId = gameCollectionId => {
  const containsGameCollectionId = game =>
    !R.isNil(game.gameCollectionIds) && R.contains(gameCollectionId, game.gameCollectionIds);

  return allGames.filter(containsGameCollectionId);
};

const filterByGameProvider = gameProvider =>
  allGames.filter(game => game.gameProvider === gameProvider);

module.exports =  {
  getAllGames,
  filterByGameCollectionId,
  filterByGameProvider,
};
