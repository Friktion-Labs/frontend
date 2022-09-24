import styled from "@emotion/styled";

export const InfoCardsContainer = styled.div`
  width: 50%;
  z-index: ${(props) => (props.theme.palette.mode === "dark" ? 99 : 10000)};

  @media only screen and (max-width: 1030px) {
    width: 100%;
  }

  @media only screen and (max-width: 1030px) and (min-width: 785px) {
    display: flex;
  }
`;
