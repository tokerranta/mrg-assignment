class GameListItem {
  constructor(id, gameProvider, gameCollectionIds, thumbnailUrl, width, height, friendlyName) {
    this.id = id;
    this.gameProvider = gameProvider;
    this.thumbnailUrl = thumbnailUrl;
    this.gameCollectionIds = gameCollectionIds;
    this.width = width;
    this.height = height;
    this.friendlyName = friendlyName;
  }
}

module.exports = GameListItem;
