// import { css } from "@emotion/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { VoltNumber } from "./VoltNumber";

export const VoltTokenIcon = (props: {
  voltNum: number;
  colorA: string;
  colorB: string;
  children: React.ReactNode;
}) => {
  return (
    <VoltCoinPlaceholder css={css``}>
      <VoltCoinNumberPositioner>
        <VoltNumber
          css={css`
            opacity: 1;
            .colorSpan {
              background: linear-gradient(
                10deg,
                ${props.colorA} 0%,
                ${props.colorA} 20%,
                ${props.colorB} 60%
              );
              background-size: 200% auto;
              background-clip: text;
              animation: none;
            }
          `}
          voltNum={props.voltNum}
        />
      </VoltCoinNumberPositioner>
      <VoltCoinBoltPositioner>
        <VoltCoinBoltWrapper css={css``}>
          <VoltCoinBolt
            css={css`
              background: linear-gradient(
                30deg,
                ${props.colorA} 0%,
                ${props.colorA} 20%,
                ${props.colorB} 60%
              );
            `}
          />
        </VoltCoinBoltWrapper>
        <VoltCoinBoltWrapper
          css={css`
            filter: blur(5px);
            opacity: 0.6;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
          `}
        >
          <VoltCoinBolt
            css={css`
              background: linear-gradient(
                30deg,
                ${props.colorA} 0%,
                ${props.colorA} 20%,
                ${props.colorB} 60%
              );
            `}
          />
        </VoltCoinBoltWrapper>
      </VoltCoinBoltPositioner>
      <VoltCoinChildren>{props.children}</VoltCoinChildren>
      {/* <img
        src={props.bgImage}
        css={css`
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 120px;
          height: 120px;
          opacity: 1;
          z-index: 1;
        `}
      /> */}
    </VoltCoinPlaceholder>
  );
};

const VoltCoinBoltWrapper = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  position: absolute;
  -webkit-perspective: 1000;
  width: 90px;
  height: 32px;
  opacity: 1;
  height: 115px;
`;
const VoltCoinBolt = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  width: 90px;
  height: 32px;
  opacity: 1;
  height: 115px;

  clip-path: url(#boltPath);

  /* clip-path: polygon(
    626px 463px,
    765px 236px,
    687px 31px,
    271px 100px,
    70px 10px,
    49px 250px,
    133px 406px,
    374px 462px,
    529px 393px
  ); */

  /* Optimization todo: use display:none so we dont have to blur when hidden */

  background-size: 200% auto;
  /* animation: scrollshine 1.5s linear infinite reverse;
animation-timing-function: steps(20); */
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  transform: scale(0.5);
`;

const VoltCoinChildren = styled.div`
  position: absolute;
  left: 42px;
  top: 23px;
  transform: scale(1.6);
  z-index: 3;
`;

const VoltCoinBoltPositioner = styled.div`
  position: absolute;
  z-index: 2;
  /* opacity: 0.05; */
  pointer-events: none;
  /* width: 50%; */
  height: 100%;
  width: 100%;

  top: 28px;
  left: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transform: scale(0.5);
`;
const VoltCoinPlaceholder = styled.div`
  position: absolute;
  left: 200px;
  width: 120px;
  height: 120px;
  top: 0;
  left: 0;
  text-align: left;
  background: radial-gradient(
    ellipse at 50% 80%,
    hsl(230, 15%, 11%) 20%,
    hsl(230, 18%, 22%) 75%
  );
  /* box-shadow: 0 0.66px 0 0 hsl(230, 15%, 21%) inset; */
  position: relative;
  color: hsl(230, 7%, 40%);
  transform: scale(1.5);

  /* &:hover {
    border-radius: 50%;
  } */
  /* border-radius: 50%; */

  /* display: flex;
  align-items: center;
  justify-content: flex-start; */
  font-size: 18px;
  padding-left: 20px;
  box-shadow: none;
  /* border-radius: 50%; */
  /* cursor: wait; */
  /* margin: 100px;
  margin-bottom: 200px; */
  display: inline-block;
`;

const VoltCoinNumberPositioner = styled.div`
  position: absolute;
  z-index: 2;
  left: 26px;
  top: 76px;
  transform: scale(1);

  div {
    animation: none;
  }
`;

export const VoltPlaceholder09 = (props: {
  voltNum: number;
  colorA: string;
  colorB: string;
  bgImage?: string;
}) => {
  return (
    <VoltPlaceholder>
      <VoltText>Volt</VoltText>

      <VoltNumberPositioner>
        <VoltNumber
          css={css`
            opacity: 1;
            .voltNumberWrapper {
              /* BTC */
              /* background: #f2a900; */

              /* Solana */
              /* background: linear-gradient(
                50deg,
                #7962e7 12%,
                hsl(202, 70%, 51%) 25%,
                #00d18c 50%
              ); */

              /* mSOL */
              /* background: #308d8a; */

              /* ETH */
              background: #716b94;

              background-size: 200% auto;
              background-clip: text;
            }
          `}
          voltNum={props.voltNum}
        />
      </VoltNumberPositioner>
      <VoltBoltPositioner>
        <VoltBolt
          css={css`
            background: linear-gradient(
              70deg,
              #637dff 0%,
              #637dff 20%,
              #17c9ff 60%
            );
          `}
        />
      </VoltBoltPositioner>
      {/* <img
        src={props.bgImage}
        css={css`
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 120px;
          height: 120px;
          opacity: 1;
          z-index: 1;
        `}
      /> */}
    </VoltPlaceholder>
  );
};

const VoltBolt = styled.div`
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  width: 90px;
  height: 32px;
  opacity: 1;
  height: 115px;

  clip-path: url(#boltPath);

  /* clip-path: polygon(
    626px 463px,
    765px 236px,
    687px 31px,
    271px 100px,
    70px 10px,
    49px 250px,
    133px 406px,
    374px 462px,
    529px 393px
  ); */

  /* Optimization todo: use display:none so we dont have to blur when hidden */

  background-size: 200% auto;
  /* animation: scrollshine 1.5s linear infinite reverse;
animation-timing-function: steps(20); */
  @keyframes scrollshine {
    to {
      background-position: 200% center;
    }
  }
  transform: scale(0.5);
`;

const VoltBoltPositioner = styled.div`
  position: absolute;
  z-index: 2;
  /* opacity: 0.05; */
  pointer-events: none;
  /* width: 50%; */
  height: 100%;
  top: 0px;
  right: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transform: scale(1.1);
`;
const VoltPlaceholder = styled.div`
  left: 200px;
  width: 120px;
  height: 120px;
  background: linear-gradient(hsl(230, 15%, 26%), hsl(230, 15%, 13%) 80%);
  box-shadow: 0 0.66px 0 0 hsl(230, 15%, 21%) inset;
  position: relative;
  color: hsl(230, 7%, 40%);
  transform: scale(2);

  /* &:hover {
    border-radius: 50%;
  } */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 14px;
  font-size: 18px;
  padding-left: 20px;
  box-shadow: none;
  /* border-radius: 50%; */
  cursor: wait;
  margin: 100px;
  margin-bottom: 200px;
`;

const VoltText = styled.div`
  position: absolute;
  bottom: -50px;
  left: 20px;
`;

const VoltNumberPositioner = styled.div`
  position: absolute;
  z-index: 2;
  left: 25px;
  top: 25px;
  transform: scale(0.8) rotate(-41deg);

  div {
    animation: none;
  }
`;
