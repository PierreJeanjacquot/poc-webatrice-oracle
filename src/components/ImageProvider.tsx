import React from "react";
import * as images from "../services/images";

export type ImageContextType = {
  getImage: (uuid: string) => Promise<string | undefined>;
};

async function getImage(uuid: string): Promise<string | undefined> {
  try {
    const fromDB = await images.getCardImage(uuid);
    if (fromDB) return fromDB;
    await images.fetchImage(uuid);
    const fetched = await images.getCardImage(uuid);
    return fetched;
  } catch (e) {
    return undefined;
  }
}

export const ImageContext = React.createContext<ImageContextType>({
  getImage
});

interface ProviderProps {
  children?: any;
}

function ImageProvider(props: ProviderProps) {
  return (
    <ImageContext.Provider value={{ getImage }}>
      {props.children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;
