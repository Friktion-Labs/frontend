import Decimal from "decimal.js";
import { SubvoltDef10, UltraToken } from "./registry10";
Decimal.set({ toExpPos: 20, toExpNeg: -20 });

// en-US locale for no ambiguity.

// Create our number formatter.
var formatterWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const formatUSDRoundDown = (value: number | Decimal) => {
  if (value instanceof Decimal) {
    value = value.toNumber();
  }
  return formatterWhole.format(Math.floor(value));
};

// format in the user's locale
var formatterCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const formatUSDCentsRoundNearest = (value: number | Decimal) => {
  if (value instanceof Decimal) {
    value = value.toNumber();
  }
  return formatterCents.format(Math.round(value * 100) / 100);
};
export const formatUSDCentsRoundDown = (value: number) =>
  "$" + floorN(value, 2).toFixed(2);
export const formatUSDAdaptable = (value: number) => {
  if (value > 200000) {
    return formatUSDRoundDown(value);
  } else {
    return formatUSDCentsRoundNearest(value);
  }
};

// Edgecase: sometimes, some pothead will pass in a negative value
export const formatUSDForPrice = (value: number) => {
  if (Math.abs(value) > 10000) {
    return formatUSDRoundDown(value);
  } else if (Math.abs(value) < 1.3) {
    return "$" + floorN(value, 3).toFixed(3);
  } else {
    return formatUSDCentsRoundDown(value);
  }
};
export const formatUSDCentsSilly = (value: number) => {
  if (value > 10 ** 24) {
    const sillyAmount = floorN(value / 10 ** 24, 0);
    return (
      "$" +
      floorN(value / 10 ** 24, 0) +
      " terafuckton" +
      (sillyAmount > 1 ? "s" : "")
    );
  }
  if (value > 10 ** 21) {
    const sillyAmount = floorN(value / 10 ** 21, 0);
    return (
      "$" +
      floorN(value / 10 ** 21, 0) +
      " terafuckton" +
      (sillyAmount > 1 ? "s" : "")
    );
  }
  if (value > 10 ** 18) {
    const sillyAmount = floorN(value / 10 ** 18, 0);
    return (
      "$" +
      floorN(value / 10 ** 18, 0) +
      " gigafuckton" +
      (sillyAmount > 1 ? "s" : "")
    );
  }
  if (value > 10 ** 15) {
    const sillyAmount = floorN(value / 10 ** 15, 0);
    return (
      "$" +
      floorN(value / 10 ** 15, 0) +
      " megafuckton" +
      (sillyAmount > 1 ? "s" : "")
    );
  }
  if (value > 10 ** 13) {
    const sillyAmount = floorN(value / 10 ** 12, 0);
    return (
      "$" +
      floorN(value / 10 ** 12, 0) +
      " kilofuckton" +
      (sillyAmount > 1 ? "s" : "")
    );
  }
  return formatterCents.format(value);
};

export const floorN = (value: number | Decimal, n: number) => {
  if (value instanceof Decimal) {
    return decimalFloorN(value, n).toNumber();
  }
  const factor = Math.pow(10, n);
  return Math.floor(value * factor) / factor;
};

/**
 * not to fixed. won't show trailing 0s
 */
export const decimalFloorN = (value: Decimal, n: number) => {
  return new Decimal(value)
    .mul(10 ** n)
    .floor()
    .div(10 ** n);
};

export const floorLocaleN = (value: Decimal, n: number) => {
  return decimalFloorN(value, n).toNumber().toLocaleString("en-US");
};

export const floorLocale = (value: Decimal, n?: number) => {
  if (n) {
    return floorLocaleN(value, n);
  }
  return value.floor().toNumber().toLocaleString("en-US");
};

/**
 * Tries to format with N decimal minimum, but with maximum of def.displayDecimals
 *
 * @deprecated try to use locale. locale is better
 */
export const greatFloorN = (
  def: SubvoltDef10,
  value: Decimal | number,
  minimumN: number
): Decimal => {
  const minDecimals = Math.min(minimumN, def.displayDecimals);
  const maxDecimals = def.displayDecimals;

  const decValue = new Decimal(value);

  // log10(0.00001) => -5
  // log10(0.00005) => -4.3
  const negativeDecimals = Decimal.log10(decValue);

  let desiredDecimals = minimumN;

  // Show dust
  if (negativeDecimals.isNeg()) {
    desiredDecimals = negativeDecimals
      .mul(-1)
      .plus(0.8)
      .ceil()
      .clampedTo(minDecimals, def.maxDecimals)
      .toNumber();
  }

  // Try to show at least 5 digits
  const someDecimals = Math.min(
    maxDecimals,
    Math.min(5, Math.max(0, Math.floor(5 - Math.log10(decValue.toNumber()))))
  );
  if (someDecimals > desiredDecimals) {
    desiredDecimals = someDecimals;
  }

  return decimalFloorN(decValue, desiredDecimals);
};

/**
 * @deprecated use ultra
 */
export const greatFloorLocaleN = (
  def: SubvoltDef10,
  value: Decimal | number,
  minimumN: number
) => {
  const minDecimals = Math.min(minimumN, def.displayDecimals);
  const maxDecimals = def.displayDecimals;

  const decValue = new Decimal(value);

  if (decValue.isZero()) {
    return "0";
  }

  // log10(0.00001) => -5
  // log10(0.00005) => -4.3
  const negativeDecimals = Decimal.log10(decValue);

  let desiredDecimals = minimumN;

  // Show dust
  if (negativeDecimals.isNeg()) {
    desiredDecimals = negativeDecimals
      .mul(-1)
      .plus(1)
      .ceil()
      .clampedTo(minDecimals, def.maxDecimals)
      .toNumber();
  }

  // Try to show at least 5 digits
  const someDecimals = Math.min(
    maxDecimals,
    Math.min(5, Math.max(0, Math.floor(5 - Math.log10(decValue.toNumber()))))
  );
  if (someDecimals > desiredDecimals) {
    desiredDecimals = someDecimals;
  }

  return decValue.toNumber().toLocaleString("en-US", {
    minimumFractionDigits: desiredDecimals,
    maximumFractionDigits: desiredDecimals,
  });
};

/**
 * This is the formatter we want to use everywhere. Will become more sophisticated
 * over time.
 *
 * Used for formatting assets, NOT USD.
 *
 * Example input:
 * (btc definition, Decimal(1.23456789))
 * Example outout:
 *   1.234567
 *
 * But will override to show displayDecimal if there is not enough precision.
 */
export const goodFormat = (def: SubvoltDef10, value: Decimal | number) => {
  return greatFloorLocaleN(def, value, def.displayDecimals);
};

/**
 * Only use this if the longer form is 1 click away and space is constrained.
 * For example, in a card.
 */
export const goodFormatShort = (def: SubvoltDef10, value: Decimal | number) => {
  return greatFloorLocaleN(def, value, def.shortDisplayDecimals);
};

/**
 * If defined, will format based on default decimals.
 *
 * If undefined, shows "... BTC" (of course with whatever symbol)
 *
 * If Nan, also ...
 */
export const goodLoadableFormatSymbol = (
  def: SubvoltDef10,
  value: Decimal | number | null | undefined
) => {
  return goodLoadableFormatSymbolCustom(
    def,
    value,
    def.optionType === "put" ? 2 : def.displayDecimals // instead, we should just use ultra
  );
};

export const goodLoadableFormatSymbolCustom = (
  def: SubvoltDef10,
  value: Decimal | number | null | undefined,
  decimals: number
) => {
  if (value === undefined || value === null) {
    return "... " + def.depositToken.symbol;
  }
  if (value instanceof Decimal && value.isNaN()) {
    return "... " + def.depositToken.symbol;
  }
  if (typeof value === "number" && isNaN(value)) {
    return "... " + def.depositToken.symbol;
  }

  return (
    greatFloorLocaleN(def, value, decimals) + " " + def.depositToken.symbol
  );
};

export const dontUseRoundingUnlessAbsolutelyNecessaryN = (
  value: Decimal,
  n: number
) => {
  return new Decimal(value)
    .mul(10 ** n)
    .round()
    .div(10 ** n);
};

export const dontUseRoundLocaleN = (value: Decimal, n: number) => {
  return dontUseRoundingUnlessAbsolutelyNecessaryN(value, n)
    .toNumber()
    .toLocaleString("en-US");
};

export const youProbablyDontWantToRoundSoPleaseUseFloorViaGoodLoadableFormatShort =
  (def: SubvoltDef10, value: Decimal | number) => {
    if (value instanceof Decimal) {
      return dontUseRoundingUnlessAbsolutelyNecessaryN(
        value,
        def.displayDecimals
      ).toNumber();
    }
    const factor = Math.pow(10, def.displayDecimals);
    return Math.floor(value * factor) / factor;
  };

/**
 * Tries to format with N decimal minimum, but with maximum of def.displayDecimals
 */
export const ultraGreatFloorN = (
  ultra: UltraToken,
  value: Decimal | number,
  minimumN: number
): Decimal => {
  return genericHyperFloorN(
    ultra.displayDecimals,
    ultra.decimals,
    value,
    minimumN
  );
};
/**
 * good -> great -> ultraGreat -> Hyper
 */
export const genericHyperFloorN = (
  displayDecimals: number,
  maxDecimals: number,
  value: Decimal | number,
  minimumN: number
) => {
  if (minimumN < 0 || isNaN(minimumN)) {
    minimumN = 0;
  } else {
    minimumN = Math.round(minimumN);
  }
  const minDecimals = Math.min(minimumN, displayDecimals);

  const decValue = new Decimal(value);

  if (decValue.lt(0.0000000009)) {
    return new Decimal(0);
  }

  // log10(0.00001) => -5
  // log10(0.00005) => -4.3
  const negativeDecimals = Decimal.log10(decValue);

  let desiredDecimals = minimumN;

  // Show dust
  if (negativeDecimals.isNeg()) {
    desiredDecimals = negativeDecimals
      .mul(-1)
      .plus(1)
      .ceil()
      .clampedTo(minDecimals, maxDecimals)
      .toNumber();
  }

  // Try to show at least 5 digits
  const someDecimals = Math.min(
    displayDecimals,
    Math.min(5, Math.max(0, Math.floor(5 - Math.log10(decValue.toNumber()))))
  );
  if (someDecimals > desiredDecimals) {
    desiredDecimals = someDecimals;
  }

  const decFloorNResult = decimalFloorN(decValue, desiredDecimals);

  if (decFloorNResult.toString().startsWith("NaN")) {
    console.log("\n\ndecFloorNResult was NaaN in ultraGreatFloorN");
    // console.log("ultra", ultra);
    console.log("value", value);
    console.log("decValue", decValue.toString());
    console.log("negativeDecimals.toString(),", negativeDecimals.toString());
    console.log("someDecimals.toString(),", someDecimals.toString());
    console.log("decFloorNResult.toString()", decFloorNResult.toString());
    console.log("minimumN", minimumN);
  }

  return decFloorNResult;
};

/**
 * good -> great -> ultraGreat -> Hyper
 */
export const genericHyperFloorLocaleN = (
  displayDecimals: number,
  maxDecimals: number,
  value: Decimal | number,
  minimumN: number
) => {
  if (minimumN < 0 || isNaN(minimumN)) {
    minimumN = 0;
  } else {
    minimumN = Math.round(minimumN);
  }
  const minDecimals = Math.min(minimumN, displayDecimals);

  const decValue = new Decimal(value);

  if (decValue.lt(0.0000000009)) {
    return new Decimal(0);
  }

  // log10(0.00001) => -5
  // log10(0.00005) => -4.3
  const negativeDecimals = Decimal.log10(decValue);

  let desiredDecimals = minimumN;

  // Show dust
  if (negativeDecimals.isNeg()) {
    desiredDecimals = negativeDecimals
      .mul(-1)
      .plus(1)
      .ceil()
      .clampedTo(minDecimals, maxDecimals)
      .toNumber();
  }

  // Try to show at least 5 digits
  const someDecimals = Math.min(
    displayDecimals,
    Math.min(5, Math.max(0, Math.floor(5 - Math.log10(decValue.toNumber()))))
  );
  if (someDecimals > desiredDecimals) {
    desiredDecimals = someDecimals;
  }

  const decFloorNResult = decimalFloorN(decValue, desiredDecimals);

  if (decFloorNResult.toString().startsWith("NaN")) {
    console.log("\n\ndecFloorNResult was NaaN in ultraGreatFloorN");
    // console.log("ultra", ultra);
    console.log("value", value);
    console.log("decValue", decValue.toString());
    console.log("negativeDecimals.toString(),", negativeDecimals.toString());
    console.log("someDecimals.toString(),", someDecimals.toString());
    console.log("decFloorNResult.toString()", decFloorNResult.toString());
    console.log("minimumN", minimumN);
  }

  return decFloorNResult.toNumber().toLocaleString("en-US", {
    minimumFractionDigits: desiredDecimals,
    maximumFractionDigits: desiredDecimals,
  });
};
/**
 * @deprecated actually not good
 */
export const ultraGreatFloorLocaleN = (
  ultra: UltraToken,
  value: Decimal | number,
  minimumN: number
) => {
  return ultraGreatFloorN(ultra, value, minimumN)
    .toNumber()
    .toLocaleString("en-US");
};

/**
 * This is the formatter we want to use everywhere. Will become more sophisticated
 * over time.
 *
 * Used for formatting assets, NOT USD.
 *
 * Example input:
 * (btc definition, Decimal(1.23456789))
 * Example outout:
 *   1.234567
 *
 * But will override to show displayDecimal if there is not enough precision.
 */
export const ultraFormat = (ultra: UltraToken, value: Decimal | number) => {
  return ultraGreatFloorN(ultra, value, ultra.displayDecimals);
};
export const ultraFormatSymbol = (
  ultra: UltraToken,
  value: Decimal | number
) => {
  return ultraFormat(ultra, value) + " " + ultra.symbol;
};

/**
 * Only use this if the longer form is 1 click away and space is constrained.
 * For example, in a card.
 */
export const ultraFormatShort = (
  ultra: UltraToken,
  value: Decimal | number
) => {
  return ultraGreatFloorN(ultra, value, ultra.shortDisplayDecimals);
};
export const ultraFormatShortSymbol = (
  def: UltraToken,
  value: Decimal | number
) => {
  return ultraFormatShort(def, value) + " " + def.symbol;
};

/**
 * If defined, will format based on default decimals.
 *
 * If undefined, shows "... BTC" (of course with whatever symbol)
 *
 * If Nan, also ...
 */
export const ultraLoadableFormatSymbol = (
  ultra: UltraToken,
  value: Decimal | number | null | undefined,
  symbolOverride?: string
) => {
  return ultraLoadableFormatSymbolCustom(
    ultra,
    value,
    ultra.displayDecimals,
    symbolOverride
  );
};

export const ultraLoadableFormatSymbolCustom = (
  ultra: UltraToken,
  value: Decimal | number | null | undefined,
  decimals: number,
  symbolOverride?: string
) => {
  const symbol = symbolOverride ?? ultra.symbol;
  if (value === undefined || value === null) {
    return "... " + symbol;
  }
  if (value instanceof Decimal && value.isNaN()) {
    return "... " + symbol;
  }
  if (typeof value === "number" && isNaN(value)) {
    return "... " + symbol;
  }

  return ultraGreatFloorLocaleN(ultra, value, decimals) + " " + symbol;
};
