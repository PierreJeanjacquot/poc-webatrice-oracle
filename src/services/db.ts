import { openDB, DBSchema, IDBPDatabase } from "idb";
import { CardInfo, CardImage } from "../types/stores";

const DB_NAME = "oracle";
const DB_VERSION = 1;

const CARD_STORE_NAME = "cards";
const IMAGE_STORE_NAME = "images";

interface OracleDB extends DBSchema {
  [CARD_STORE_NAME]: {
    key: string;
    value: CardInfo;
    indexes: {
      byName: string;
    };
  };
  [IMAGE_STORE_NAME]: {
    value: CardImage;
    key: string;
  };
}

async function getDB(): Promise<IDBPDatabase<OracleDB>> {
  const db = await openDB<OracleDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const cardStore = db.createObjectStore(CARD_STORE_NAME, {
        keyPath: "uuid"
      });
      cardStore.createIndex("byName", "name");
      db.createObjectStore(IMAGE_STORE_NAME, {
        keyPath: "uuid"
      });
    }
  });
  return db;
}

export async function insertManyCards(cards: Array<CardInfo>): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(CARD_STORE_NAME, "readwrite");
  const cardStore = tx.objectStore(CARD_STORE_NAME);
  await Promise.all(cards.map(card => cardStore.put(card)));
  await tx.done;
  console.log(`added ${cards.length} cards`);
}

export async function getAllCards(): Promise<Array<CardInfo>> {
  const db = await getDB();
  const cardStore = db
    .transaction(CARD_STORE_NAME)
    .objectStore(CARD_STORE_NAME);
  const cards = await cardStore.getAll();
  return cards;
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
