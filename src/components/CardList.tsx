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
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1 }}>
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
        <div style={{ flex: 1 }}>
          <div style={{ margin: "auto" }}>
            <CardImage cardInfo={selected} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CardList;
