import React, { useContext, useState, useEffect } from "react";
import { OracleContext } from "./OracleProvider";
import { SetInfo } from "../types/stores";

interface SetProps {
  set: SetInfo;
}

function Set(props: SetProps): JSX.Element {
  const { set } = props;
  const { checkSetIsUpToDate, updateSet } = useContext(OracleContext);
  const [isUpToDate, setIsUpToDate] = useState(true);

  useEffect(() => {
    (async () => {
      const upToDate = await checkSetIsUpToDate(set.code);
      setIsUpToDate(upToDate);
    })();
  }, [setIsUpToDate, checkSetIsUpToDate, set.code]);

  const update = () => {
    (async () => {
      await updateSet(set.code);
      setIsUpToDate(true);
    })();
  };

  return (
    <div>
      <span>{set.name}</span>
      {!isUpToDate && <button onClick={update}>update {set.code}</button>}
    </div>
  );
}

export default Set;
