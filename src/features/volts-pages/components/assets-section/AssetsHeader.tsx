import styled from "@emotion/styled";

export const AssetsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 30px;
  z-index: 5;

  @media (max-width: 899px) {
    flex-direction: column;
    gap: 10px;
  }
`;
