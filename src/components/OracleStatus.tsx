import React, { useContext } from "react";
import { OracleContext } from "./OracleProvider";

function OracleStatus(): JSX.Element {
  const { isUpdating, cardCount, updateOracle } = useContext(OracleContext);
  return (
    <div>
      <h2>Oracle Status:</h2>
      <p>card count: {cardCount}</p>

      {!isUpdating && (
        <div>
          <button onClick={updateOracle}>update oracle</button>
        </div>
      )}
      {isUpdating && <p>updating...</p>}
    </div>
  );
}

export default OracleStatus;
