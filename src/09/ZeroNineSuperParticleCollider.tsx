import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const cache: Record<string, JSX.Element> = {};

/**
 * https://en.wikipedia.org/wiki/SLAC_National_Accelerator_Laboratory
 *
 * opacityBoost is useful for dark colors that need a bit more opacity to show up
 * Should be less than 30
 */
export const SLAC1962 = (
  colorA: string,
  colorB: string,
  source: "bottom-up" | "radial",
  n = 60,
  opacityBoost = 0
) => {
  const cacheKey = n + colorA + colorB + source + opacityBoost;
  const cacheResult = cache[cacheKey];
  if (cacheResult) {
    return cacheResult;
  } else {
    const colliders = (
      <span>
        {Array.from({ length: n }, (x, i) => {
          const collider = Generate09LargeHardonSuperParticleCollider(
            colorA,
            colorB,
            source,
            opacityBoost,
            i
          );
          return collider;
        })}
      </span>
    );
    cache[cacheKey] = colliders;
    return colliders;
  }
};

/**
 * ```c
 *              k;double sin()
 *          ,cos();main(){float A=
 *        0,B=0,i,j,z[1760];char b[
 *      1760];printf("\x1b[2J");for(;;
 *   ){memset(b,32,1760);memset(z,0,7040)
 *   ;for(j=0;6.28>j;j+=0.07)for(i=0;6.28
 *  >i;i+=0.02){float c=sin(i),d=cos(j),e=
 *  sin(A),f=sin(j),g=cos(A),h=d+2,D=1/(c*
 *  h*e+f*g+5),l=cos      (i),m=cos(B),n=s\
 * in(B),t=c*h*g-f*        e;int x=40+30*D*
 * (l*h*m-t*n),y=            12+15*D*(l*h*n
 * +t*m),o=x+80*y,          N=8*((f*e-c*d*g
 *  )*m-c*d*e-f*g-l        *d*n);if(22>y&&
 *  y>0&&x>0&&80>x&&D>z[o]){z[o]=D;;;b[o]=
 *  ".,-~:;=!*#$@"[N>0?N:0];}}*#****!!-*
 *   printf("\x1b[H");for(k=0;1761>k;k++)
 *   putchar(k%80?b[k]:10);A+=0.04;B+=
 *     0.02;}}*****####*******!!=;:~
 *       ~::==!!!**********!!!==::-
 *         .,~~;;;========;;;:~-.
 *             ..,--------,*
 * ```
 *
 * Color should be a 6 digit hex color code with the #.
 *
 * Will do random linear interpolation between the two colors
 */
export const Generate09LargeHardonSuperParticleCollider = (
  colorCodeA: string,
  colorCodeB: string,
  source: "bottom-up" | "radial",
  opacityBoost: number,
  key: number
) => {
  // console.log(
  //   "This should only be called on the very first page load due to our caching"
  // );

  const colorBetween = lerpColor(colorCodeA, colorCodeB, randNum(0.01, 0.99));

  // U(0.8, 1.7)
  let particleTransformScale =
    Math.round((Math.random() * 0.9 + 0.8) * 100) / 100;
  if (particleTransformScale < 1) {
    // native size is crisp
    particleTransformScale = 1;
  }
  if (particleTransformScale > 1.5) {
    // 1.5x on retina is 3px. crisp.
    particleTransformScale = 1.5;
  }

  // speed is partially affected by scale! But not completely.
  // So big particles are half the speed
  //  duration   scale
  // U(7, 11) *  U(1.0, 1.5) ^ 1.5
  const animationDuration =
    Math.round(
      Math.pow(particleTransformScale, 1.5) * (Math.random() * 6 + 8) * 100
    ) / 100;

  const bodyOpacity = randHex(
    190 + opacityBoost,
    Math.min(255, 230 + opacityBoost)
  );
  const tailOpacity = randHex(0, 30 + Math.floor(opacityBoost / 4));
  // const shadowOpacity = randHex(
  //   0,
  //   Math.max(0, Math.min(Number("0x" + tailOpacity), 35) - 5)
  // ); // don't have shadow be brighter than tail, because it looks weird since there is an empty tail

  // console.log("bodyOpacity", bodyOpacity);
  // console.log("tailOpacity", tailOpacity);
  // console.log("shadowOpacity", shadowOpacity);

  // console.log("particleTransformScale", `scale(${particleTransformScale})`);
  // console.log("animationDuration", `${animationDuration}s`);
  const left = randNum(15, 85);
  const top = randNum(35, 65);

  // For some reason, iOS performance is MUCH better when the line is longer than 500px
  // maybe it's some sort of optimization happening..
  const lineLength = randInt(51, 64);

  // rotation based on angle between destination and center of parent
  let rotationBasedOnSource = 90;
  if (source === "radial") {
    rotationBasedOnSource =
      (Math.atan2(top - 50, 1.5 * (left - 50)) * 180) / Math.PI;
    // Multiply by 1.5 to bias more to coming from the sides
  }

  const hardonStyle = {
    left: `${left}%`,
    top: `${top}%`,
    transform: `rotate(${rotationBasedOnSource}deg)`,
    width: `${lineLength * 10}px`, // for debugging (uncomment out the outline)
  };

  const linearAcceleratorStyle = {
    width: `${lineLength}px`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${randNum(-animationDuration * 1, 0)}s`,
  };
  // console.log("linearAcceleratorStyle", linearAcceleratorStyle);

  const particleStyle = {
    transform: `scale(${particleTransformScale})`,
    borderLeftColor: `${colorBetween}${bodyOpacity}`,
    backgroundColor: `${colorBetween}${bodyOpacity}`,
    borderRightColor: `${colorBetween}${tailOpacity}`,
    // boxShadow: `0 0 1px 1px ${colorBetween}${shadowOpacity}`,
  };
  // console.log("particleStyle", particleStyle);
  return (
    <LargeHardonColliderAndBeamlineDirector style={hardonStyle} key={"" + key}>
      <LinearAccelerator style={linearAcceleratorStyle}>
        <ElectronAndOrPositron style={particleStyle} />
      </LinearAccelerator>
    </LargeHardonColliderAndBeamlineDirector>
  );
};

/**
 * Gets a random integer between u8Min and u8Max
 */
const randHex = (u8Min: number, u8Max: number) => {
  return (Math.floor(Math.random() * (u8Max - u8Min + 1)) + u8Min)
    .toString(16)
    .padStart(2, "0");
};

const randInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const randNum = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};
/**
 * Determines the starting point of where the linear accelerator ends
 *
 * Helps guide the direction of the linear accelerator and abstracts away the
 * rotation so that linear accelerator only has to worry about linearly accelerating
 */
const LargeHardonColliderAndBeamlineDirector = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  pointer-events: none;
  user-select: none;

  position: absolute;
  height: 1px;
  transform-origin: left center;

  // Visualize the destination
  /* outline: 1px solid red; */
  /* left: 0%; */
  /* top: 100%; */
`;

const acceleration = keyframes`
  0%{
    transform: translateX(0%);
    opacity: 0;
  }
  1%{
    transform: translateX(0%);
    opacity: 0;
  }
  10%{
    opacity: 1;
  }

  50% {
    opacity: 1;
  }
  65% {
    opacity: 0;
  }
  100% {
    transform: translateX(1000%);
    opacity: 0;
  }
`;

/**
 * LinearAccelerator will vary by width, but the dot will always be the same square shape.
 *
 * Accelerates at 0...
 */
const LinearAccelerator = styled.div`
  /* width: 500px; */
  /* background: #fff; */
  opacity: 0;

  height: 1px;
  width: 500px;
  animation: ${acceleration} 200s linear infinite reverse;
  animation-timing-function: step(120);
  .outOfView & {
    animation-play-state: paused;
  }
  /* outline: 1px solid rgba(255, 255, 255, 0.3); */
  /* animation-direction: normal; */
  /* animation-duration: 2s !important; */
`;

/**
 * The particle that is the end result to be drawn
 *
 * Moves right to left, so the right side is the tail.
 *
 * The left border is the head, and border right is the tail. Use rgba to make the tail transparent.
 *
 * This should be randomly scaled between 0.5-2 with transform.
 *
 * ... inclusive or? and? 🤔
 */
const ElectronAndOrPositron = styled.div`
  box-sizing: border-box;
  border-left-width: 1px;
  border-left-style: solid;
  border-right-width: 1px;
  border-right-style: solid;

  height: 1px;
  width: 0;
  background: #fff;

  // Bullet shape
  /* border-right-color: red !important;
  height: 2px;
  width: 2px;
  border-radius: 1px 0 0 1px; */

  /* box-shadow: 0 0 1px 1px red;
  background: orange;
  border-right: 1px solid white;
  transform: scale(1.5); */
`;

/**
 * A linear interpolator for hexadecimal colors
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
export function lerpColor(a: string, b: string, amount: number) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}
