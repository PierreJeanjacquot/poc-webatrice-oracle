import React from "react";

import OracleProvider from "./components/OracleProvider";
import CardList from "./components/CardList";

function App() {
  return (
    <div>
      <OracleProvider>
        <CardList />
      </OracleProvider>
    </div>
  );
}

export default App;
