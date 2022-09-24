import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FunctionComponent, PropsWithChildren, useState } from "react";
import { Link } from "react-router-dom";

import { LayoutSection } from "../../app/BaseLayout";

import {
  VerticalBlueBar,
  VerticalGreenBar,
  VerticalPinkBar,
  VerticalRedBar,
  VerticalVioletBar,
  VerticalYellowBar,
} from "../../09/glow09";
import { BoltIcon } from "../CustomIcon";

const VoltsDropdownTab = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 12px 9px;
  gap: 4px;

  width: 260px;
  height: 100%;
  background: linear-gradient(
    180.27deg,
    rgba(43, 46, 59, 0.8) 0.31%,
    rgba(37, 39, 50, 0.8) 99.84%
  );
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  border-radius: 8px;
`;

const VoltsListItemLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-right: 8px;
  user-select: none;

  font-size: 16px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
`;

const VoltsListItemContent = styled.div`
  display: flex;
  height: 56px;
  padding: 16px 12px;
`;

const VoltsListItemLabel = styled.div`
  font-size: 18px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
`;

export const ListItem: FunctionComponent<
  PropsWithChildren<{
    currentTab: number;
    voltNumber?: number;
  }>
> = ({ currentTab, voltNumber, children }) => {
  return (
    <>
      {voltNumber === 1 ? (
        <VerticalBlueBar className="bar" />
      ) : voltNumber === 2 ? (
        <VerticalGreenBar className="bar" />
      ) : voltNumber === 3 ? (
        <VerticalYellowBar className="bar" />
      ) : voltNumber === 4 ? (
        <VerticalPinkBar className="bar" />
      ) : voltNumber === 5 ? (
        <VerticalVioletBar className="bar" />
      ) : (
        <VerticalRedBar className="bar" />
      )}
      <VoltsListItemContent>
        {voltNumber && ( // if voltNumber exists, we can assume that icon should be rendered too
          <VoltsListItemLogo>
            {currentTab === voltNumber ? (
              <BoltIcon size={24} fill="url(#volt5)" />
            ) : (
              <BoltIcon size={24} fill="white" />
            )}
            {voltNumber}
          </VoltsListItemLogo>
        )}
        <VoltsListItemLabel>{children}</VoltsListItemLabel>
      </VoltsListItemContent>
    </>
  );
};

const voltsItem = [
  {
    label: "Generate Income",
    voltNumber: 1,
    target: "#",
  },
  {
    label: "Sustainable Stables",
    voltNumber: 2,
    target: "#",
  },
  {
    label: "Crab Strategy",
    voltNumber: 3,
    target: "#",
  },
  {
    label: "Basis Yield",
    voltNumber: 4,
    target: "#",
  },
  {
    label: "Capital Protection",
    voltNumber: 5,
    target: "#",
  },
  {
    label: "Lending",
    voltNumber: 6,
    target: "#",
  },
  {
    label: "Nothing",
    target: "#",
  },
];

export const VoltsDropdown = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <LayoutSection>
      <VoltsDropdownTab>
        {voltsItem.map(({ label, voltNumber, target }) => (
          <>
            <Link
              to={target}
              css={(theme) => css`
                display: flex;
                height: 56px;
                width: 242px;
                border-radius: 6px;

                cursor: pointer;

                .bar {
                  border-radius: 6px 0 0 6px;
                  flex-shrink: 0;
                  width: 6px;
                  opacity: 0;
                }
                &.currentTab {
                  background: #00000066;
                  .bar {
                    opacity: 1;
                  }
                }

                :hover {
                  background-color: ${theme.palette.grey[1000]}33;
                  font-weight: bold;
                }
              `}
              onClick={() => setCurrentTab(voltNumber ?? 0)}
              className={currentTab === voltNumber ? "currentTab" : ""}
            >
              <ListItem currentTab={currentTab} voltNumber={voltNumber}>
                {label}
              </ListItem>
            </Link>
          </>
        ))}
      </VoltsDropdownTab>
    </LayoutSection>
  );
};
