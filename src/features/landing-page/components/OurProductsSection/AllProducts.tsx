import { VoltNumber } from "09/registry10";
import styled from "@emotion/styled";
import { ConnectWalletCard } from "./product-cards/ConnectWalletCard";
import { DesktopCard } from "./product-cards/DesktopCard";
import Slider, { Settings } from "react-slick";
import { MobileCard } from "./product-cards/MobileCard";
import { css } from "@emotion/react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LayoutContainer } from "common/components/LayoutContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { DesktopCardLayout } from "./product-cards/DesktopCardLayout";
import { getCardGlowBG } from "09/glow09";
import { cardGlowStyles } from "./product-cards/cardGlowStyles";

const VOLTS: VoltNumber[] = [1, 2, 3, 4, 5];

export const AllProducts = () => {
  const theme = useTheme();
  const isSmallViewPort = useMediaQuery(theme.breakpoints.down("md"));

  const mobileSliderSettings: Settings = useMemo(
    () => ({
      dots: true,
      infinite: false,
      arrows: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      responsive: [
        {
          breakpoint: theme.breakpoints.values.sm,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    [theme]
  );

  const ConnectWalletCardGlowBG = getCardGlowBG(6);
  const connectWalletCardGlowBGComponent = (
    <ConnectWalletCardGlowBG
      css={css`
        ${cardGlowStyles}
      `}
      className="glowBG"
    />
  );

  if (isSmallViewPort) {
    return (
      <>
        <AllProductsMobileLayout>
          <StyledSlider {...mobileSliderSettings}>
            {VOLTS.map((voltNumber) => (
              <MobileCard key={voltNumber} voltNumber={voltNumber} />
            ))}
          </StyledSlider>
        </AllProductsMobileLayout>
        <ConnectWalletCard />
      </>
    );
  } else {
    return (
      <AllProductsDesktopLayout fixed>
        {VOLTS.map((voltNumber) => (
          <DesktopCard key={voltNumber} voltNumber={voltNumber} />
        ))}
        <DesktopCardLayout>
          <ConnectWalletCard
            css={css`
              &:hover {
                & ~ .glowBG {
                  opacity: 0.6;
                }
              }
            `}
          />
          {connectWalletCardGlowBGComponent}
          {connectWalletCardGlowBGComponent}
        </DesktopCardLayout>
      </AllProductsDesktopLayout>
    );
  }
};

const AllProductsDesktopLayout = styled(LayoutContainer)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const AllProductsMobileLayout = styled.div`
  margin-left: -22px;
  margin-right: -22px;
`;

const StyledSlider = styled(Slider)`
  padding: 4px 0px;

  & .slick-slide {
    padding: 0 22px;
    height: auto;

    & > div {
      height: 100%;
    }
  }

  & .slick-track {
    display: flex;
    align-items: stretch;
  }

  & > .slick-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: -36px;
    & li {
      background: ${({ theme }) =>
        theme.palette.mode === "dark" ? "#302c3c" : "#CECED8"};
      width: 8px;
      height: 8px;
      border-radius: 50%;
      button:before {
        display: none;
      }
    }
    & .slick-active {
      background: ${({ theme }) => theme.palette.friktion.linear};
    }
  }
`;
