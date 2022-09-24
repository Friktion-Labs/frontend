import { css } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { VoltTabs } from "./VoltTabs";
import styled from "@emotion/styled";
import { VoltSelect } from "./VoltSelect/VoltSelect";
import { useOnResize } from "common/hooks/useOnResize";
import { useMemo, useState } from "react";

export const VoltPageLayout: React.FC = () => {
  const [tabsWidth, setTabsWidth] = useState(0);
  const tabsWidthBreakpoint = useMemo(() => tabsWidth + 30, [tabsWidth]);

  const { listeningElementRef: tabsRef } = useOnResize((element) => {
    setTabsWidth(element.offsetWidth);
  });

  return (
    <VoltPageLayoutContainer>
      <Title
        css={css`
          padding: 0px 30px;
          display: none;
          @media (min-width: ${tabsWidthBreakpoint}px) {
            display: ${tabsWidth > 0 ? "block" : "none"};
          }
        `}
      >
        Volts
      </Title>
      <VoltTabs
        ref={tabsRef}
        css={css`
          padding: 0px 30px;
          visibility: hidden;
          @media (min-width: ${tabsWidthBreakpoint}px) {
            visibility: ${tabsWidth > 0 ? "visible" : "hidden"};
          }
        `}
      />
      <TabsBottomBorder
        css={css`
          margin: 0px 30px 9px 30px;
          transform: translateY(-11px);
          display: none;

          @media (min-width: ${tabsWidthBreakpoint}px) {
            display: ${tabsWidth > 0 ? "block" : "none"};
          }
        `}
      />
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          padding: 0px 30px;
          display: none;

          @media (max-width: ${tabsWidthBreakpoint}px) {
            display: ${tabsWidth > 0 ? "block" : "none"};
          }
        `}
      >
        <VoltSelect />
      </div>

      {/* Create bottom margin to absolutely positioned VoltSelect component */}
      <VoltSelectSpacer
        css={css`
          display: none;
          @media (max-width: ${tabsWidthBreakpoint}px) {
            display: ${tabsWidth > 0 ? "block" : "none"};
          }
        `}
      />
      <Outlet />
    </VoltPageLayoutContainer>
  );
};

const VoltPageLayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 60px;
  overflow-x: hidden;
`;

const VoltSelectSpacer = styled.div`
  height: 10px;
`;

const Title = styled.span`
  font-family: "Recoleta";
  font-size: 40px;
  font-weight: 500;
  color: white;
  width: 100%;
  z-index: 1;

  @media (max-width: 659px) {
    font-size: 20px;
  }
`;

const TabsBottomBorder = styled.div`
  height: 1px;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[600]
      : theme.palette.grey[400]};
  z-index: -1;
`;
