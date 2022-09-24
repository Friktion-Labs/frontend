import { MAINNET_ENDPOINTS } from "./mainnet-endpoints";

interface RpcSchema {
  url: string;
  custom: boolean;
}

export const mainnetEndpointSetup = () => {
  let mainnetEndpoint = MAINNET_ENDPOINTS.triton1;

  let localStorageRpcObj: null | RpcSchema = null;
  try {
    const localStorageRpc = localStorage.getItem("rpc");
    localStorageRpcObj = localStorageRpc && JSON.parse(localStorageRpc);

    if (localStorageRpcObj !== null) {
      const isRpcStillValid =
        localStorageRpcObj.custom ||
        Object.values(MAINNET_ENDPOINTS).includes(localStorageRpcObj.url);
      if (isRpcStillValid) {
        mainnetEndpoint = localStorageRpcObj.url;
      }
    }
  } catch (e) {
    // error from JSON.parse due to outdated localStorage schema, ignore the error and set
    // RPC back to triton1
  }

  // allow custom rpc url when using cloudflare previews
  const rpcParam = new URLSearchParams(window.location.search).get("rpc");
  const isCloudflarePreview =
    window.location.hostname.includes("friktion-finance-beta.pages.dev") ||
    window.location.hostname === "localhost";
  if (rpcParam && isCloudflarePreview) {
    mainnetEndpoint = rpcParam;
  }

  localStorage.setItem(
    "rpc",
    JSON.stringify({
      url: mainnetEndpoint,
      custom:
        (mainnetEndpoint === rpcParam && isCloudflarePreview) ||
        !!localStorageRpcObj?.custom,
    })
  );

  return mainnetEndpoint;
};
