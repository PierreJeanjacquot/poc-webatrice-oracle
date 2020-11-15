import React, { useRef, useEffect } from "react";
import * as images from "../services/images";

export type ImageContextType = {
  getImage: (
    uuid: string
  ) => Promise<{ src: string; revoke: () => void } | null>;
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

  /**
   * Returns a promise of an object containing image src and revoke() function if the image exists in the DB otherwise returns null.
   * revoke() must be called when the image is no longer needed.
   */
  async function getImage(
    uuid: string
  ): Promise<{ src: string; revoke: () => void } | null> {
    try {
      const fromDB = await images.getCardImage(uuid);
      if (fromDB) return fromDB;
      if (fetchPromises.get(uuid) === undefined) {
        console.log("new fetch Promise");
        fetchPromises.set(
          uuid,
          images
            .fetchImage(uuid)
            .catch((e) => {
              console.log(`failed to fetch image ${uuid}`, e);
            })
            .finally(() => fetchPromises.delete(uuid))
        );
        await fetchPromises.get(uuid);
      } else {
        console.log("waiting existing Promise");
        await fetchPromises.get(uuid);
      }
      const fetched = await images.getCardImage(uuid);
      return fetched;
    } catch (e) {
      return null;
    }
  }

  return (
    <ImageContext.Provider
      value={{
        getImage,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;
