// import puppeteer from "puppeteer"; // uncomment to see types lol
const puppeteer = require("puppeteer");

var os = require("os");
console.log(os.userInfo().username);

const fs = require("fs");
// /**
//  * The API needs to be stable!!! DONT CHANGE
//  */
// type FriktionSnapshot = {
//   totalTvlUSD: number;
//   coinsByCoingeckoId: Record<string, number>;
// };

const checkUnknownSnapshot = (
  friktionSnapshotUnknown /*: unknown*/
) /*:  friktionSnapshotUnknown is FriktionSnapshot */ => {
  let result =
    friktionSnapshotUnknown &&
    typeof friktionSnapshotUnknown === "object" &&
    hasOwnProperty(friktionSnapshotUnknown, "totalTvlUSD") &&
    typeof friktionSnapshotUnknown.totalTvlUSD === "number" &&
    hasOwnProperty(friktionSnapshotUnknown, "coinsByCoingeckoId") &&
    friktionSnapshotUnknown.coinsByCoingeckoId !== null &&
    typeof friktionSnapshotUnknown.coinsByCoingeckoId === "object" &&
    Object.keys(friktionSnapshotUnknown.coinsByCoingeckoId).length > 5 &&
    Object.values(friktionSnapshotUnknown.coinsByCoingeckoId).every(
      (v) => typeof v === "number"
    ) &&
    hasOwnProperty(friktionSnapshotUnknown.coinsByCoingeckoId, "solana") &&
    typeof friktionSnapshotUnknown.coinsByCoingeckoId["solana"] === "number" &&
    friktionSnapshotUnknown.coinsByCoingeckoId["solana"] > 5000 &&
    hasOwnProperty(friktionSnapshotUnknown.coinsByCoingeckoId, "bitcoin") &&
    typeof friktionSnapshotUnknown.coinsByCoingeckoId["bitcoin"] === "number" &&
    friktionSnapshotUnknown.coinsByCoingeckoId["bitcoin"] > 100;
  return result /* as boolean*/;
};

function hasOwnProperty(obj, prop) {
  return obj.hasOwnProperty(prop);
}

// function hasOwnProperty<X extends {}, Y extends PropertyKey>(
//   obj : X,
//   prop : Y
// ) : obj is X & Record<Y, unknown> {
//   return obj.hasOwnProperty(prop);
// }

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

(async () => {
  const browser = await puppeteer.launch({
    headless: os.userInfo().username === "runner",
  });

  let maxFriktionSnapshot /*: FriktionSnapshot */ = {
    totalTvlUSD: 0,
    coinsByCoingeckoId: {},
    pricesByCoingeckoId: {},
    sharePricesByGlobalId: {},
  };

  const useLocalhost = fs.existsSync("DRY_RUN_SNAPSHOT");

  for (let i = 0; i < 3; i++) {
    const page = await browser.newPage();

    await page.goto(
      useLocalhost ? "http://localhost:3000/" : "https://friktion.fi"
    );

    let friktionSnapshot /*: FriktionSnapshot | undefined */;
    for (let i = 0; i < 60; i++) {
      const friktionSnapshotUnknown = await page.evaluate(
        // @ts-ignore
        () => window.friktionSnapshot
      );
      await sleep();

      if (checkUnknownSnapshot(friktionSnapshotUnknown)) {
        friktionSnapshot = friktionSnapshotUnknown;
        break;
      }
    }

    if (friktionSnapshot) {
      if (friktionSnapshot.totalTvlUSD > maxFriktionSnapshot.totalTvlUSD) {
        maxFriktionSnapshot = friktionSnapshot;
      }
      for (const [coingeckoId, amount] of Object.entries(
        friktionSnapshot.coinsByCoingeckoId
      )) {
        if (!maxFriktionSnapshot.coinsByCoingeckoId[coingeckoId]) {
          maxFriktionSnapshot.coinsByCoingeckoId[coingeckoId] = 0;
        }
        if (amount > maxFriktionSnapshot.coinsByCoingeckoId[coingeckoId]) {
          maxFriktionSnapshot.coinsByCoingeckoId[coingeckoId] += amount;
        }
        if (Object.keys(friktionSnapshot.sharePricesByGlobalId)) {
          maxFriktionSnapshot.sharePricesByGlobalId =
            friktionSnapshot.sharePricesByGlobalId;
        }
        if (Object.keys(friktionSnapshot.pricesByCoingeckoId)) {
          maxFriktionSnapshot.pricesByCoingeckoId =
            friktionSnapshot.pricesByCoingeckoId;
        }
      }
    }
    await page.close();
  }
  console.log(maxFriktionSnapshot);

  // Yes, there are other properties, but those aren't as critical
  if (
    maxFriktionSnapshot.totalTvlUSD > 10_000_000 &&
    Object.keys(maxFriktionSnapshot.coinsByCoingeckoId).length > 5 &&
    Object.keys(maxFriktionSnapshot.pricesByCoingeckoId).length > 5 &&
    Object.keys(maxFriktionSnapshot.sharePricesByGlobalId).length > 5
  ) {
    fs.writeFileSync(
      "friktionSnapshot.json",
      JSON.stringify(maxFriktionSnapshot, null, 2)
    );
  }

  await browser.close();
})();
