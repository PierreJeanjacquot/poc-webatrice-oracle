import React, { useRef, useEffect, useState } from "react";
import CardList from "./CardList";
import { CardInfo } from "../types/stores";
import { searchCards } from "../services/oracle";

function CardSearch(): JSX.Element {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [name, setName] = useState("");

  const [result, setResult] = useState([] as Array<CardInfo>);

  useEffect(() => {
    (async () => {
      setResult([]);
      if (name.length >= 3) {
        const searchResult = await searchCards({ name });
        if (isMounted.current) {
          setResult(searchResult);
        }
      }
    })();
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      setName(e.target.value);
    }
  };

  return (
    <div>
      <h2>Search</h2>
      <p>
        <label>Name: </label>
        <input type="text" onChange={handleNameChange} value={name} />
      </p>
      <CardList cards={result} />
    </div>
  );
}

export default CardSearch;
