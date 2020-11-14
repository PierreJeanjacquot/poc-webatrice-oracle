import React from "react";

import StorageStatus from "./components/StorageStatus";
import OracleProvider from "./components/OracleProvider";
import ImageFetcherProvider from "./components/ImageFetcherProvider";
import ImageProvider from "./components/ImageProvider";
import OracleStatus from "./components/OracleStatus";
import ImageStoreStatus from "./components/ImageStoreStatus";
import CardSearch from "./components/CardSearch";

function App() {
  return (
    <div>
      <OracleProvider>
        <ImageFetcherProvider>
          <ImageProvider>
            <StorageStatus />
            <OracleStatus />
            <ImageStoreStatus />
            <CardSearch />
          </ImageProvider>
        </ImageFetcherProvider>
      </OracleProvider>
    </div>
  );
}

export default App;
