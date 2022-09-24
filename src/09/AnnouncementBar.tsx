import styled from "@emotion/styled";
import { css } from "@emotion/react";

import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ANNOUNCEMENT = (
  <span
    css={css`
      font-family: "Euclid Circular B";
    `}
  >
    LDO rewards are now{" "}
    <Link
      style={{
        color: "#491056",
        textDecoration: "underline",
        fontWeight: "bold",
      }}
      to={"/income#deposit_mainnet_income_call_stsol"}
    >
      LIVE
    </Link>{" "}
    for Volt #1, start earning today!
  </span>
);
// const ANNOUNCEMENT = null;

export const AnnouncementBar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const hide =
    !ANNOUNCEMENT ||
    !open ||
    location.pathname.includes("income") ||
    location.pathname.includes("stables") ||
    location.pathname.includes("crab") ||
    location.pathname.includes("basis") ||
    location.pathname.includes("protection") ||
    location.pathname.includes("portfolio") ||
    window.innerWidth < 470;

  if (hide) {
    return null;
  }

  return (
    <Bar>
      <BarContent>{ANNOUNCEMENT}</BarContent>
      <CloseIcon
        onClick={() => {
          setOpen(false);
        }}
        css={css`
          cursor: pointer;
          opacity: 60%;
        `}
      />
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  padding: 2px 8px;
  align-items: center;
  background: radial-gradient(
    50% 318.96% at 50% 50%,
    #f077d8 56.77%,
    #ce56c2 100%
  );
  z-index: 1001;
  position: relative;
  width: 100%;
  height: 40px;
`;

const BarContent = styled.div`
  text-align: center;
  flex: 1 0 0;
  font-size: 14px;
  font-weight: 400;
  color: #000;

  @media (max-width: 550px) {
    font-size: 11px;
  }
`;
