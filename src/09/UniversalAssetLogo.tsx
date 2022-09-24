import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { BlueA, BlueB, GreenA, GreenB } from "./glow09";
import { ImportantAssetLogos } from "./greatLogos/assetLogos";
import { AllSymbolsUnion, SubvoltDef10, UltraToken } from "./registry10";
import { VoltTokenIcon } from "./VoltTokenIcon";

export const ManualUniversalAssetLogo = ({
  mainSymbol,
  secondarySymbol,
  ...rest
}: {
  mainSymbol: AllSymbolsUnion;
  secondarySymbol?: AllSymbolsUnion;
  css?: SerializedStyles;
}) => {
  return (
    <UniversalAssetLogoContainer {...rest}>
      <MainImg
        className={secondarySymbol ? "withSecondary" : ""}
        width={36}
        height={36}
        src={ImportantAssetLogos[mainSymbol]}
        alt=""
      />
      {secondarySymbol ? (
        <SecondaryImg
          width={24}
          height={24}
          src={ImportantAssetLogos[secondarySymbol]}
          alt=""
        />
      ) : null}
    </UniversalAssetLogoContainer>
  );
};

export const AutoUniversalAssetLogo: React.FC<{
  def: SubvoltDef10;
  css?: SerializedStyles;
}> = ({ def, ...rest }) => {
  return (
    <ManualUniversalAssetLogo
      {...rest}
      mainSymbol={
        def.optionType === "call"
          ? def.underlying.symbol
          : def.depositToken.symbol
      }
      secondarySymbol={
        def.optionType === "call" ? undefined : def.underlying.symbol
      }
    />
  );
};

/**
 * Displays single asset logo for usage inline
 */
export const MiniAssetLogo: React.FC<{ ultra: UltraToken }> = ({ ultra }) => {
  return <MiniAssetLogoImg src={ultra.icon} alt="" />;
};

const MiniAssetLogoImg = styled.img`
  vertical-align: middle;
  width: 14px;
  height: 14px;
  margin-bottom: 3px;
  margin-right: 6px;
  user-select: none;
`;

export const MiniShareTokenLogo: React.VFC<{ def: SubvoltDef10 }> = ({
  def,
}) => {
  if (def.volt === 1) {
    return (
      <MiniShareTokenContainer>
        <VoltTokenIcon voltNum={1} colorA={BlueA} colorB={BlueB}>
          <AutoUniversalAssetLogo def={def} />
        </VoltTokenIcon>
      </MiniShareTokenContainer>
    );
  }
  return (
    <MiniShareTokenContainer>
      <VoltTokenIcon voltNum={2} colorA={GreenA} colorB={GreenB}>
        <AutoUniversalAssetLogo def={def} />
      </VoltTokenIcon>
    </MiniShareTokenContainer>
  );
};

const MiniShareTokenContainer = styled.span`
  vertical-align: middle;
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-bottom: 3px;
  margin-right: 7px;
  position: relative;
  user-select: none;

  > div {
    display: inline-block;
    /* border: 1px solid rgba(255, 255, 255, 0.5); */
    box-shadow: 0 0 0 7px hsl(230, 15%, 30%);

    /* width: 14px;
    height: 14px; */
    transform-origin: 0px -1px;
    /* transform: scale(0.5); */
    transform: scale(0.14);
    border-radius: 50%;
    /* top: 30px; */
    /* left: 30px; */
  }
`;

const UniversalAssetLogoContainer = styled.div`
  width: 36px;
  height: 36px;
  position: relative;
  user-select: none;
`;

const MainImg = styled.img`
  position: absolute;
  z-index: 3 !important;
  &.withSecondary {
    width: 34px;
    height: 34px;
    bottom: 1px;
    left: -8px;
  }
`;

const SecondaryImg = styled.img`
  position: absolute;
  z-index: 2 !important;
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: 6px;
  right: -9px;
`;
