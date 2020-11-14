import React, { useContext } from "react";
import { ImageFetcherContext } from "./ImageFetcherProvider";

function ImageStoreStatus(): JSX.Element {
  const { imageCount, startAutoFetch, stopAutoFetch, autoFetch } = useContext(
    ImageFetcherContext
  );
  return (
    <div>
      <h2>Image store Status:</h2>
      <p>image count: {imageCount}</p>
      {autoFetch ? (
        <button onClick={stopAutoFetch}>Stop background fetch</button>
      ) : (
        <button onClick={startAutoFetch}>Start background fetch</button>
      )}
    </div>
  );
}

export default ImageStoreStatus;
