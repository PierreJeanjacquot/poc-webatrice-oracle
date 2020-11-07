import fetch from "cross-fetch";
import * as db from "./db";
import { SetInfo, CardInfo } from "../types/stores";

const ORACLE_API = "https://mtgjson.com/api/v5";
const SETS_ENDPOINT = "/SetList.json";

export async function updateSetsInfo(): Promise<void> {
  const res = await fetch(`${ORACLE_API}${SETS_ENDPOINT}`);
  if (!res.ok) {
    throw new Error(`bad response: ${res.status}`);
  }
  const { data } = await res.json();
  console.log({ data });
  await db.insertManySets(data);
}

export async function countSetsInfo(): Promise<number> {
  const setsInfoCount = await db.countSetsInfo();
  return setsInfoCount;
}

export async function getAllSetsInfo(): Promise<Array<SetInfo>> {
  const setsInfo = (await db.getAllSetsInfo()) || [];
  return setsInfo;
}

export async function checkSetIsUpToDate(setCode: string): Promise<boolean> {
  const setInfo = await db.getSetInfo(setCode);
  if (!setInfo) {
    throw Error(`unknown set ${setCode}`);
  }
  if (!setInfo.checksum) {
    return false;
  }
  const checksumRes = await fetch(`${ORACLE_API}/${setCode}.json.sha256`).catch(
    e => {
      console.log(`failed to fetch ${ORACLE_API}/${setCode}.json.sha256`);
      throw e;
    }
  );
  if (!checksumRes.ok) {
    throw new Error(`bad response: ${checksumRes.status}`);
  }
  const checksum = await checksumRes.text();
  return checksum === setInfo.checksum;
}

export async function updateSet(setCode: string): Promise<void> {
  const res = await fetch(`${ORACLE_API}/${setCode}.json`).catch(e => {
    console.log(`failed to fetch ${ORACLE_API}/${setCode}.json`);
    throw e;
  });
  const checksumRes = await fetch(`${ORACLE_API}/${setCode}.json.sha256`, {
    redirect: "follow"
  }).catch(e => {
    console.log(`failed to fetch ${ORACLE_API}/${setCode}.json.sha256`);
    throw e;
  });
  if (!res.ok) {
    throw new Error(`bad response: ${res.status}`);
  }
  if (!checksumRes.ok) {
    throw new Error(`bad response: ${checksumRes.status}`);
  }
  const { data } = await res.json();
  const checksum = await checksumRes.text();
  console.log("checksum", checksum);
  console.log({ data });
  await db.insertManyCards(data.cards);
  await db.updateSetChecksum(setCode, checksum);
}

export async function countCards(): Promise<number> {
  const cardsCount = await db.countCards();
  return cardsCount;
}

export async function getAllCards(): Promise<Array<CardInfo>> {
  return db.getAllCards();
}
