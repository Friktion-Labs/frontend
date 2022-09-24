import { gsap } from "gsap";
import styled from "@emotion/styled";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { AnimationInnerOrbit } from "./AnimationInnerOrbit";
import { AnimationChart } from "./AnimationChart";
import { AnimationLogos } from "./AnimationLogos";
import { AnimationOuterOrbit } from "./AnimationOuterOrbit";

gsap.registerPlugin(MotionPathPlugin);

export function TimeWithFriktionAnimation() {
  return (
    <AnimationContainer>
      <AnimationInnerOrbit />
      <AnimationOuterOrbit />
      <AnimationChart />
      <AnimationLogos />
    </AnimationContainer>
  );
}

const AnimationContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100%;

  ${({ theme }) => theme.breakpoints.down("lg")} {
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 100%;
  }
`;
