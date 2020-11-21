import React, { useRef, useState, useEffect } from "react";
import * as images from "../services/images";
import * as oracle from "../services/oracle";
import { sleep } from "../utils/common";

export type ImageFetcherContextType = {
  imageCount: number;
  autoFetch: boolean;
  startAutoFetch: () => void;
  stopAutoFetch: () => void;
};

export const ImageFetcherContext = React.createContext<ImageFetcherContextType>(
  (undefined as any) as ImageFetcherContextType
);

interface Props {
  children?: any;
}

let lastCardFetchedUuid = undefined as string | undefined;

function ImageFetcherProvider(props: Props) {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
      autoFetch.current = false;
    };
  }, []);

  const [imageCount, setImageCount] = useState(0);
  const autoFetch = useRef(false);
  const [isFetching, setIsFetching] = useState(autoFetch.current);

  useEffect(() => {
    images
      .countImages()
      .then((newImageCount) => {
        if (isMounted.current) {
          setImageCount(newImageCount);
        }
      })
      .catch((e) => console.log("failed to update imageCount", e));
  });

  function startAutoFetch(): void {
    if (autoFetch.current === false) {
      console.log("start background fetch");
      autoFetch.current = true;
      setIsFetching(autoFetch.current);
      (async () => {
        while (autoFetch.current) {
          try {
            const cardInfo = await oracle.getNextCard(lastCardFetchedUuid);
            if (!cardInfo) {
              console.log("autoFetch end");
              console.log("lastCardFetchedUuid", lastCardFetchedUuid);
              autoFetch.current = false;
              setIsFetching(autoFetch.current);
            } else {
              const exists = await images.imageExists(cardInfo.uuid);
              if (!exists) {
                images.fetchPromises.set(
                  cardInfo.uuid,
                  images
                    .fetchImage(cardInfo.uuid)
                    .catch((e) => {
                      console.log(`failed to fetch image ${cardInfo.uuid}`, e);
                    })
                    .finally(() => {
                      images.fetchPromises.delete(cardInfo.uuid);
                      images
                        .countImages()
                        .then((newImageCount) => {
                          if (isMounted.current) {
                            setImageCount(newImageCount);
                          }
                        })
                        .catch((e) =>
                          console.log("failed to update imageCount", e)
                        );
                    })
                );
                console.log("fetchPromises", images.fetchPromises.size);
                await sleep(125);
              }
              lastCardFetchedUuid = cardInfo.uuid;
            }
          } catch (e) {
            console.log("autoFetch error", e);
            autoFetch.current = false;
            setIsFetching(autoFetch.current);
          }
        }
      })();
    }
  }

  function stopAutoFetch(): void {
    autoFetch.current = false;
    setIsFetching(autoFetch.current);
  }

  return (
    <ImageFetcherContext.Provider
      value={{
        imageCount,
        autoFetch: isFetching,
        startAutoFetch,
        stopAutoFetch,
      }}
    >
      {props.children}
    </ImageFetcherContext.Provider>
  );
}

export default ImageFetcherProvider;
