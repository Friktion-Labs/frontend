export const MAINNET_ENDPOINTS = {
  triton1:
    window.location.hostname === "localhost"
      ? "https://friktion.rpcpool.com/07afafb9df9b278fb600cadb4111"
      : "https://friktion.rpcpool.com",
  triton2: "https://friktion-friktion-e7c9.mainnet.rpcpool.com",
  genesysgo: "https://genesysgo.friktion.fi",
  projectserum: "https://serum-rpc.friktion.fi",
};
