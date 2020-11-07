import React, { useContext, useState } from "react";
import { OracleContext } from "./OracleProvider";
import CardImage from "./CardImage";

function CardList(): JSX.Element {
  const {
    isUpdating,
    cardCount,
    updateOracle,
    updateSetsInfo,
    cards,
    loadDB,
    updateSet
  } = useContext(OracleContext);
  const [selected, setSelected] = useState("");
  return (
    <div>
      <strong>card count: {cardCount}</strong>
      {!isUpdating && (
        <div>
          <button onClick={updateOracle}>update oracle</button>
          <button onClick={updateSetsInfo}>update sets info</button>
          <button onClick={loadDB}>load</button>
          <button onClick={() => updateSet("PLIST")}>update set PLIST</button>
        </div>
      )}
      {selected && (
        <div>
          <CardImage uuid={selected} />
        </div>
      )}
      <div>
        {cards.map((card, i) => {
          return (
            <div
              key={i}
              onClick={() => setSelected(card.identifiers.scryfallId)}
            >
              {card.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardList;
