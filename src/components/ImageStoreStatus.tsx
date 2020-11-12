import React, { useContext } from "react";
import { ImageContext } from "./ImageProvider";

function ImageStoreStatus(): JSX.Element {
  const { imageCount } = useContext(ImageContext);
  return (
    <div>
      <h2>Image store Status:</h2>
      <p>image count: {imageCount}</p>
    </div>
  );
}

export default ImageStoreStatus;
