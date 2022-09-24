import { css, Interpolation } from "@emotion/react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import styled from "@emotion/styled";
import { useAppWallet, useAppWalletModal } from "features/wallet";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import React, { useState } from "react";
import { colors09 } from "./colors09";
import Bolt from "./friktionLogos/bolt80.png";
import { errorToast } from "../utils/yummyNotifications";
import { useProviders } from "../hooks/useProvider";
import { useFriktionSDK } from "../hooks/useFriktionSDK";
import { PublicKey, SolanaProvider } from "@saberhq/solana-contrib";
import { FriktionSDK } from "@friktion-labs/friktion-sdk";
import { UseSail, useSail } from "@saberhq/sail";
import { HandleTxWrapped, useHandleTXWrapped } from "../hooks/handleTXWrapped";
import { Theme } from "@emotion/react";
import { VoltNumber } from "./registry10";

export type Button09Props = React.PropsWithChildren<{
  className?: string;
  css?: Interpolation<Theme>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean | JSX.Element | string;
  theme?: VoltNumber;
}>;

type ButtonA09Props = Omit<Button09Props, "onClick"> & {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href: string;
};

type ButtonLink09Props = Omit<Button09Props, "onClick"> & {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  to: string;
};

/**
 * A standard button. Buttons are minimum 180px
 */
export const Button09: (props: Button09Props) => EmotionJSX.Element = ({
  children,
  className,
  onClick,
  disabled,
  theme,
}: Button09Props) => {
  if (disabled !== false && disabled !== undefined) {
    return (
      <DisabledButton09 className={className} reason={disabled}>
        {children}
      </DisabledButton09>
    );
  }
  return (
    <Button09Styled
      type="button"
      className={
        (className + " " ?? "") +
        (theme ? ` Button09-${theme} ` : "") +
        " Button09"
      }
      onClick={onClick}
    >
      {children}
      <LightLayer className="LightLayer" />
    </Button09Styled>
  );
};

export type AsyncButton09Props = Omit<Button09Props, "children" | "onClick"> & {
  label: string;
  onClick: (
    goodies: Goodies,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void | null | boolean> | (() => Promise<void | null>);
  onError?: (e: Error) => void;
};
export type InternalAsyncButton09Props = AsyncButton09Props & {
  goodies: GoodiesWithoutLabel;
};
/**
 * A standard button. Buttons are minimum 180px. AsyncButton guarantees a valid
 * providerMut.
 *
 * onClick takes in a providerMut which is guaranteed to be valid
 *
 * Takes in label instead of children, because we freeze the label when clicked.
 */
const InternalAsyncButton09: (
  props: InternalAsyncButton09Props
) => EmotionJSX.Element = ({
  className,
  onClick,
  goodies,
  disabled,
  label,
  theme,
  onError,
}: InternalAsyncButton09Props) => {
  const [waiting, setWaiting] = useState(false);
  const [frozenText, setFrozenText] = useState<string | undefined>(undefined);
  if (disabled !== false && disabled !== undefined) {
    return (
      <DisabledButton09 className={className} reason={disabled}>
        {label}
      </DisabledButton09>
    );
  }
  return (
    <AsyncButton09Styled
      type="button"
      className={
        (className ?? "") +
        " Button09 AsyncButton09" +
        (theme ? ` Button09-${theme} ` : "") +
        (waiting ? " waiting" : "")
      }
      onClick={async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const goodiesWithLabel = Object.assign({}, goodies, { label });
        if (onClick && !waiting) {
          console.log("asyncing");
          try {
            const click = Promise.resolve<
              void | null | boolean | (() => Promise<void | null>)
            >(onClick(goodiesWithLabel, e));
            setWaiting(true);
            setFrozenText(label);
            await click;
          } catch (e) {
            if (e instanceof Error) {
              console.warn(e);
              if (onError) {
                onError(e);
              } else {
                errorToast(label + " error", "Unexpected error: " + e.message);
              }
            }
          }
          setWaiting(false);
          setFrozenText(undefined);
        }
      }}
    >
      <AsyncButton09Bolt src={Bolt}></AsyncButton09Bolt>
      <span className="asyncChildren">{frozenText ?? label}</span>
      <AsyncButton09Bolt src={Bolt} className={"alternate"} />

      <LightLayer className="LightLayer" />
    </AsyncButton09Styled>
  );
};

/**
 * An <a> that takes in a svg icon. Opens in blank page, because internal links
 * should be using <Link> instead.
 *
 * No background because the icon stands out on its own.
 */
export const SquareA09: (props: ButtonA09Props) => EmotionJSX.Element = ({
  children,
  href,
  className,
  onClick,
}: ButtonA09Props) => {
  return (
    <a
      href={href}
      target="_blank"
      className={(className ?? "") + " Button09"}
      onClick={onClick}
      css={Square09Styles}
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

/**
 * An <a> that looks like a button. Opens in blank page, because internal links
 * should be using <Link> instead.
 * */
export const LinkA09: (props: ButtonA09Props) => EmotionJSX.Element = ({
  children,
  href,
  className,
  onClick,
}: ButtonA09Props) => {
  return (
    <a
      href={href}
      target="_blank"
      className={(className ?? "") + " Button09"}
      onClick={onClick}
      css={button09Styles}
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

/**
 * An <button> that takes in a svg icon. Similar to SquareA09 but is a button
 *
 * No background because the icon stands out on its own.
 */
export const SquareButton09: (props: Button09Props) => EmotionJSX.Element = ({
  children,
  className,
  onClick,
  disabled,
}: Button09Props) => {
  return (
    <button
      type="button"
      className={(className ?? "") + " Button09"}
      onClick={onClick}
      css={Square09Styles}
      disabled={disabled ? true : undefined}
    >
      {children}
    </button>
  );
};

/**
 * An <button> that takes in a svg icon. Similar to SquareA09 but is a button with a background
 * */
export const SquareButton09WithBg: (
  props: Button09Props
) => EmotionJSX.Element = ({
  children,
  className,
  onClick,
  disabled,
}: Button09Props) => {
  return (
    <button
      type="button"
      className={(className ?? "") + " Button09"}
      onClick={onClick}
      css={Square09StylesWithBg}
      disabled={disabled ? true : undefined}
    >
      {children}
    </button>
  );
};

/**
 * <a> that looks like a button
 */
export const ButtonA09: (
  props: ButtonA09Props & { notBlank?: boolean }
) => EmotionJSX.Element = ({
  children,
  href,
  className,
  onClick,
  notBlank,
}: ButtonA09Props & { notBlank?: boolean }) => {
  return notBlank ? (
    <a
      className={(className ?? "") + " Button09"}
      href={href}
      css={Button09InlineBlockStyles}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <a
      className={(className ?? "") + " Button09"}
      href={href}
      target="_blank"
      rel="noreferrer"
      css={Button09InlineBlockStyles}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

/**
 * react router Link that looks like a Button09
 */
export const ButtonLink09 = ({
  children,
  className,
  to,
  onClick,
}: ButtonLink09Props) => {
  return (
    <Link
      to={to}
      className={(className ?? "") + " Button09"}
      css={Button09InlineBlockStyles}
      onClick={onClick}
    >
      <LightLayer className="LightLayer" />
      {children}
    </Link>
  );
};

/**
 * Table Button. Buttons are minimum 180px
 */
export const TableButton: (props: Button09Props) => EmotionJSX.Element = ({
  children,
  className,
  onClick,
  disabled,
}: Button09Props) => {
  if (disabled !== false && disabled !== undefined) {
    return (
      <DisabledButton09 className={className} reason={disabled}>
        {children}
      </DisabledButton09>
    );
  }
  return (
    <TableButton09Styled
      type="button"
      className={(className + " " ?? "") + " Button09"}
      onClick={onClick}
      css={css`
        height: 42px;
        &:hover ${LightLayer} {
          background: #111122;
          color: #fff;
        }
      `}
    >
      <LightLayer
        className="LightLayer"
        css={css`
          z-index: -1;
        `}
      />
      {children}
    </TableButton09Styled>
  );
};

/**
 * For hover effects so that we don't have to modify gradient colors.
 */
export const LightLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  pointer-events: none;
`;
export const button09Reset = css`
  position: relative;
  border-radius: 4px;
  background: #fff;
  appearance: none;
  border: 0px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: box-shadow 0.1s;
  font-family: "Euclid Circular B";
  font-weight: normal;
  outline: 0;
  color: #fff;
  :focus {
    outline: 2px solid rgba(255, 255, 255, 0.6);
  }

  :focus:not(.focus-visible),
  :focus:not(:focus-visible) {
    outline: none;
  }
  :active {
    outline: 2px solid rgba(255, 255, 255, 0.8);
  }
  text-align: center;
  font-size: 14px;
  letter-spacing: 0;
  &:hover {
    color: #fff;
  }

  &:disabled {
    cursor: not-allowed;
  }

  // part of reset because for someone to use LightLayer, they manually opted in
  // We don't have a brighter layer on focus because it looks like the button is stuck
  // and keyboard focus already has an outline
  &:hover ${LightLayer} {
    background: hsla(230, 15%, 70%, 0.14);
  }
`;
const insetShadowLine = `0 0.66px 0 0 rgba(250, 250, 255, 0.08) inset`;

export const button09Standard = css`
  display: block;

  min-width: 170px;
  min-height: 42px;
  box-shadow: ${insetShadowLine};
  :hover {
    box-shadow: ${insetShadowLine}, 0px 0px 8px 0 rgba(250, 250, 255, 0.1);
  }
  position: relative;
`;

/**
 * Variants are layered on TOP of the Button09Styles
 */
export const button09Variants = {
  muted: css``,
};

/**
 * Shows the Connect Wallet button if not connected
 *
 * Ignores disabled prop if wallet not connected
 */
export const ConnectedButton09: (props: Button09Props) => EmotionJSX.Element = (
  props: Button09Props
) => {
  const { publicKey } = useAppWallet();
  if (!publicKey) {
    return <ConnectWalletButton09 {...props} />;
  }

  return <Button09 {...props}></Button09>;
};

export const ConnectWalletButton09Raw: (
  props: Button09Props
) => EmotionJSX.Element = ({ children, className, onClick }: Button09Props) => {
  return (
    <Button09
      onClick={onClick}
      className={className}
      css={connectWalletButtonStyle}
    >
      {/* <IconedButtonLeft
        css={css`
          // The solana logo is a bit too imposing
          svg {
            margin: 0 auto;
            width: 18px;
            height: 18px;
            margin-bottom: 1px;
          }
        `}
      >
        <SolanaLogo />
      </IconedButtonLeft>
      <IconedButtonContent>Connect wallet</IconedButtonContent> */}
      Connect wallet
      <LightLayer className="LightLayer" />
    </Button09>
  );
};

export const ConnectWalletButton09Header: (
  props: Button09Props
) => EmotionJSX.Element = ({ children, className, onClick }: Button09Props) => {
  return (
    <IconedButton09
      type="button"
      onClick={onClick}
      className={className}
      css={headerConnectWalletButtonStyle}
    >
      <IconedButtonContent
        css={css`
          font-weight: bold;
          font-size: 12px;
        `}
      >
        Connect wallet
      </IconedButtonContent>
      <LightLayer
        css={css`
          border-radius: 8px;
        `}
        className="LightLayer"
      />
    </IconedButton09>
  );
};

/**
 * Stuff you get for free when using AsyncButton09!!!
 */
export type Goodies = {
  publicKey: PublicKey;
  providerMut: SolanaProvider;
  sdk: FriktionSDK;
  sail: UseSail;
  handleTXWrapped: HandleTxWrapped;
  /**
   * The frozen label at the time of button submission
   */
  label: string;
};
type GoodiesWithoutLabel = Omit<Goodies, "label">;
/**
 * Shows the Connect Wallet button if not connected.
 *
 * Ignores disabled prop if wallet not connected
 */
export const AsyncButton09: (
  props: AsyncButton09Props
) => EmotionJSX.Element = (props: AsyncButton09Props) => {
  const { publicKey } = useAppWallet();
  const { providerMut } = useProviders();
  const FriktionSDK = useFriktionSDK();

  const { handleTXWrapped } = useHandleTXWrapped();
  const sail = useSail();
  if (!publicKey || !providerMut || !sail) {
    return <ConnectWalletButton09 className={props.className} />;
  }

  const goodies: GoodiesWithoutLabel = {
    publicKey,
    providerMut,
    sdk: FriktionSDK,
    sail,
    handleTXWrapped,
  };

  return (
    <InternalAsyncButton09 {...props} goodies={goodies}></InternalAsyncButton09>
  );
};

export const DisabledButton09 = ({
  children,
  className,
  reason,
}: Button09Props & { reason: true | JSX.Element | string }) => {
  if (reason === true) {
    return (
      <button
        type="button"
        className={(className ?? "") + " Button09 DisabledButton09"}
        css={DisabledButton09Styles}
        disabled={true}
      >
        {children}
      </button>
    );
  }
  return (
    <Popover
      destroyTooltipOnHide
      placement="bottom"
      content={
        <span css={css`display: block;max-width: 280px}`}>{reason}</span>
      }
      trigger="hover"
    >
      <button
        type="button"
        className={(className ?? "") + " Button09 DisabledButton09"}
        css={DisabledButton09Styles}
        tabIndex={-1}
        // disabled={true} // We don't do this because it messes up the popover https://github.com/ant-design/ant-design/issues/18842
      >
        {children}
      </button>
    </Popover>
  );
};

export const button09Styles = css`
  ${button09Reset}
  ${button09Standard}
  line-height: 20px;
  padding: 10px 16px;
  color: #fff;
  ${colors09.buttonGradientBlue};
  user-select: none;
  text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);

  &.Button09-green,
  &.Button09-2 {
    ${colors09.buttonGradientGreen};
  }

  &.Button09-yellow,
  &.Button09-3 {
    ${colors09.buttonGradientYellow};
  }

  &.Button09-pink,
  &.Button09-4 {
    ${colors09.buttonGradientPink};
  }

  &.Button09-violet,
  &.Button09-5 {
    ${colors09.buttonGradientViolet};
  }

  &.Button09-red,
  &.Button09-6 {
    ${colors09.buttonGradientRed};
  }

  @media print {
    & {
      outline: 2px solid rgba(0, 0, 0, 0.2);
    }
  }
`;

export const tableButton09Styles = css`
  ${button09Reset}
  ${button09Standard}
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 20px;
  padding: 10px 16px;
  color: #fff;
  background: transparent;
  user-select: none;
  text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);
  border: 2px solid #2a2a51;
  border-radius: 8px;
  font-family: "Euclid Circular B";
  min-width: inherit;
  height: 42px;

  @media (max-width: 659px) {
    font-size: 12px;
    padding: 5px 8px;
  }

  @media print {
    & {
      outline: 2px solid rgba(0, 0, 0, 0.2);
    }
  }
`;

const Button09InlineBlockStyles = css`
  ${button09Styles}
  display: inline-block;
`;

const Square09Styles = css`
  ${button09Reset}
  display: inline-block;
  height: 42px;
  width: 42px;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 20px;
    height: 20px;
  }
  &:active {
    background: none;
  }
  &:hover {
    background: hsla(230, 30%, 70%, 0.3);
  }
`;

const Square09StylesWithBg = css`
  ${Square09Styles}
  background-color: #282A35 !important;
  margin-left: 0.25rem;
  &:active {
    opacity: 0.7;
  }
  &:hover {
    opacity: 0.6;
  }
`;

const Button09Styled = styled.button`
  ${button09Styles}
`;

const TableButton09Styled = styled.button`
  ${tableButton09Styles}
`;

export const AsyncButton09Bolt = styled.img`
  visibility: hidden;
  width: 16px;
  height: 16px;
  animation: heartbeat 0.8s linear infinite;
  @keyframes heartbeat {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }
    35% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.8);
    }
    75% {
      opacity: 0.8;
      transform: scale(0.8);
    }
    80% {
      opacity: 0.8;
      transform: scale(1);
    }
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
  }
  &.alternate {
    animation-delay: 0.4s;
  }
`;
const AsyncButton09Styled = styled.button`
  ${button09Styles}
  color: black;
  display: flex;
  align-items: center;
  justify-content: space-around;
  &:hover {
    color: rgba(0, 0, 0, 0.85);
  }
  &.waiting {
    cursor: wait;
  }
  &.waiting .asyncChildren {
    opacity: 0.4;
  }
  &.waiting ${AsyncButton09Bolt} {
    visibility: visible;
  }
`;

const DisabledButton09Styles = css`
  ${button09Styles}
  &,
  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(hsl(230, 15%, 30%) 20%, hsl(230, 15%, 29%) 80%);
    color: hsl(230, 15%, 60%) !important;
    outline: none;
    // just cuz a button is disabled, doesn't mean that light can't hit it
    /* box-shadow: none; */
  }
  cursor: not-allowed;
`;

/**
 * Has no background. User has to specify. But still has the same special effects
 */
export const IconedButton09 = styled.button`
  ${button09Reset}
  ${button09Standard}
  display: flex;
  color: #fff;

  // color: #000;
  font-size: 14px;
  text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);

  align-items: center;
`;

export const IconedButtonLeft = styled.div`
  // width: 50px;
  width: 25px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  margin-right: 6px;
  svg {
    margin: 0 auto;
    width: 20px;
    height: 20px;
    margin-bottom: 1px;
  }
`;
export const IconedButtonContent = styled.div`
  width: 50px;
  flex-grow: 1;
  align-items: center;
`;

export const hideIconedLeft = css`
  min-width: 140px;

  ${IconedButtonLeft} {
    display: none;
  }
  ${IconedButtonContent} {
    padding-right: 0;
  }
`;

const connectWalletButtonStyle = css`
  /* ${colors09.solanaGradient} */
  background: #ac3bab;
  /* text-shadow: 0 0.66px 0 rgba(0, 0, 0, 0.12);
  &.compact {
    @media screen and (max-width: 680px) {
      ${hideIconedLeft}
    }
  } */
`;

const headerConnectWalletButtonStyle = css`
  // background: linear-gradient(
  //   87.58deg,
  //   #7962e7 6.55%,
  //   #2b99da 54.37%,
  //   #00d18c 92.94%
  // ) !important;

  background: #491056 !important;
  width: 128px;
  height: 40px;
  border-radius: 8px;
  min-width: 0;
`;

export const ConnectWalletButton09: (
  props: Button09Props
) => EmotionJSX.Element = ({ children, className }: Button09Props) => {
  const { connect } = useAppWalletModal();

  return (
    <ConnectWalletButton09Raw
      className={(className ?? "") + " Button09 ConnectWalletButton09"}
      onClick={connect}
    />
  );
};

export const SolanaLogo: React.FC<React.SVGProps<SVGSVGElement>> = React.memo(
  (props) => (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#solana_logomark_clip_goki)">
        <path
          d="M2.59829 10.4132C2.69612 10.3119 2.82875 10.255 2.96704 10.255H15.7267C15.9592 10.255 16.0756 10.5463 15.9111 10.7166L13.3898 13.3277C13.292 13.4291 13.1594 13.486 13.0211 13.486H0.261373C0.0289306 13.486 -0.0874295 13.1947 0.0769974 13.0244L2.59829 10.4132Z"
          fill="currentcolor"
        />
        <path
          d="M2.59768 0.658221C2.69551 0.55691 2.82814 0.5 2.96643 0.5H15.7261C15.9586 0.5 16.075 0.791323 15.9105 0.961608L13.3892 3.57274C13.2914 3.67405 13.1588 3.73096 13.0205 3.73096H0.260763C0.0283203 3.73096 -0.0880399 3.43964 0.0763871 3.26935L2.59768 0.658221Z"
          fill="currentcolor"
        />
        <path
          d="M13.3898 5.50467C13.292 5.40334 13.1594 5.34647 13.0211 5.34647H0.261373C0.0289306 5.34647 -0.0874295 5.63776 0.0769975 5.80805L2.59829 8.41917C2.69612 8.52051 2.82875 8.57743 2.96704 8.57743H15.7267C15.9592 8.57743 16.0756 8.28609 15.9111 8.1158L13.3898 5.50467Z"
          fill="currentcolor"
        />
      </g>
      <defs>
        <clipPath id="solana_logomark_clip_goki">
          <rect
            width="16"
            height="13"
            fill="currentcolor"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
);
