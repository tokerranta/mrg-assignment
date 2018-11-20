const R = require('ramda');

class RequestGamesResult {
  constructor(games = [], error = {}) {
    this.games = games;
    this.error = error;
  }

  static success(games) {
    return new RequestGamesResult(games);
  }

  static error(error) {
    return new RequestGamesResult([], error);
  }

  get hasError() {
    return !R.isEmpty(this.error);
  }

  get isEmpty() {
    return R.isEmpty(this.games);
  }

  get errorMessage() {
    return this.error.message;
  }
}

module.exports = RequestGamesResult;
