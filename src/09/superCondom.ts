import { useEffect, useState } from "react";

import fastDeepEqual from "fast-deep-equal/es6/react";

const wcdMap: Record<string, Record<string, boolean>> = {};
export const deepEqual = fastDeepEqual;

/**
 * BLESS THE OBJECT PROPERTY VALUE SHORTHAND
 *
 * This will log when reference to object change but deep value didn't.
 *
 * Only works in localhost because deep equality check is expensive.
 */
export const whatChangedDeeply = (
  nameOfTheFunctionYouAreIn: string,
  theHookDependenciesInTheArrayAtTheEndOfFunctionArguments: Record<string, any>
) => {
  if (window.location.hostname === "localhost") {
    const oldMap = wcdMap[nameOfTheFunctionYouAreIn];
    const map = oldMap ? oldMap : {};
    wcdMap[nameOfTheFunctionYouAreIn] = map;

    const result: Array<string | boolean> = [
      `[${nameOfTheFunctionYouAreIn}] reference change but same deep equality:`,
    ];

    // loop through entries in the items object
    for (const [key, value] of Object.entries(
      theHookDependenciesInTheArrayAtTheEndOfFunctionArguments
    )) {
      if (map[key] !== value) {
        const deepEquals = deepEqual(map[key], value);
        if (deepEquals) {
          result.push("\n    ", key);
        }
      }
      map[key] = value;
    }
    if (result.length > 1) {
      console.error(...result);
    }
  } else {
    // console.log("Not in localhost");
  }
};

let condomTimeMs = 0;
let lastCondomMilestoneSeconds = 0;
export function useCondomOfEquality<T>(newGoods: T, debug?: "condomDebug"): T {
  const [goods, setGoods] = useState(newGoods);
  useEffect(() => {
    const start = window.performance.now();
    if (!deepEqual(goods, newGoods)) {
      setGoods(newGoods);
    } else if (goods !== newGoods && debug) {
      if (window.location.hostname === "localhost") {
        console.log(new Error().stack);
        console.log(
          "Condom of equality detected equality with different ref!",
          newGoods
        );
      }
    }

    const end = window.performance.now();
    condomTimeMs += end - start;
    if (window.location.hostname === "localhost") {
      if (lastCondomMilestoneSeconds + 1 < condomTimeMs / 50) {
        lastCondomMilestoneSeconds = Math.floor(condomTimeMs / 50);
        console.log(`Condom of equality used ${condomTimeMs}ms.`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGoods]);
  return goods;
}

// DON'T DO THIS! BECAUSE ESLINT WON'T KNOW.
// export function useMemoWithCondom<T>(
//   factory: () => T,
//   deps: React.DependencyList | undefined
// ): T {
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   return useCondomOfEquality(useMemo(factory, deps));
// }
