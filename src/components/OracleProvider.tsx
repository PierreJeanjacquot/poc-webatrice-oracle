import React, { useState, useEffect } from "react";
import * as oracle from "../services/oracle";
import { SetInfo, CardInfo } from "../types/stores";

export type OracleContextType = {
  isUpdating: boolean;
  cardCount: number;
  updateOracle: () => Promise<void>;
  updateSetsInfo: () => Promise<void>;
  loadSetsInfo: () => Promise<Array<SetInfo>>;
  checkSetIsUpToDate: (setCode: string) => Promise<boolean>;
  updateSet: (setCode: string) => Promise<void>;
  loadDB: () => Promise<void>;
  cards: Array<CardInfo>;
};

export const OracleContext = React.createContext<OracleContextType>(
  (undefined as any) as OracleContextType
);

interface ProviderProps {
  children?: any;
}

function OracleProvider(props: ProviderProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    (async () => {
      setCardCount(await oracle.countCards());
    })();
  }, []);

  const [isSetsListUpToDate, setIsSetsListUpToDate] = useState(false);
  const [isSetsListUpdating, setIsSetsListUpdating] = useState(false);

  const [cards, setCards] = useState([] as Array<CardInfo>);

  async function updateSetsInfo(): Promise<void> {
    if (!isSetsListUpToDate && !isSetsListUpdating) {
      try {
        setIsSetsListUpdating(true);
        await oracle.updateSetsInfo();
        setIsSetsListUpToDate(true);
        setIsSetsListUpdating(false);
      } catch (e) {
        console.log("oracle updateSetsInfo fail", e);
        setIsSetsListUpdating(false);
      }
    }
  }

  async function updateSet(setCode: string): Promise<void> {
    try {
      await oracle.updateSet(setCode);
    } catch (e) {
      console.log("oracle updateSet fail", e);
    }
  }

  async function updateOracle(): Promise<void> {
    setIsUpdating(true);
    await updateSetsInfo();
    const sets = await loadSetsInfo();
    await Promise.all(
      sets.map(async set => {
        const upToDate = await checkSetIsUpToDate(set.code);
        if (!upToDate) {
          await updateSet(set.code);
        }
      })
    );
    setIsUpdating(false);
    setCardCount(await oracle.countCards());
  }

  async function loadSetsInfo(): Promise<Array<SetInfo>> {
    return (await oracle.getAllSetsInfo()) || [];
  }

  async function checkSetIsUpToDate(setCode: string): Promise<boolean> {
    return await oracle.checkSetIsUpToDate(setCode);
  }

  async function loadDB(): Promise<void> {
    try {
      setCards(await oracle.getAllCards());
    } catch (e) {
      console.log("loadDB cards fail", e);
    }
  }

  return (
    <OracleContext.Provider
      value={{
        isUpdating,
        cardCount,
        updateOracle,
        updateSetsInfo,
        cards,
        updateSet,
        loadDB,
        loadSetsInfo,
        checkSetIsUpToDate
      }}
    >
      {props.children}
    </OracleContext.Provider>
  );
}

export default OracleProvider;
