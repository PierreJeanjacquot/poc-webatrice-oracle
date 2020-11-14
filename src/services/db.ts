import { openDB, DBSchema, IDBPDatabase } from "idb";
import { SetInfo, CardInfo, CardImage } from "../types/stores";
import * as cardUtils from "../utils/card-utils";

const DB_NAME = "oracle";
const DB_VERSION = 1;

const SET_STORE_NAME = "sets";
const CARD_STORE_NAME = "cards";
const IMAGE_STORE_NAME = "images";

const PAGE_LENGTH = 100;

interface OracleDB extends DBSchema {
  [SET_STORE_NAME]: {
    key: string;
    value: SetInfo;
    indexes: {
      byName: string;
    };
  };
  [CARD_STORE_NAME]: {
    key: string;
    value: CardInfo;
    indexes: {
      byName: string;
      bySetCode: string;
      bySimpleName: string;
    };
  };
  [IMAGE_STORE_NAME]: {
    value: CardImage;
    key: string;
  };
}

export async function getDB(): Promise<IDBPDatabase<OracleDB>> {
  const db = await openDB<OracleDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const setStore = db.createObjectStore(SET_STORE_NAME, {
        keyPath: "code",
      });
      setStore.createIndex("byName", "name");
      const cardStore = db.createObjectStore(CARD_STORE_NAME, {
        keyPath: "uuid",
      });
      cardStore.createIndex("byName", "name");
      cardStore.createIndex("bySimpleName", "simpleName");
      cardStore.createIndex("bySetCode", "setCode");
      db.createObjectStore(IMAGE_STORE_NAME, {
        keyPath: "uuid",
      });
    },
  });
  return db;
}

export async function insertManySets(sets: Array<SetInfo>): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(SET_STORE_NAME, "readwrite");
  const setStore = tx.objectStore(SET_STORE_NAME);
  await Promise.all(
    sets.map(async (set) => {
      // keep existing checksum
      const existing = await setStore.get(set.code);
      await setStore.put({
        ...set,
        ...(!!existing && { checksum: existing.checksum }),
      });
    })
  );
  await tx.done;
  console.log(`added ${sets.length} sets info`);
}

export async function updateSetChecksum(
  setCode: string,
  checksum: string
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(SET_STORE_NAME, "readwrite");
  const setStore = tx.objectStore(SET_STORE_NAME);
  const existing = await setStore.get(setCode);
  if (existing) {
    await setStore.put({
      ...existing,
      checksum,
    });
    console.log(`${setCode} set checksum updated`);
  }
  await tx.done;
}

export async function getSetInfo(setCode: string): Promise<SetInfo | null> {
  const db = await getDB();
  const setStore = db.transaction(SET_STORE_NAME).objectStore(SET_STORE_NAME);
  const setInfo = (await setStore.get(setCode)) || null;
  return setInfo;
}

export async function getAllSetsInfo(): Promise<Array<SetInfo>> {
  const db = await getDB();
  const setStore = db.transaction(SET_STORE_NAME).objectStore(SET_STORE_NAME);
  const sets = await setStore.getAll();
  return sets;
}

export async function countSetsInfo(): Promise<number> {
  const db = await getDB();
  const setStore = db.transaction(SET_STORE_NAME).objectStore(SET_STORE_NAME);
  const setsCount = await setStore.count();
  return setsCount;
}

export async function insertManyCards(cards: Array<CardInfo>): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, "readwrite");
  const cardStore = tx.objectStore(CARD_STORE_NAME);
  await Promise.all(cards.map((card) => cardStore.put(card)));
  await tx.done;
  console.log(`added ${cards.length} cards`);
}

export async function getAllCards(): Promise<Array<CardInfo>> {
  const cards = [];
  const db = await getDB();
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const nameIndex = cardStore.index("byName");

  let cursor = await nameIndex.openCursor();

  while (cursor) {
    if (cursor.value) {
      cards.push(cursor.value);
      if (cards.length === PAGE_LENGTH) return cards;
    }
    cursor = await cursor.continue();
  }
  return cards;
}

export async function countCards(): Promise<number> {
  const db = await getDB();
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const cardsCount = await cardStore.count();
  return cardsCount;
}

export async function getCardByName(
  name: string,
  setCode?: string
): Promise<CardInfo | null> {
  const db = await getDB();
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const nameIndex = cardStore.index("byName");

  let cursor = await nameIndex.openCursor(name);

  if (!setCode) {
    return (cursor && cursor.value) || null;
  } else {
    while (cursor) {
      if (cursor.value && cursor.value.setCode === setCode) {
        return cursor.value;
      }
      cursor = await cursor.continue();
    }
  }
  return null;
}

export async function searchCards(
  name: string,
  setCode?: string
): Promise<Array<CardInfo>> {
  const simpleName = cardUtils.simplifyName(name);
  if (simpleName.length < 3) return [];

  const db = await getDB();

  const lowerBound = simpleName;
  const upperBound = simpleName + "\uffff";

  const nameRange = IDBKeyRange.bound(lowerBound, upperBound, false, false);
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const nameIndex = cardStore.index("bySimpleName");

  const result = [];
  let cursor = await nameIndex.openCursor(nameRange);
  while (cursor) {
    if (cursor.value) {
      if (!setCode) {
        result.push(cursor.value);
      }
      if (setCode && cursor.value.setCode === setCode) {
        result.push(cursor.value);
      }
      if (result.length === PAGE_LENGTH) return result;
    }
    cursor = await cursor.continue();
  }
  return result;
}

export async function getNextCard(uuid?: string): Promise<CardInfo | null> {
  const db = await getDB();
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const range = uuid ? IDBKeyRange.lowerBound(uuid, true) : undefined;
  let cursor = await cardStore.openCursor(range);
  return cursor ? cursor.value : null;
}

export async function insertImage(image: CardImage): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(IMAGE_STORE_NAME, "readwrite");
  const imageStore = tx.objectStore(IMAGE_STORE_NAME);
  await imageStore.put(image);
  await tx.done;
  console.log(`added ${image.uuid} image`);
}

export async function getImage(uuid: string): Promise<CardImage | null> {
  const db = await getDB();
  const imageStore = db
    .transaction(IMAGE_STORE_NAME)
    .objectStore(IMAGE_STORE_NAME);
  const cardImage = (await imageStore.get(uuid)) || null;
  return cardImage;
}

export async function countImages(): Promise<number> {
  const db = await getDB();
  const imageStore = db
    .transaction(IMAGE_STORE_NAME)
    .objectStore(IMAGE_STORE_NAME);
  return imageStore.count();
}
