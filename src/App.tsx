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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "0 2rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <StorageStatus />
              </div>
              <div style={{ flex: 1 }}>
                <OracleStatus />
              </div>
              <div style={{ flex: 1 }}>
                <ImageStoreStatus />
              </div>
            </div>
            <div
              style={{
                margin: "2rem",
              }}
            >
              <CardSearch />
            </div>
          </ImageProvider>
        </ImageFetcherProvider>
      </OracleProvider>
    </div>
  );
}

export default App;
