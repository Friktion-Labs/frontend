import styled from "@emotion/styled";

export const DesktopCardLayout = styled.div`
  position: relative;
  padding: 12px;
  width: calc(100% / 3);
  ${({ theme }) => theme.breakpoints.down("lg")} {
    width: 50%;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 100%;
  }

  a,
  a:focus {
    color: inherit;
    border-radius: 12px;
    outline: none;
  }
  a:link {
    text-decoration: none;
  }
`;
