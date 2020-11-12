import React, { useRef, useContext, useEffect, useState } from "react";
import { OracleContext } from "./OracleProvider";
import CardList from "./CardList";
import { CardInfo } from "../types/stores";

function CardSearch(): JSX.Element {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [name, setName] = useState("");
  const [set, setSet] = useState("");
  const { searchCards } = useContext(OracleContext);

  const [result, setResult] = useState([] as Array<CardInfo>);

  useEffect(() => {
    (async () => {
      setResult([]);
      if (name.length >= 3) {
        const searchResult = await searchCards({ name, set });
        if (isMounted.current) {
          setResult(searchResult);
        }
      }
    })();
  }, [name, set, searchCards]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      setName(e.target.value);
    }
  };
  const handleSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      setSet(e.target.value);
    }
  };

  return (
    <div>
      <h2>Search</h2>
      <p>
        <label>Name: </label>
        <input type="text" onChange={handleNameChange} value={name} />
      </p>
      <p>
        <label>Set: </label>
        <input type="text" onChange={handleSetChange} value={set} />
      </p>
      <CardList cards={result} />
    </div>
  );
}

export default CardSearch;
