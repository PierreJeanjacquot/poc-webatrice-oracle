import React from "react";

import StorageStatus from "./components/StorageStatus";
import OracleProvider from "./components/OracleProvider";
import OracleStatus from "./components/OracleStatus";
import CardSearch from "./components/CardSearch";

function App() {
  return (
    <div>
      <OracleProvider>
        <StorageStatus />
        <OracleStatus />
        <CardSearch />
      </OracleProvider>
    </div>
  );
}

export default App;
