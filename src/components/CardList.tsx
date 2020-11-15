import React, { useState, useEffect } from "react";
import CardImage from "./CardImage";
import { CardInfo } from "../types/stores";

function CardList(
  props: { cards: Array<CardInfo> } = { cards: [] }
): JSX.Element {
  const { cards } = props;
  const [selected, setSelected] = useState(undefined as CardInfo | undefined);
  useEffect(() => {
    setSelected(undefined);
  }, [cards, setSelected]);
  return (
    <div>
      <div style={{ float: "left", maxHeight: "600px", overflowY: "scroll" }}>
        {cards.map((card, i) => {
          return (
            <div
              key={i}
              onMouseEnter={() => setSelected(card)}
              style={{ cursor: "pointer" }}
            >
              {card.name}
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ float: "left", maxHeight: "500px" }}>
          <CardImage cardInfo={selected} />
        </div>
      )}
    </div>
  );
}

export default CardList;
