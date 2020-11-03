export interface CardInfo {
  // mtgjson uuid
  uuid: string;
  // name used as id in cockatrice model
  name: string;
  identifiers: {
    // scryfallId for image
    scryfallId: string;
  };
  // todo
}

export interface CardImage {
  uuid: string;
  normal: ArrayBuffer;
}
