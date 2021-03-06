import React, { useRef, useState, useEffect } from "react";
import * as oracle from "../services/oracle";
import { SetInfo } from "../types/stores";

export type OracleContextType = {
  isUpdating: boolean;
  cardCount: number;
  updateOracle: () => Promise<void>;
  updateSetsInfo: () => Promise<void>;
  loadSetsInfo: () => Promise<Array<SetInfo>>;
  checkSetIsUpToDate: (setCode: string) => Promise<boolean>;
  updateSet: (setCode: string) => Promise<void>;
};

export const OracleContext = React.createContext<OracleContextType>(
  (undefined as any) as OracleContextType
);

interface ProviderProps {
  children?: any;
}

function OracleProvider(props: ProviderProps) {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isUpdating, setIsUpdating] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    (async () => {
      setCardCount(await oracle.countCards());
    })();
  }, []);

  const [isSetsListUpToDate, setIsSetsListUpToDate] = useState(false);
  const [isSetsListUpdating, setIsSetsListUpdating] = useState(false);

  async function updateSetsInfo(): Promise<void> {
    if (!isSetsListUpToDate && !isSetsListUpdating) {
      try {
        setIsSetsListUpdating(true);
        await oracle.updateSetsInfo();
        if (isMounted.current) {
          setIsSetsListUpToDate(true);
        }
      } catch (e) {
        console.log("oracle updateSetsInfo fail", e);
      } finally {
        if (isMounted.current) {
          setIsSetsListUpdating(false);
        }
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
      sets.map((set) =>
        checkSetIsUpToDate(set.code).then((upToDate) => {
          if (!upToDate) {
            return updateSet(set.code);
          }
        })
      )
    );
    const newCardCount = await oracle.countCards();
    if (isMounted.current) {
      setIsUpdating(false);
      setCardCount(newCardCount);
    }
  }

  async function loadSetsInfo(): Promise<Array<SetInfo>> {
    return oracle.getAllSetsInfo();
  }

  async function checkSetIsUpToDate(setCode: string): Promise<boolean> {
    return oracle.checkSetIsUpToDate(setCode);
  }

  return (
    <OracleContext.Provider
      value={{
        isUpdating,
        cardCount,
        updateOracle,
        updateSetsInfo,
        updateSet,
        loadSetsInfo,
        checkSetIsUpToDate,
      }}
    >
      {props.children}
    </OracleContext.Provider>
  );
}

export default OracleProvider;
