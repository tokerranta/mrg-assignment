const dataSource = require('./dataSource');
const GameRepository = require('./GameRepository');

const create = () => {
  return new GameRepository(dataSource);
};

module.exports = {
  create,
};
