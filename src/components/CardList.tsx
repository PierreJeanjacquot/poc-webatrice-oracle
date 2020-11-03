import React, { useContext, useState } from "react";
import { OracleContext } from "./OracleProvider";
import CardImage from "./CardImage";

function CardList(): JSX.Element {
  const { cards, loadDB, update } = useContext(OracleContext);
  const [selected, setSelected] = useState("");
  return (
    <div>
      <div>
        <button onClick={loadDB}>load</button>
        <button onClick={update}>update</button>
      </div>
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
