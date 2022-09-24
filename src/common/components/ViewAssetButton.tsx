import { getLinearGradient } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css, Interpolation, Theme } from "@emotion/react";
import { AppButton } from "common/components/Button/AppButton";
import { Typography } from "common/components/Typography";

interface ViewAssetButtonProps {
  voltNumber: VoltNumber;
  onClick?: () => void;
  css?: Interpolation<Theme>;
  className?: string;
  TypographyProps?: React.ComponentProps<typeof Typography>;
}
export const ViewAssetButton = ({
  voltNumber,
  TypographyProps,
  onClick,
  ...rest
}: ViewAssetButtonProps) => {
  const color = getLinearGradient(voltNumber);

  return (
    <AppButton
      {...rest}
      css={css`
        width: 100%;
      `}
      color={color}
      onClick={onClick}
      variant={"contained"}
    >
      <Typography
        variant="bodyM"
        css={(theme) =>
          css({
            fontWeight: 600,
            color: theme.palette.grey[900],
          })
        }
        {...TypographyProps}
      >
        Next
      </Typography>
    </AppButton>
  );
};
