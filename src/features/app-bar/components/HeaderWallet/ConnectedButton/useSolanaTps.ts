import { PerfSample } from "@solana/web3.js";
import { useProviders } from "hooks/useProvider";
import { useEffect, useState } from "react";
import axios from "axios";

export const useSolanaTps = () => {
  const { readonlyProvider } = useProviders();
  const connection = readonlyProvider.connection;
  const [tps, setTps] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    let timerId = setTimeout(async function getTps() {
      try {
        // manually calling rpc as connection is not updated to the new json RPC api format
        const samples: PerfSample[] = (
          await axios.post(connection.rpcEndpoint, {
            jsonrpc: "2.0",
            id: 1,
            method: "getRecentPerformanceSamples",
            params: [1],
          })
        ).data.result;

        if (samples.length >= 1) {
          const avgTps =
            samples[0].numTransactions / samples[0].samplePeriodSecs;
          if (!cancelled) {
            setTps(Math.floor(avgTps));
          }
        }
      } catch (e) {}

      timerId = setTimeout(getTps, 5000);
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [connection]);

  return tps;
};
