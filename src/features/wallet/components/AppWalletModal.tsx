import { useAppWalletModal } from "../hooks/useAppWalletModal";
import styled from "@emotion/styled";
import { WalletsSection } from "./WalletsSection";
import { css } from "@emotion/react";
import { WalletIntro } from "./WalletIntro";
import { useCallback, useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import { WalletDownload } from "./WalletDownload";
import questionMark from "../../../09/utilImages/questionMark.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { WalletDialog } from "./WalletDialog";

const SLIDE_DURATION = 500;

const SLIDER_SETTINGS: Settings = {
  dots: false,
  arrows: false,
  swipe: false,
  speed: SLIDE_DURATION,
};

export const AppWalletModal = () => {
  const { visible, setVisible, setWalletToDownload } = useAppWalletModal();
  const sliderRef = useRef<Slider>();

  const goToGetWalletScreen = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, []);

  const goToConnectWalletScreen = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    if (visible) {
      // Disable body scroll when modal is open
      body.style.setProperty("overflow", "hidden", "important");
    } else {
      body.style.removeProperty("overflow");
    }
  }, [visible]);

  // Fix react-slick animation abrupt end
  const [isUseCustomSlideAnimation, setIsUseCustomSlideAnimation] =
    useState(false);

  return (
    <WalletDialog
      isOpen={visible}
      onDismiss={() => {
        setVisible(false);
      }}
      aria-label="Connect Solana wallets"
      css={css`
        position: relative;
      `}
    >
      <StyledSlider
        {...SLIDER_SETTINGS}
        ref={(slider) => {
          if (slider) {
            sliderRef.current = slider;
          }
        }}
        beforeChange={() => {
          setIsUseCustomSlideAnimation(true);
        }}
        afterChange={(index) => {
          if (index === 0) {
            setWalletToDownload(null);
          }
          setIsUseCustomSlideAnimation(false);
        }}
        css={(theme) => css`
          & .slick-track {
            transition: ${!isUseCustomSlideAnimation
              ? "none"
              : theme.transitions.create("transform", {
                  duration: SLIDE_DURATION,
                  easing: "ease",
                })} !important;
          }
        `}
      >
        <ConnectWalletSectionLayout>
          <WalletsSection
            css={(theme) => css`
              width: 50%;
              ${theme.breakpoints.down("sm")} {
                width: 100%;
              }
            `}
          />
          <div
            css={(theme) => css`
              flex: 1 0 auto;
              ${theme.breakpoints.down("sm")} {
                display: none;
              }
            `}
          >
            <Divider />
          </div>
          <WalletIntro
            goToGetWalletScreen={goToGetWalletScreen}
            css={(theme) => css`
              width: 50%;
              ${theme.breakpoints.down("sm")} {
                display: none;
              }
            `}
          />
        </ConnectWalletSectionLayout>
        <WalletDownload
          goToConnectWalletScreen={goToConnectWalletScreen}
          goToGetWalletScreen={goToGetWalletScreen}
        />
      </StyledSlider>
      <BottomNeedHelpContainer>
        <img height="16" src={questionMark} alt="question mark icon" />
        <span
          css={css`
            line-height: 50px;
          `}
        >
          Need help?
        </span>
        <TalkToHumanButton>Talk to a human</TalkToHumanButton>
      </BottomNeedHelpContainer>
    </WalletDialog>
  );
};

const ConnectWalletSectionLayout = styled.div`
  display: flex !important;
  height: 100%;
`;

const Divider = styled.hr`
  margin: auto;
  border-width: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.grey[200]};
  border-right-width: 1px;
  width: 1px;
  height: calc(100% - 50px); // account for BottomNeedHelpContainer
`;

const BottomNeedHelpContainer = styled.div`
  position: absolute;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background: rgba(244, 244, 248, 0.9);
  bottom: 0px;
  border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
  font-family: "Euclid Circular B";
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.grey[600]};
`;

const StyledSlider = styled(Slider)`
  height: 100%;

  & .slick-list {
    height: 100%;
  }

  & .slick-track {
    height: 100%;
  }

  & .slick-slide > div {
    height: 100%;
  }
`;

const TalkToHumanButton = styled.button`
  outline: none !important;
  background-color: transparent;
  border: none;
  display: inline;
  margin: 0;
  padding: 0;
  color: #000000;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.create("color")};

  &:hover {
    color: ${({ theme }) => theme.palette.grey[400]};
  }
`;
