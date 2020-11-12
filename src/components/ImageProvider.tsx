import React, { useRef, useState, useEffect } from "react";
import * as images from "../services/images";

export type ImageContextType = {
  getImage: (scryfallId: string) => Promise<string | undefined>;
  imageCount: number;
};

export const ImageContext = React.createContext<ImageContextType>(
  (undefined as any) as ImageContextType
);

interface ProviderProps {
  children?: any;
}

const fetchPromises = new Map() as Map<string, Promise<void>>;

function ImageProvider(props: ProviderProps) {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    images
      .countImages()
      .then(newImageCount => {
        if (isMounted.current) {
          setImageCount(newImageCount);
        }
      })
      .catch(e => console.log("failed to update imageCount", e));
  });

  async function getImage(scryfallId: string): Promise<string | undefined> {
    try {
      const fromDB = await images.getCardImage(scryfallId);
      if (fromDB) return fromDB;
      if (fetchPromises.get(scryfallId) === undefined) {
        console.log("new fetch Promise");
        fetchPromises.set(scryfallId, images.fetchImage(scryfallId));
        await fetchPromises.get(scryfallId);
        fetchPromises.delete(scryfallId);
        // non blocking update imageCount
        images
          .countImages()
          .then(newImageCount => {
            if (isMounted.current) {
              setImageCount(newImageCount);
            }
          })
          .catch(e => console.log("failed to update imageCount", e));
      } else {
        console.log("waiting existing Promise");
        await fetchPromises.get(scryfallId);
      }
      const fetched = await images.getCardImage(scryfallId);
      return fetched;
    } catch (e) {
      return undefined;
    }
  }

  return (
    <ImageContext.Provider value={{ getImage, imageCount }}>
      {props.children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;
