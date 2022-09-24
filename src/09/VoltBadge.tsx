import { VoltNumber } from "./registry10";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const VoltBadge: React.FC<{
  volt: VoltNumber;
}> = ({ volt }) => {
  const gradient =
    volt === 1
      ? BlueGradient
      : volt === 2
      ? GreenGradient
      : volt === 3
      ? YellowGradient
      : volt === 4
      ? PinkGradient
      : VioletGradient;
  return <Badge css={gradient}>{`#${volt}`}</Badge>;
};

const Badge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
`;

const BlueGradient = css`
  font-weight: 500;
  background: linear-gradient(90deg, #637dff 0%, #03c9ff 100%);
`;
const GreenGradient = css`
  font-weight: 500;
  color: black;
  background: linear-gradient(90deg, #28edbf 0%, #5ded39 100%);
`;
const YellowGradient = css`
  font-weight: 500;
  color: black;
  background: linear-gradient(90deg, #ffc003 0%, #cfe600 100%);
`;
const PinkGradient = css`
  font-weight: 500;
  color: black;
  background: linear-gradient(90deg, #a695fc 0%, #f27ee3 100%);
`;

const VioletGradient = css`
  font-weight: 500;
  color: black;
  background: linear-gradient(90deg, #905cff 0%, #d4b3ff 100%);
`;
