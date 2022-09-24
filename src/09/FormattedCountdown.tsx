// import moment from "moment";
import { Interpolation, Theme } from "@emotion/react";
import Countdown, { zeroPad } from "react-countdown";

// export if you relaly do need to use it elsewhere. but try to keep things here
export const getWeeklyExpiration = (): Date => {
  let now = Date.now();
  let epochEnd = 1646359199000;

  while (now > epochEnd) {
    epochEnd = epochEnd + 7 * 24 * 60 * 60 * 1000;
  }
  // console.log(epochEnd);
  return new Date(epochEnd);
};

export const getDailyExpiration = (): Date => {
  let now = Date.now();
  let epochEnd = 1657756800000;

  while (now > epochEnd) {
    epochEnd = epochEnd + 7 * 24 * 60 * 60 * 1000;
  }
  return new Date(epochEnd);
};
export const EpochCountdown: React.FC<{
  isEntropy?: boolean;
  css?: Interpolation<Theme>;
  className?: string;
}> = ({ isEntropy, ...rest }) => (
  <Countdown
    date={isEntropy ? getDailyExpiration() : getWeeklyExpiration()}
    renderer={({ days, hours, minutes, seconds }) =>
      (isEntropy
        ? getDailyExpiration().getTime()
        : getWeeklyExpiration().getTime()) -
        Date.now() <
      6.3 * 24 * 60 * 60 * 1000 ? (
        <span {...rest}>
          {days > 0 ? `${days}d ` : null}
          {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s
        </span>
      ) : (
        <span {...rest}>Rebalancing</span>
      )
    }
  />
);
