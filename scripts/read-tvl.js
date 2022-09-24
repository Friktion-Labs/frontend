const friktionSnapshot = require("../mainnet-tvl-snapshots/friktionSnapshot.json");
process.stdout.write(
  "$" + Math.floor(friktionSnapshot.totalTvlUSD).toLocaleString()
);
