import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import {
  BlueA,
  BlueB,
  YellowA,
  YellowB,
  GreenA,
  GreenB,
  PinkA,
  PinkB,
  RedA,
  RedB,
} from "../../09/glow09";
import { BoltSvg } from "./svg/BoltIcon";
import { InterestEarnedSvg } from "./svg/InterestEarnedIcon";
import { LoansOriginatedSvg } from "./svg/LoansOriginatedIcon";
import { TopPoolSvg } from "./svg/TopPoolIcon";
import { AlamedaIconSvg } from "./svg/AlamedaIcon";
import { ListIconSvg } from "./svg/ListIcon";
import { VerifiedIconSvg } from "./svg/VerifiedIcon";
import { SolanaIconSvg } from "./svg/SolanaIcon";

interface Props extends ComponentPropsWithoutRef<"svg"> {
  size?: number | string; // width and height will both be set as the same value
  name?: string;
}

const VoltPalette = () => (
  <defs>
    <linearGradient
      id="volt1"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor={BlueA} />
      <stop offset="0.9" stopColor={BlueB} />
    </linearGradient>

    <linearGradient
      id="volt2"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor={GreenA} />
      <stop offset="0.9" stopColor={GreenB} />
    </linearGradient>

    <linearGradient
      id="volt3"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor={YellowA} />
      <stop offset="0.9" stopColor={YellowB} />
    </linearGradient>

    <linearGradient
      id="volt4"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor={PinkA} />
      <stop offset="0.9" stopColor={PinkB} />
    </linearGradient>

    <linearGradient
      id="volt5"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor={RedA} />
      <stop offset="0.9" stopColor={RedB} />
    </linearGradient>
  </defs>
);

export const CustomIcon = (props: PropsWithChildren<Props>): JSX.Element => {
  const {
    children,
    width = 24,
    height = 24,
    size,
    viewBox = "0 0 24 24",
    name,
    ...rest
  } = props;

  return (
    <svg
      aria-labelledby={name}
      height={size || height}
      role="presentation"
      viewBox={viewBox}
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <VoltPalette />
      {children}
    </svg>
  );
};

export const InterestEarnedIcon = ({ ...props }: Props) => (
  <CustomIcon height={50} viewBox="0 0 50 50" width={50} {...props}>
    <InterestEarnedSvg />
  </CustomIcon>
);

export const LoansOriginatedIcon = ({ ...props }: Props) => (
  <CustomIcon height={50} viewBox="0 0 50 50" width={50} {...props}>
    <LoansOriginatedSvg />
  </CustomIcon>
);

export const TopPoolIcon = ({ ...props }: Props) => (
  <CustomIcon height={50} viewBox="0 0 50 50" width={50} {...props}>
    <TopPoolSvg />
  </CustomIcon>
);

export const BoltIcon = ({ ...props }: Props) => (
  <CustomIcon height={115} viewBox="0 0 89 115" width={89} {...props}>
    <BoltSvg />
  </CustomIcon>
);

export const AlamedaIcon = ({ ...props }: Props) => (
  <CustomIcon height={33} viewBox="0 0 33 33" width={33} {...props}>
    <AlamedaIconSvg />
  </CustomIcon>
);

export const ListIcon = ({ ...props }: Props) => (
  <CustomIcon height={24} width={24} viewBox="0 0 24 24" fill="none" {...props}>
    <ListIconSvg />
  </CustomIcon>
);

export const VerifiedIcon = ({ ...props }: Props) => (
  <CustomIcon width="54" height="52" viewBox="0 0 54 52" {...props}>
    <VerifiedIconSvg />
  </CustomIcon>
);

export const SolanaIcon = ({ ...props }: Props) => (
  <CustomIcon width="32" height="33" viewBox="0 0 32 33" {...props}>
    <SolanaIconSvg />
  </CustomIcon>
);
