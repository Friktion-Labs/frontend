import { useTheme } from "@mui/material";
import { AppButton } from "common/components/Button";
import { ComponentProps } from "react";

interface WalletOutlinedButtonProps
  extends Omit<ComponentProps<typeof AppButton>, "variant" | "color"> {}

export const WalletOutlinedButton = (props: WalletOutlinedButtonProps) => {
  const theme = useTheme();

  return (
    <AppButton
      {...props}
      variant="outlined"
      color={theme.palette.darkBlue[600]}
    />
  );
};
