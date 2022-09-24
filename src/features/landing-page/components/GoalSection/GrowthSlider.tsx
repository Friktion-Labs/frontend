import { css } from "@emotion/react";
import styled from "@emotion/styled";
import SliderUnstyled, {
  sliderUnstyledClasses,
  SliderUnstyledThumbSlotProps,
} from "@mui/base/SliderUnstyled";
import { FriktionBolt } from "features/icons";

interface GrowthSliderProps {
  onChange: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  value: number;
  disabled?: boolean;
}
export const GrowthSlider = ({
  value,
  onChange,
  disabled,
}: GrowthSliderProps) => (
  <StyledSlider
    value={value}
    onChange={onChange}
    defaultValue={10}
    components={{ Thumb: GrowthSliderThumb }}
    disabled={disabled}
  />
);

const StyledSlider = styled(SliderUnstyled)`
  width: 100%;
  height: 4px;
  padding: 16px 0;
  color: ${({ theme }) => theme.palette.pink[600]};
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderUnstyledClasses.disabled} {
    pointer-events: none;
    cursor: default;
    color: ${({ theme }) => theme.palette.grey[400]};
  }

  & .${sliderUnstyledClasses.track} {
    position: absolute;
    background-color: currentColor;
    border-radius: 4px;
    height: 4px;
  }

  & .${sliderUnstyledClasses.rail} {
    position: absolute;
    width: 100%;
    background-color: currentColor;
    border-radius: 4px;
    height: 4px;
    opacity: 0.2;
  }
`;

const GrowthSliderThumb = ({
  ownerState,
  children,
  ...rest
}: SliderUnstyledThumbSlotProps) => (
  <span
    {...rest}
    css={(theme) => css`
      position: absolute;
      border: 1px solid currentColor;
      border-radius: 12px;
      background: ${ownerState.disabled
        ? theme.palette.grey[300]
        : theme.palette.friktion.radial};
      box-shadow: 0px 4px 24px rgba(153, 153, 153, 0.15);
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate(-50%, -14px);
    `}
  >
    <FriktionBolt color="#FFFFFF" />
    {children}
  </span>
);
