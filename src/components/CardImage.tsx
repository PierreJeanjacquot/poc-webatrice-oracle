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
    let revoke = () => {};
    (async function () {
      setSrc("");
      const img = await getImage(cardInfo.uuid);
      if (img) {
        if (isMounted.current) {
          setSrc(img.src);
          revoke = img.revoke;
        } else {
          // revoke as image won't be used
          img.revoke();
        }
      }
    })();
    return () => {
      // revoke as image to display changed
      revoke();
    };
  }, [cardInfo.uuid, getImage]);
  return <>{src && <img src={src} alt="card" />}</>;
}

export default CardImage;
