const MAX_YEARS = 11;
const TOTAL_YEARS_SHOWN = 11;

const MONTHS_IN_YEAR = 12;
const SAVINGS_ACCOUNT_MPY = 0.25;
const FRIKTION_MPY_NERFED = 1.5; // MPY is reduced to make chart display scale better

const calculateAnnuity = (
  depositPerPeriod: number,
  interestRatePercentage: number,
  numberOfDeposits: number
) =>
  (depositPerPeriod *
    (Math.pow(1 + interestRatePercentage / 100, numberOfDeposits) - 1)) /
  (interestRatePercentage / 100);

export const getGrowthChartData = (
  monthlyDeposits: number,
  actualVoltsMeanMpy?: number | undefined
) => {
  const futureValues = Array.from({ length: TOTAL_YEARS_SHOWN }, (_, i) => {
    const numberOfDeposits =
      i * MONTHS_IN_YEAR * (MAX_YEARS / TOTAL_YEARS_SHOWN);

    return {
      year: i * (MAX_YEARS / TOTAL_YEARS_SHOWN),

      // in the case where we want to display the real returns on mouse hover
      friktionActual:
        actualVoltsMeanMpy !== undefined
          ? calculateAnnuity(
              monthlyDeposits,
              actualVoltsMeanMpy,
              numberOfDeposits
            )
          : -1,

      friktionDisplay: calculateAnnuity(
        monthlyDeposits,
        FRIKTION_MPY_NERFED,
        numberOfDeposits
      ),
      savingsAccount: calculateAnnuity(
        monthlyDeposits,
        SAVINGS_ACCOUNT_MPY,
        numberOfDeposits
      ),
    };
  });

  return futureValues;
};
