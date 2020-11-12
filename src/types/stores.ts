export interface SetInfo {
  code: string;
  baseSetSize: number;
  isOnlineOnly: boolean;
  isPaperOnly?: boolean;
  keyruneCode: string;
  name: string;
  releaseDate: string;
  totalSetSize: number;
  type: string;
  translations?: object;
  // integrity check
  checksum?: string;
}

export interface CardInfo {
  // mtgjson uuid
  uuid: string;
  // name used as id in cockatrice model
  name: string;
  // simpleName used for research
  simpleName: string;
  setCode: string;
  identifiers: {
    // scryfallId for image
    scryfallId: string;
  };
  // todo
}

export interface CardImage {
  scryfallId: string;
  normal: ArrayBuffer;
  // todo
}
