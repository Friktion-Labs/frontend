import { Card09Props } from "09/Card10";

export const getTotalDepositsUSD = (card: Card09Props) => {
  const highVoltageData = card.highVoltageData;
  const data = card.data;

  const totalDepositsUSD = !data
    ? null
    : highVoltageData
    ? highVoltageData.totalDepositsUSD.add(data.totalDepositsUSD)
    : data.totalDepositsUSD;

  return totalDepositsUSD;
};

export const getTotalDeposits = (card: Card09Props) => {
  const highVoltageData = card.highVoltageData;
  const data = card.data;

  const totalDeposits = !data
    ? null
    : highVoltageData
    ? highVoltageData.totalDeposits.add(data.totalDeposits)
    : data.totalDeposits;

  return totalDeposits;
};

export const getCapacity = (card: Card09Props) => {
  const highVoltageData = card.highVoltageData;
  const data = card.data;

  const capacity = !data
    ? null
    : highVoltageData
    ? highVoltageData.capacity.add(data.capacity)
    : data.capacity;

  return capacity;
};

export const getYourDeposits = (card: Card09Props) => {
  const deposits = card.deposits;
  const highVoltageDeposits = card.highVoltageDeposits;
  const yourDeposits = !deposits
    ? null
    : highVoltageDeposits
    ? highVoltageDeposits.totalDeposits.add(deposits.totalDeposits)
    : deposits.totalDeposits;

  return yourDeposits;
};

export const getCapacityFilledPercent = (card: Card09Props): number => {
  const totalDeposits = getTotalDeposits(card);
  const capacity = getCapacity(card);
  const MIN_FILLED_PERCENT = 0.1;
  const capacityFilledPercent =
    !totalDeposits || !capacity
      ? MIN_FILLED_PERCENT
      : Math.max(
          MIN_FILLED_PERCENT,
          (totalDeposits.toNumber() / capacity.toNumber()) * 100
        );
  return capacityFilledPercent;
};

const getCardStats = (card: Card09Props) => {
  const totalDepositsUSD = getTotalDepositsUSD(card);
  const yourDeposits = getYourDeposits(card);

  // get percentage for progress bar
  const capacityFilledPercent = getCapacityFilledPercent(card);

  return {
    totalDepositsUSD,
    yourDeposits,
    capacityFilledPercent,
  };
};

export default getCardStats;
