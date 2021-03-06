import fetch from "cross-fetch";
import * as db from "./db";

const IMAGE_API = "https://api.scryfall.com/cards/";

export const fetchPromises = new Map() as Map<string, Promise<void>>;

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const buffer: ArrayBuffer = reader.result as ArrayBuffer;
      resolve(buffer);
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
}

function arrayBufferToBlob(buffer: ArrayBuffer, type: string): Blob {
  return new Blob([buffer], { type: type });
}

export async function fetchImage(uuid: string): Promise<void> {
  const res = await fetch(`${IMAGE_API}${uuid}?format=image&version=normal`);

  if (!res.ok) {
    throw new Error(`bad response: ${res.status}`);
  }
  const blob = await res.blob();
  const buffer = await blobToArrayBuffer(blob);
  await db.insertImage({ uuid, normal: buffer });
}

export async function getCardImage(
  uuid: string
): Promise<{ src: string; revoke: () => void } | null> {
  const cardImage = await db.getImage(uuid);
  if (!cardImage) return null;
  const blob = arrayBufferToBlob(cardImage.normal, "image/jpeg");
  const src = URL.createObjectURL(blob);
  return {
    src,
    revoke: () => {
      URL.revokeObjectURL(src);
    },
  };
}

export async function imageExists(uuid: string): Promise<boolean> {
  const cardImage = await db.getImage(uuid);
  return !!cardImage;
}

export async function countImages(): Promise<number> {
  return db.countImages();
}
