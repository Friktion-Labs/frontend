import styled from "@emotion/styled";
import { BlueNonAnimatedBar, GreenNonAnimatedBar } from "./glow09";
import { button09Reset } from "./Button09";
import { darken } from "@mui/material";

export const VoltageBox = (props: {
  title: string;
  apy: string;
  deposits: string;
  isSelected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  colorBar?: typeof BlueNonAnimatedBar | typeof GreenNonAnimatedBar | undefined;
}) => {
  return (
    <Box
      className={props.isSelected ? "selected" : "deselected"}
      onClick={props.onClick}
    >
      {props.colorBar ? (
        <props.colorBar
          style={{ borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}
        />
      ) : (
        <div></div>
      )}

      <Title>{props.title}</Title>
      <Label>APY</Label>
      <BigLabel>{props.apy}</BigLabel>
      <Label>Your deposits</Label>
      <Text>{props.deposits}</Text>
    </Box>
  );
};

const Box = styled.button`
  ${button09Reset}
  font-family: "Euclid Circular B";
  display: flex;
  flex-direction: column;
  width: 160px;
  min-height: 160px;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "hsl(230, 15%, 12%)"
      : "rgb(204, 204, 204)"};
  padding: 20px;
  cursor: pointer;
  border-radius: 4px;
  outline: none;
  &:hover {
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "hsl(230, 15%, 15%)"
        : darken(props.theme.palette.background.modal, 0.15)};
  }
  &:focus {
    z-index: 3;
  }
  &.selected {
    background: ${(props) =>
      props.theme.palette.mode === "dark" ? "hsl(230, 15%, 20%)" : "#FFF"};
  }
  padding-top: 16px;
  div:nth-of-type(1) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
`;

const Title = styled.div`
  font-size: 18px;
  color: ${(props) =>
    props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
  align-self: center;
`;

const Label = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[700]};
  padding: 0 10px 0 4px;
  text-align: left;
`;

const BigLabel = styled.div`
  font-size: 22px;
  line-height: 22px;
  color: ${(props) =>
    props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
  padding: 0 10px 0 4px;
  text-align: left;
`;

const Text = styled.div`
  font-size: 14px;
  color: ${(props) =>
    props.theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
  padding: 0 2px 0 4px;
  text-align: left;
  line-height: 1.3;
`;
