import React, { useState } from "react";
import CardImage from "./CardImage";
import { CardInfo } from "../types/stores";

function CardList(
  props: { cards: Array<CardInfo> } = { cards: [] }
): JSX.Element {
  const { cards } = props;
  const [selected, setSelected] = useState("");
  return (
    <div>
      <div style={{ float: "left", maxHeight: "600px", overflowY: "scroll" }}>
        {cards.map((card, i) => {
          return (
            <div
              key={i}
              onClick={() => setSelected(card.identifiers.scryfallId)}
              style={{ cursor: "pointer" }}
            >
              {card.name}
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ float: "left", maxHeight: "500px" }}>
          <CardImage uuid={selected} />
        </div>
      )}
    </div>
  );
}

export default CardList;
