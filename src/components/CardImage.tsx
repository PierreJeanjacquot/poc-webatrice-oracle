import React, { useRef, useState, useEffect, useContext } from "react";
import { ImageContext } from "./ImageProvider";
import { CardInfo } from "../types/stores";

interface CardImageProps {
  cardInfo: CardInfo;
}

function CardImage(props: CardImageProps): JSX.Element {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [src, setSrc] = useState("");
  const { cardInfo } = props;
  const { getImage } = useContext(ImageContext);
  useEffect(() => {
    (async function () {
      setSrc("");
      const imgSrc = await getImage(cardInfo.uuid);
      if (imgSrc && isMounted.current) {
        setSrc(imgSrc);
      }
    })();
  }, [cardInfo.uuid, getImage]);
  return <>{src && <img src={src} alt="card" />}</>;
}

export default CardImage;
