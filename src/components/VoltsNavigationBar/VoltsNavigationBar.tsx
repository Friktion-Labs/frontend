import styled from "@emotion/styled";
import { DetailedHTMLProps, FunctionComponent, HTMLAttributes } from "react";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material";

import {
  TabSelector,
  useTabs,
  TabContainer,
  useTabAnimation,
} from "components/Tabs";

import { Dropdown } from "common/components/Dropdown";
import { Typography } from "common/components/Typography";
import { ChevronRightIcon } from "components/Icons";

import { breakpoints } from "09/breakpoints09";
import { VoltNumber } from "09/registry10";
import { getVoltBolt, getVoltSpan } from "09/glow09";

interface VoltsNavigationBarProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const VOLT_TABS: {
  voltNumber: VoltNumber;
  label: string;
}[] = [
  {
    voltNumber: 1,
    label: "Generate Income",
  },
  {
    voltNumber: 2,
    label: "Sustainable Stables",
  },
  {
    voltNumber: 3,
    label: "Crab Strategy",
  },
  {
    voltNumber: 4,
    label: "Basis Yield",
  },
  {
    voltNumber: 5,
    label: "Capital Protection",
  },
  {
    voltNumber: 6,
    label: "Lending",
  },
];

export const VoltsNavigationBar: FunctionComponent<VoltsNavigationBarProps> = ({
  ...rest
}) => {
  const { selectedTab, setSelectedTab, activeIndex } = useTabs(
    VOLT_TABS.map((tab: any) => tab.label)
  );
  const { handleSelectTab, currentWidth, transform, tabContainerRef } =
    useTabAnimation(196, 40, setSelectedTab);

  const theme = useTheme();

  return (
    <VoltsNavigationWrapper {...rest}>
      <VoltsTabWrapper ref={tabContainerRef}>
        <VoltTabContainer
          transform={transform}
          currentWidth={currentWidth}
          voltNumber={activeIndex + 1}
        >
          {VOLT_TABS.map(({ label, voltNumber }, idx) => {
            const Bolt = getVoltBolt(voltNumber);
            const Span =
              selectedTab === label ? getVoltSpan(voltNumber) : "span";
            return (
              <TabSelectorWrapper
                isActive={selectedTab === label}
                onClick={(e: React.SyntheticEvent | Event) =>
                  handleSelectTab(label, idx, e)
                }
                key={idx}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  `}
                >
                  <BoltWrapper>
                    <Bolt
                      css={css`
                        width: 18px;
                        height: 23px;
                        margin-right: 4px;
                        ${selectedTab !== label &&
                        `background: ${
                          theme.palette.mode === "dark"
                            ? "#CECED8"
                            : theme.palette.grey[500]
                        };`}
                      `}
                    />
                    <Typography
                      css={css`
                        font-weight: 500;
                      `}
                      variant="bodyM"
                    >
                      <Span>{voltNumber}</Span>
                    </Typography>
                  </BoltWrapper>
                  {theme.palette.mode === "dark" ? (
                    <Span>
                      <ParagraphMRegular>{label}</ParagraphMRegular>
                    </Span>
                  ) : (
                    <ParagraphMRegular
                      css={css`
                        color: ${selectedTab === label
                          ? theme.palette.grey[1000]
                          : theme.palette.grey[500]};
                      `}
                    >
                      {label}
                    </ParagraphMRegular>
                  )}
                </div>
              </TabSelectorWrapper>
            );
          })}
        </VoltTabContainer>
      </VoltsTabWrapper>
      <VoltsDropdownContainer>
        <Dropdown
          width="calc(100vw - 40px)"
          menuItems={VOLT_TABS.map((volt) => ({
            key: volt.label,
            label: <ParagraphMRegular>{volt.label}</ParagraphMRegular>,
            onClick: () => setSelectedTab(volt.label),
          }))}
        >
          {selectedTab}
          <ChevronRightIcon />
        </Dropdown>
      </VoltsDropdownContainer>
    </VoltsNavigationWrapper>
  );
};

const VoltsNavigationWrapper = styled.div``;

const ParagraphMRegular = styled.div`
  ${(props) => props.theme.typography.bodyM}
  color: #CECED8;
`;

const VoltsTabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  position: relative;
  :after {
    content: "";
    position: absolute;
    bottom: 0px;
    right: 0;
    left: 0;
    height: 1px;
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[600]
        : theme.palette.grey[200]};
    z-index: 0;
  }
  ${breakpoints.medium} {
    display: none;
  }
`;

const TabSelectorWrapper = styled(TabSelector)`
  padding-bottom: 16px;
  :after {
    position: absolute;
    content: " ";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  }
`;

const BoltWrapper = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 0;
  p span {
    color: ${({ theme }) =>
      theme.palette.mode === "dark" ? "#ceced8" : theme.palette.grey[500]};
  }
`;

const VoltTabContainer = styled(TabContainer)`
  gap: 40px;
  & p {
    margin: 0;
  }
  :before {
    height: 1px;
    z-index: 1;
  }
`;

const VoltsDropdownContainer = styled.div`
  display: none;

  ${breakpoints.medium} {
    display: flex;
    padding: 20px;
  }

  button {
    border: 1px solid #5d5d64;
    filter: drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05));
    border-radius: 8px;
    padding: 10px 14px;
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[0]
        : theme.palette.grey[1000]};
    width: 100%;
    ${(props) => props.theme.typography.bodyM}
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg {
      transform: rotate(90deg);
      fill: ${({ theme }) =>
        theme.palette.mode === "dark" ? "none" : "transparent"};
      path {
        stroke: ${({ theme }) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[0]
            : theme.palette.grey[1000]};
      }
    }
  }

  li {
    color: ${({ theme }) => theme.palette.grey[0]};
  }
`;
