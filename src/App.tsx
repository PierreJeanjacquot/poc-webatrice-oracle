import React from "react";

import StorageStatus from "./components/StorageStatus";
import OracleProvider from "./components/OracleProvider";
import ImageProvider from "./components/ImageProvider";
import OracleStatus from "./components/OracleStatus";
import ImageStoreStatus from "./components/ImageStoreStatus";
import CardSearch from "./components/CardSearch";

function App() {
  return (
    <div>
      <OracleProvider>
        <ImageProvider>
          <StorageStatus />
          <OracleStatus />
          <ImageStoreStatus />
          <CardSearch />
        </ImageProvider>
      </OracleProvider>
    </div>
  );
}

export default App;
