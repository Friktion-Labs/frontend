import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Button09 } from "./Button09";
import { VoltNumber } from "./registry10";
import { SLAC1962 } from "./ZeroNineSuperParticleCollider";

const createCoolspan = (colorA: string, colorB: string) => {
  return styled.span`
    z-index: 1;

    position: relative;
    display: inline-block !important;
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: 200% auto;

    color: #fff;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
  `;
};

export const getCoolbarStyles = (colorA: string, colorB: string) => css`
  /* margin-bottom: 10px; */
  background: linear-gradient(
    50deg,
    ${colorA} 10%,
    ${colorB} 40%,
    ${colorB} 60%,
    ${colorA} 90%
  );
  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(20);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  &::selection {
    text-shadow: 0 0 0 #fff;
  }
`;
const createCoolbar = (colorA: string, colorB: string) => {
  return styled.div`
    height: 5px;
    width: 100%;
    position: relative;
    border-radius: 2px;
    ${getCoolbarStyles(colorA, colorB)}
  `;
};

const createNonAnimatedCoolbar = (colorA: string, colorB: string) => {
  return styled.div`
    height: 5px;
    width: 100%;
    position: relative;
    border-radius: 2px;
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: 200% auto;
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
  `;
};

const createVerticalCoolbar = (colorA: string, colorB: string) => {
  return styled.div`
    position: relative;
    height: 100%;
    width: 5px;
    /* border-radius: 2px; */
    /* margin-bottom: 10px; */
    background: linear-gradient(
      140deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: auto 200%;
    /* // stop the animation for now */
    /* animation: scrollshineVertical 1.5s linear infinite;
    animation-timing-function: steps(20);
    @keyframes scrollshineVertical {
      to {
        background-position: center 200%;
      }
    } */
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
  `;
};

const createCoolbox = (colorA: string, colorB: string) => {
  return styled.div`
    position: relative;
    border-radius: 2px;
    /* margin-bottom: 10px; */
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
  `;
};

const createCrabBar = (colorA: string, colorB: string) => {
  const width = "100%";
  const height = "2px";
  return styled.div`
    position: relative;
    height: ${height};
    width: ${width};
    border-radius: 2px;
    /* margin-bottom: 10px; */
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
  `;
};

const createGlowbar = (colorA: string, colorB: string): (() => JSX.Element) => {
  const Container = styled.div`
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;

    position: relative;
    width: 100%;
    height: 30px;
    /* outline: 1px solid red; */
    opacity: 0.3;
  `;
  const GlowBar = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
  `;
  const Mask = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
  `;
  return () => {
    return (
      <Container className="glowbar">
        <GlowBar />
        <Mask />
      </Container>
    );
  };
};

const createLinearGradient = (colorA: string, colorB: string) =>
  `linear-gradient(90deg, ${colorA} 0%, ${colorB} 100%)`;

/**
 * fills parent element and glows (and compensats by extending towards sides)
 */
const createFillGlow = (colorA: string, colorB: string) => {
  return styled.div`
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;

    position: absolute;
    top: -2px;
    bottom: -2px;
    left: -8px;
    right: -8px;
    filter: blur(12px);
    /* margin-bottom: 10px; */
    background: linear-gradient(
      50deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );

    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    &::selection {
      text-shadow: 0 0 0 #fff !important;
    }
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
  `;
};

export const createGlowBolt = (colorA: string, colorB: string) => styled.div`
  clip-path: url(#boltPathRelative);

  background: linear-gradient(
    70deg,
    ${colorA} 10%,
    ${colorB} 40%,
    ${colorB} 60%,
    ${colorA} 90%
  );

  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(60);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
`;

const createChevronRight = (colorA: string, colorB: string) => styled.div`
  ${getFilledButtonStyles(colorA, colorB)}
  clip-path: url(#chevronRightPathRelative);

  /* background: linear-gradient(
    90deg,
    ${colorA} 10%,
    ${colorB} 40%,
    ${colorB} 60%,
    ${colorA} 90%
  );

  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(60);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  } */
`;

interface GlowBorderStylesOptions {
  gradientAngle?: string;
  borderRadius?: string;
  borderWidth?: string;
}
export const getGlowBorderStyles = (
  colorA: string,
  colorB: string,
  options: GlowBorderStylesOptions = {}
) => `
  background: transparent;
  opacity: 0;
  position: relative;
  z-index: 0;
  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    padding: ${options.borderWidth ?? "2px"};
    border-radius: ${options.borderRadius ?? "8px"};
    background: linear-gradient(
      ${options.gradientAngle ?? "50deg"},
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    background-size: 200% auto;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
  }
`;

const createGlowButton = (colorA: string, colorB: string) => styled(Button09)`
  ${getGlowBorderStyles(colorA, colorB)}
  border: 0;
  outline: 0;
  border-radius: 8px;
  cursor: pointer;
  & .LightLayer {
    border-radius: 8px;
  }
`;

export const getFilledButtonStyles = (colorA: string, colorB: string) => `
  background: linear-gradient(90deg, ${colorA} 0%, ${colorB} 100%);
`;

const createFilledButton = (colorA: string, colorB: string) => styled(Button09)`
  ${getFilledButtonStyles(colorA, colorB)}
  border: 0;
  outline: 0;
  border-radius: 8px;
  cursor: pointer;
  & .LightLayer {
    border-radius: 8px;
  }
`;

export const createCardGlowBG = (colorA: string, colorB: string) => styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  top: -1px;
  left: -1px;
  background: linear-gradient(
    80deg,
    ${colorA} 10%,
    ${colorB} 40%,
    ${colorB} 60%,
    ${colorA} 90%
  );
  filter: blur(7px);
  opacity: 0;
  transition: opacity 0.2s;
  background-size: 200% auto;
  animation: scrollshine 1.5s linear infinite reverse;
  animation-timing-function: steps(20);
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  ::selection {
    text-shadow: 0 0 0 #fff !important;
  }
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
`;

export const BlueA = "#637dff";
export const BlueB = "#17c9ff";

export const YellowA = "#ffc003";
export const YellowB = "#cfe600";

export const GreenA = "#28edbf";
export const GreenB = "#5ded39";

// Not-STD
export const PinkA = "#a695fc";
export const PinkB = "#f27ee3";

export const RedA = "#FF47C2";
export const RedB = "#FFA18F";

export const VioletA = "#905CFF";
export const VioletB = "#D4B3FF";
export const getVoltColorPair = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return [BlueA, BlueB];
  } else if (voltNum === 2) {
    return [GreenA, GreenB];
  } else if (voltNum === 3) {
    return [YellowA, YellowB];
  } else if (voltNum === 4) {
    return [PinkA, PinkB];
  } else if (voltNum === 5) {
    return [VioletA, VioletB];
  } else {
    return [RedA, RedB];
  }
};

export const BlueGradient = createLinearGradient(BlueA, BlueB);
export const YellowGradient = createLinearGradient(YellowA, YellowB);
export const AlanGreenGradient = createLinearGradient(GreenA, GreenB);
export const PinkGradient = createLinearGradient(PinkA, PinkB);
export const RedGradient = createLinearGradient(RedA, RedB);
export const VioletGradient = createLinearGradient(VioletA, VioletB);
export const getLinearGradient = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueGradient;
  } else if (voltNum === 2) {
    return AlanGreenGradient;
  } else if (voltNum === 3) {
    return YellowGradient;
  } else if (voltNum === 4) {
    return PinkGradient;
  } else if (voltNum === 5) {
    return VioletGradient;
  } else {
    return RedGradient;
  }
};

export const BlueSpan = createCoolspan(BlueA, BlueB);
export const YellowSpan = createCoolspan(YellowA, YellowB);
export const AlanGreenSpan = createCoolspan(GreenA, GreenB);
export const PinkSpan = createCoolspan(PinkA, PinkB);
export const RedSpan = createCoolspan(RedA, RedB);
export const VioletSpan = createCoolspan(VioletA, VioletB);
export const getVoltSpan = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueSpan;
  } else if (voltNum === 2) {
    return AlanGreenSpan;
  } else if (voltNum === 3) {
    return YellowSpan;
  } else if (voltNum === 4) {
    return PinkSpan;
  } else if (voltNum === 5) {
    return VioletSpan;
  } else {
    return RedSpan;
  }
};

export type BarComponentType = ReturnType<typeof createCoolbar>;
export const BlueBar = createCoolbar(BlueA, BlueB);
export const YellowBar = createCoolbar(YellowA, YellowB);
export const GreenBar = createCoolbar(GreenA, GreenB);
export const PinkBar = createCoolbar(PinkA, PinkB);
export const VioletBar = createCoolbar(VioletA, VioletB);
export const RedBar = createCoolbar(RedA, RedB);

export const BlueNonAnimatedBar = createNonAnimatedCoolbar(BlueA, BlueB);
export const YellowNonAnimatedBar = createNonAnimatedCoolbar(YellowA, YellowB);
export const GreenNonAnimatedBar = createNonAnimatedCoolbar(GreenA, GreenB);
export const PinkNonAnimatedBar = createNonAnimatedCoolbar(PinkA, PinkB);
export const VioletNonAnimatedBar = createNonAnimatedCoolbar(VioletA, VioletB);
export const RedNonAnimatedBar = createNonAnimatedCoolbar(RedA, RedB);

export const getVoltBar = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueBar;
  } else if (voltNum === 2) {
    return GreenBar;
  } else if (voltNum === 3) {
    return YellowBar;
  } else if (voltNum === 4) {
    return PinkBar;
  } else if (voltNum === 5) {
    return VioletBar;
  } else {
    return RedBar;
  }
};

export const BlueBox = createCoolbox(BlueA, BlueB);
export const YellowBox = createCoolbox(YellowA, YellowB);
export const GreenBox = createCoolbox(GreenA, GreenB);
export const PinkBox = createCoolbox(PinkA, PinkB);
export const VioletBox = createCoolbox(VioletA, VioletB);
export const YellowCrabBar = createCrabBar(YellowA, YellowB);

export const VerticalBlueBar = createVerticalCoolbar(BlueA, BlueB);
export const VerticalYellowBar = createVerticalCoolbar(YellowA, YellowB);
export const VerticalGreenBar = createVerticalCoolbar(GreenA, GreenB);
export const VerticalPinkBar = createVerticalCoolbar(PinkA, PinkB);
export const VerticalVioletBar = createVerticalCoolbar(VioletA, VioletB);
export const VerticalRedBar = createVerticalCoolbar(RedA, RedB);
export const getVerticalVoltBar = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return VerticalBlueBar;
  } else if (voltNum === 2) {
    return VerticalGreenBar;
  } else if (voltNum === 3) {
    return VerticalYellowBar;
  } else if (voltNum === 4) {
    return VerticalPinkBar;
  } else if (voltNum === 5) {
    return VerticalVioletBar;
  } else {
    return VerticalRedBar;
  }
};

export const BlueGlowBar = createGlowbar(BlueA, BlueB);
export const YellowGlowBar = createGlowbar(YellowA, YellowB);
export const GreenGlowBar = createGlowbar(GreenA, GreenB);
export const PinkGlowBar = createGlowbar(PinkA, PinkB);
export const VioletGlowBar = createGlowbar(VioletA, VioletB);

export const BlueFillGlow = createFillGlow(BlueA, BlueB);
export const YellowFillGlow = createFillGlow(YellowA, YellowB);
export const GreenFillGlow = createFillGlow(GreenA, GreenB);
export const PinkFillGlow = createFillGlow(PinkA, PinkB);
export const VioletFillGlow = createFillGlow(VioletA, VioletB);
export const RedFillGlow = createFillGlow(RedA, RedB);

export const BlueBolt = createGlowBolt(BlueA, BlueB);
export const YellowBolt = createGlowBolt(YellowA, YellowB);
export const GreenBolt = createGlowBolt(GreenA, GreenB);
export const PinkBolt = createGlowBolt(PinkA, PinkB);
export const RedBolt = createGlowBolt(RedA, RedB);
export const VioletBolt = createGlowBolt(VioletA, VioletB);
export const getVoltBolt = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueBolt;
  } else if (voltNum === 2) {
    return GreenBolt;
  } else if (voltNum === 3) {
    return YellowBolt;
  } else if (voltNum === 4) {
    return PinkBolt;
  } else if (voltNum === 5) {
    return VioletBolt;
  } else {
    return RedBolt;
  }
};

export const BlueChevronRight = createChevronRight(BlueA, BlueB);
export const YellowChevronRight = createChevronRight(YellowA, YellowB);
export const GreenChevronRight = createChevronRight(GreenA, GreenB);
export const PinkChevronRight = createChevronRight(PinkA, PinkB);
export const VioletChevronRight = createChevronRight(VioletA, VioletB);
export const RedChevronRight = createChevronRight(RedA, RedB);
export const getVoltChevronRight = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueChevronRight;
  } else if (voltNum === 2) {
    return GreenChevronRight;
  } else if (voltNum === 3) {
    return YellowChevronRight;
  } else if (voltNum === 4) {
    return PinkChevronRight;
  } else if (voltNum === 5) {
    return VioletChevronRight;
  } else {
    return RedChevronRight;
  }
};

export const BlueGlowButton = createGlowButton(BlueA, BlueB);
export const YellowGlowButton = createGlowButton(YellowA, YellowB);
export const GreenGlowButton = createGlowButton(GreenA, GreenB);
export const PinkGlowButton = createGlowButton(PinkA, PinkB);
export const VioletGlowButton = createGlowButton(VioletA, VioletB);
export const RedGlowButton = createGlowButton(RedA, RedB);
export const getGlowButton = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueGlowButton;
  } else if (voltNum === 2) {
    return GreenGlowButton;
  } else if (voltNum === 3) {
    return YellowGlowButton;
  } else if (voltNum === 4) {
    return PinkGlowButton;
  } else if (voltNum === 5) {
    return VioletGlowButton;
  } else {
    return RedGlowButton;
  }
};

export const BlueButton = createFilledButton(BlueA, BlueB);
export const YellowButton = createFilledButton(YellowA, YellowB);
export const GreenButton = createFilledButton(GreenA, GreenB);
export const PinkButton = createFilledButton(PinkA, PinkB);
export const VioletButton = createFilledButton(VioletA, VioletB);
export const RedButton = createFilledButton(RedA, RedB);
export const getFilledButton = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueButton;
  } else if (voltNum === 2) {
    return GreenButton;
  } else if (voltNum === 3) {
    return YellowButton;
  } else if (voltNum === 4) {
    return PinkButton;
  } else if (voltNum === 5) {
    return VioletButton;
  } else {
    return RedButton;
  }
};

export const getBlueGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(BlueA, BlueB, options);
export const getYellowGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(YellowA, YellowB, options);
export const getGreenGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(GreenA, GreenB, options);
export const getPinkGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(PinkA, PinkB, options);
export const getVioletGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(VioletA, VioletB, options);
export const getRedGlowBorderStyles = (options?: GlowBorderStylesOptions) =>
  getGlowBorderStyles(RedA, RedB, options);

export const getVoltGlowBorderStyles = (
  voltNum: VoltNumber,
  options?: GlowBorderStylesOptions
) => {
  if (voltNum === 1) {
    return getBlueGlowBorderStyles(options);
  } else if (voltNum === 2) {
    return getGreenGlowBorderStyles(options);
  } else if (voltNum === 3) {
    return getYellowGlowBorderStyles(options);
  } else if (voltNum === 4) {
    return getPinkGlowBorderStyles(options);
  } else if (voltNum === 5) {
    return getVioletGlowBorderStyles(options);
  } else {
    return getRedGlowBorderStyles(options);
  }
};

// GlowBG for all cards
export const BlueCardGlowBG = createCardGlowBG(BlueA, BlueB);
export const YellowCardGlowBG = createCardGlowBG(YellowA, YellowB);
export const GreenCardGlowBG = createCardGlowBG(GreenA, GreenB);
export const PinkCardGlowBG = createCardGlowBG(PinkA, PinkB);
export const VioletCardGlowBG = createCardGlowBG(VioletA, VioletB);
export const RedCardGlowBG = createCardGlowBG(RedA, RedB);

export const getCardGlowBG = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueCardGlowBG;
  } else if (voltNum === 2) {
    return GreenCardGlowBG;
  } else if (voltNum === 3) {
    return YellowCardGlowBG;
  } else if (voltNum === 4) {
    return PinkCardGlowBG;
  } else if (voltNum === 5) {
    return VioletCardGlowBG;
  } else {
    return RedCardGlowBG;
  }
};

const particleCount = window.innerWidth < 420 ? 20 : 45;

// console.time("Particle Collider Generation");
// ... the memo isn't working that well .. ok the cost is in the animation
export const BlueParticlesBottom = React.memo(() =>
  SLAC1962(BlueA, BlueB, "bottom-up", particleCount, 25)
);
export const YellowParticlesBottom = React.memo(() =>
  SLAC1962(YellowA, YellowB, "bottom-up", particleCount, 0)
);
export const GreenParticlesBottom = React.memo(
  () => SLAC1962(GreenA, GreenB, "bottom-up", particleCount, 10) // because the text is wider
);
export const BlueParticlesRadial = React.memo(() =>
  SLAC1962(BlueA, BlueB, "radial", particleCount * 2, 35)
);
export const BlueParticlesRadialFew = React.memo(() =>
  SLAC1962(BlueA, BlueB, "radial", particleCount * 1.3, 35)
);
export const GreenParticlesRadial = React.memo(() =>
  SLAC1962(GreenA, GreenB, "radial", particleCount * 2, 35)
);
export const GreenParticlesRadialFew = React.memo(() =>
  SLAC1962(GreenA, GreenB, "radial", particleCount * 1.3, 35)
);
export const YellowParticlesRadial = React.memo(() =>
  SLAC1962(YellowA, YellowB, "radial", particleCount * 2, 35)
);
export const YellowParticlesRadialFew = React.memo(() =>
  SLAC1962(YellowA, YellowB, "radial", particleCount * 1.3, 35)
);
export const PinkParticlesRadial = React.memo(() =>
  SLAC1962(PinkA, PinkB, "radial", particleCount * 2, 35)
);
export const PinkParticlesRadialFew = React.memo(() =>
  SLAC1962(PinkA, PinkB, "radial", particleCount * 1.3, 35)
);
export const VioletParticlesRadial = React.memo(() =>
  SLAC1962(VioletA, VioletB, "radial", particleCount * 2, 35)
);
export const RedParticlesRadialFew = React.memo(() =>
  SLAC1962(RedA, RedB, "radial", particleCount * 1.3, 35)
);

export const PinkParticlesRadialFewer = React.memo(() =>
  SLAC1962(PinkA, PinkB, "radial", particleCount * 1, 35)
);
// console.timeEnd("Particle Collider Generation");

// Volt styles
export const createVoltTag = (colorA: string, colorB: string) =>
  `
    background: linear-gradient(
      80deg,
      ${colorA} 10%,
      ${colorB} 40%,
      ${colorB} 60%,
      ${colorA} 90%
    ) border-box;
    background-size: 200% auto;
    color: #fff;
    animation: scrollshine 1.5s linear infinite reverse;
    animation-timing-function: steps(20);
    @keyframes scrollshine {
      to {
        background-position: 200% center;
      }
    }
    *::selection,
    &::selection {
      text-shadow: 0 0 0 #fff;
    }
`;

const BlueVolt = createVoltTag(BlueA, BlueB);
const YellowVolt = createVoltTag(YellowA, YellowB);
const AlanGreenVolt = createVoltTag(GreenA, GreenB);
const PinkVolt = createVoltTag(PinkA, PinkB);
const VioletVolt = createVoltTag(VioletA, VioletB);
const RedVolt = createVoltTag(RedA, RedB);

export const getVolt = (voltNum: VoltNumber) => {
  if (voltNum === 1) {
    return BlueVolt;
  } else if (voltNum === 2) {
    return AlanGreenVolt;
  } else if (voltNum === 3) {
    return YellowVolt;
  } else if (voltNum === 4) {
    return PinkVolt;
  } else if (voltNum === 5) {
    return VioletVolt;
  } else {
    return RedVolt;
  }
};
