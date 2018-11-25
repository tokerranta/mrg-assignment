const expect = require("expect");
const { spy } = require("sinon");
const GameService = require("./GameService");

const mockedGame = {
  id: "1_can_2_can_ogs",
  gameProvider: "OGS",
  gameCollectionIds: ["slots", "allgames", "All-Games-A-Z"],
  thumbnailUrl: "http://testurl.com",
  width: 600,
  height: 800,
  friendlyName: "1-to-can"
};

const mockedRepoWithExistingGames = {
  filterByGameProvider: gameProvider => [mockedGame],
  filterByGameCollectionId: gameCollectionId => [mockedGame],
  getAllGames: () => [mockedGame]
};

const mockedRepoWithNoneExistingGames = {
  filterByGameProvider: gameProvider => []
};

const ERROR_MESSAGE = "Something went wrong";

const mockedRepoThrowsException = {
  filterByGameProvider: gameProvider => {
    throw new Error(ERROR_MESSAGE);
  },
  filterByGameCollectionId: gameCollectionId => {
    throw new Error(ERROR_MESSAGE);
  },
  getAllGames: () => {
    throw new Error(ERROR_MESSAGE);
  }
};

describe("GameService", () => {
  describe("When filtering by existing game provider", () => {
    const gameService = new GameService(mockedRepoWithExistingGames);

    it("then the result is successful", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS" }
      });
      expect(result.hasError).toEqual(false);
    });

    it("then the result is not empty", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS" }
      });
      expect(result.isEmpty).toEqual(false);
    });

    it("then the result contains one game list item", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS" }
      });
      expect(result.games.length).toEqual(1);
    });
  });

  describe("When filtering by none existing game provider", () => {
    const gameService = new GameService(mockedRepoWithNoneExistingGames);

    it("then the result is successful", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "NONE_EXISTING" }
      });
      expect(result.hasError).toEqual(false);
    });

    it("then the result is empty", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "NONE_EXISTING" }
      });
      expect(result.isEmpty).toEqual(true);
    });

    it("then the result contains no game list items", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "NONE_EXISTING" }
      });
      expect(result.games.length).toEqual(0);
    });
  });

  describe("When repository throws exception", () => {
    const gameService = new GameService(mockedRepoThrowsException);

    it("then the result has error", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "EMPTY_PROVIDER" }
      });
      expect(result.hasError).toEqual(true);
    });

    it("then the result is empty", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "EMPTY_PROVIDER" }
      });
      expect(result.isEmpty).toEqual(true);
    });

    it("then the result contains an error message", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "EMPTY_PROVIDER" }
      });
      expect(result.errorMessage).toEqual(ERROR_MESSAGE);
    });
  });

  describe("When filtering by existing game provider and game collection id", () => {
    const gameService = new GameService(mockedRepoWithExistingGames);

    it("then the result is successful", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS", gameCollectionId: "slots" }
      });
      expect(result.hasError).toEqual(false);
    });

    it("then the result is not empty", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS", gameCollectionId: "slots" }
      });
      expect(result.isEmpty).toEqual(false);
    });

    it("then the result has no error message", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS", gameCollectionId: "slots" }
      });
      expect(result.errorMessage).toBeUndefined();
    });

    it("then the result contains a game", async () => {
      const result = await gameService.requestGames({
        query: { gameProvider: "OGS", gameCollectionId: "slots" }
      });
      expect(result.games.length).toBe(1);
    });
  });

  describe("When there is no filter", () => {
    mockedRepoWithExistingGames.getAllGames = spy();
    const gameService = new GameService(mockedRepoWithExistingGames);

    it("then it gets all games", async () => {
      await gameService.requestGames({
        query: {}
      });
      expect(mockedRepoWithExistingGames.getAllGames.calledOnce).toEqual(true);
    });
  });

  describe("When filtering by unsupported filters", () => {
    mockedRepoWithExistingGames.getAllGames = spy();
    const gameService = new GameService(mockedRepoWithExistingGames);

    it("then it returns bad request result", async () => {
      const result = await gameService.requestGames({
        query: { unsupportedFilter: "INVALID QUERY PARAM" }
      });
      expect(result.isBadRequest).toEqual(true);
    });

    it("then error message is correct", async () => {
      const result = await gameService.requestGames({
        query: { unsupportedFilter: "INVALID QUERY PARAM" }
      });
      const expectedErrorMessage = "unsupportedFilter is not supported";
      expect(result.errorMessage).toEqual(expectedErrorMessage);
    });
  });
});
