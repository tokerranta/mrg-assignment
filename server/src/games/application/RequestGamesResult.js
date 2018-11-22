const R = require("ramda");

class RequestGamesResult {
  constructor(games = [], error = {}, isBadRequest = false) {
    this.games = games;
    this.error = error;
    this._isBadRequest = isBadRequest;
  }

  static success(games) {
    return new RequestGamesResult(games);
  }

  static error(error) {
    return new RequestGamesResult([], error);
  }

  static badRequest(error) {
    return new RequestGamesResult([], error, true);
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

  get isBadRequest() {
    return this._isBadRequest;
  }
}

module.exports = RequestGamesResult;
