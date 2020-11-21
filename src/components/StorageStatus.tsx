import React, { useEffect, useState } from "react";
import { getDB } from "../services/db";

const storageApiAvailabe =
  navigator.storage && navigator.storage.persisted && navigator.storage.persist;

function StorageStatus(): JSX.Element {
  const [idbEnabled, setIdbEnabled] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [requestRejected, setRequestRejected] = useState(false);
  const [storageUsage, setStorageUsage] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);

  const storagePercent =
    storageQuota !== 0 ? ((storageUsage / storageQuota) * 100).toFixed(2) : 0;

  useEffect(() => {
    if (navigator.storage && navigator.storage.persisted) {
      (async () => {
        const persisted = await navigator.storage.persisted();
        console.log("persisted", persisted);
        setPersistent(persisted);
      })();
    }
    if (navigator.storage && navigator.storage.estimate) {
      estimateStorage();
    }
    (async () => {
      try {
        await getDB();
        setIdbEnabled(true);
      } catch (e) {
        setIdbEnabled(false);
      }
    })();
  });

  const estimateStorage = async () => {
    const estimated = await navigator.storage.estimate();
    setStorageQuota(estimated.quota || 0);
    setStorageUsage(estimated.usage || 0);
    console.log("estimate", estimated);
  };

  const requestPersist = async () => {
    if (navigator.storage && navigator.storage.persist) {
      const persisted = await navigator.storage.persist();
      console.log("persisted", persisted);
      setPersistent(persisted);
      if (persisted) {
        setRequestRejected(false);
      } else {
        setRequestRejected(true);
      }
    }
  };

  return (
    <div>
      <h2>Storage Status:</h2>
      {!storageApiAvailabe && (
        <p style={{ fontWeight: "bold", color: "red" }}>
          navigator.storage not availabe
        </p>
      )}
      {!idbEnabled && (
        <p style={{ fontWeight: "bold", color: "red" }}>DB disabled</p>
      )}
      {!persistent ? (
        <p style={{ fontWeight: "bold", color: "orange" }}>
          Persistent storage not granted (navigator may prune data)
        </p>
      ) : (
        <p style={{ fontWeight: "bold", color: "green" }}>
          Persistent storage granted
        </p>
      )}
      <p>
        Storage usage: {storagePercent}%{" "}
        <button onClick={estimateStorage}>Refresh</button>
      </p>
      {!persistent && (
        <button onClick={requestPersist}>Request persistent storage</button>
      )}
      {requestRejected && (
        <p>
          access to persistent storage refused (bookmark this app and try again)
        </p>
      )}
    </div>
  );
}

export default StorageStatus;
