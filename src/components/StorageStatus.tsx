import React, { useEffect, useState } from "react";
import { getDB } from "../services/db";

const storageApiAvailabe =
  navigator.storage && navigator.storage.persisted && navigator.storage.persist;

function StorageStatus(): JSX.Element {
  const [idbEnabled, setIdbEnabled] = useState(false);
  const [persistent, setPersistent] = useState(false);
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
    }
  };

  return (
    <div>
      <h2>Storage Status:</h2>
      {!storageApiAvailabe && <p>navigator.storage not availabe</p>}
      {!idbEnabled && <p>DB disabled</p>}
      {!persistent && <p>Data not persisted</p>}
      <p>
        Storage usage: {storagePercent}%{" "}
        <button onClick={estimateStorage}>Refresh</button>
      </p>
      <button onClick={requestPersist}>Request persistent storage</button>
    </div>
  );
}

export default StorageStatus;
