import React, { useState } from "react";
import * as oracle from "../services/oracle";
import { CardInfo } from "../types/stores";

const emptyCardsArray: Array<CardInfo> = [];

export const OracleContext = React.createContext({
  loadDB: function() {},
  update: function() {},
  cards: emptyCardsArray
});

interface ProviderProps {
  children?: any;
}

function OracleProvider(props: ProviderProps) {
  const [isUpToDate, setIsUpToDate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [cards, setCards] = useState(emptyCardsArray);

  async function update(): Promise<void> {
    if (!isUpToDate && !isUpdating) {
      try {
        setIsUpdating(true);
        await oracle.update();
        setIsUpToDate(true);
        setIsUpdating(false);
      } catch (e) {
        console.log("oracle update fail", e);
        setIsUpdating(false);
      }
    }
  }

  async function loadDB(): Promise<void> {
    try {
      setCards(await oracle.getAllCards());
    } catch (e) {
      console.log("loadDB cards fail", e);
    }
  }

  return (
    <OracleContext.Provider value={{ cards, update, loadDB }}>
      {props.children}
    </OracleContext.Provider>
  );
}

export default OracleProvider;
