import styled from "@emotion/styled";

export const StrategyContainer = styled.div`
  width: 50%;
  padding-right: 48px;
  z-index: ${(props) => (props.theme.palette.mode === "dark" ? 99 : 10000)};

  @media only screen and (max-width: 1030px) {
    width: 100%;
    padding-right: 0;
    margin-bottom: 32px;
  }
`;
