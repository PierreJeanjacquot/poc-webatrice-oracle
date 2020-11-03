import fetch from "cross-fetch";
import * as db from "./db";
import { CardInfo } from "../types/stores";

const ORACLE_API = "https://mtgjson.com/api/v5/PLIST.json";

export async function update(): Promise<void> {
  const res = await fetch(ORACLE_API);
  if (!res.ok) {
    throw new Error(`bad response: ${res.status}`);
  }
  const { data } = await res.json();
  console.log({ data });
  await db.insertManyCards(data.cards);
}

export async function getAllCards(): Promise<Array<CardInfo>> {
  return db.getAllCards();
}
