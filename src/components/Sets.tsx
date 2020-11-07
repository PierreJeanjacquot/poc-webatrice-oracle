import React, { useContext, useState, useEffect } from "react";
import { OracleContext } from "./OracleProvider";
import { SetInfo } from "../types/stores";
import Set from "./Set";

const emptySetsInfo: Array<SetInfo> = [];

function Sets(): JSX.Element {
  const { updateSetsInfo, loadSetsInfo } = useContext(OracleContext);
  const [sets, setSets] = useState(emptySetsInfo);

  useEffect(() => {
    (async () => {
      const loadedSets = await loadSetsInfo();
      setSets(loadedSets);
    })();
  }, [setSets, loadSetsInfo]);

  const update = () => {
    (async () => {
      await updateSetsInfo();
      const loadedSets = await loadSetsInfo();
      setSets(loadedSets);
    })();
  };

  return (
    <div>
      <div>
        <button onClick={update}>update sets info</button>
      </div>
      <div>
        {sets.map((setInfo, i) => {
          return <Set key={i} set={setInfo} />;
        })}
      </div>
    </div>
  );
}

export default Sets;
