import React, { useRef, useState, useEffect, useContext } from "react";
import { ImageContext } from "./ImageProvider";

interface CardImageProps {
  uuid: string;
}

function CardImage(props: CardImageProps): JSX.Element {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [src, setSrc] = useState("");
  const { uuid } = props;
  const { getImage } = useContext(ImageContext);
  useEffect(() => {
    (async function() {
      setSrc("");
      const imgSrc = await getImage(uuid);
      if (imgSrc && isMounted.current) {
        setSrc(imgSrc);
      }
    })();
  }, [uuid, getImage]);
  return <>{src && <img src={src} alt="card" />}</>;
}

export default CardImage;
