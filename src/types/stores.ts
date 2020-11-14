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
  // scryfall uuid
  uuid: string;
  muid?: string;
  // name used as id in cockatrice model
  name: string;
  // simpleName used for research
  simpleName: string;
  setCode: string;
}

export interface CardImage {
  uuid: string;
  normal: ArrayBuffer;
  // todo
}
