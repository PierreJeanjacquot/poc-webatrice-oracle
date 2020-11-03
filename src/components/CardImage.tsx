import React, { useState, useEffect, useContext } from "react";
import { ImageContext } from "./ImageProvider";

interface CardImageProps {
  uuid: string;
}

function CardImage(props: CardImageProps): JSX.Element {
  const [src, setSrc] = useState("");
  const { uuid } = props;
  const { getImage } = useContext(ImageContext);
  useEffect(() => {
    (async function() {
      setSrc("");
      const imgSrc = await getImage(uuid);
      if (imgSrc) {
        setSrc(imgSrc);
      }
    })();
  }, [uuid, getImage]);
  return <img src={src} alt="loading" />;
}

export default CardImage;
