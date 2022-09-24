import React from "react";
import { useTheme } from "@mui/material";

export const FriktionBolt = ({
  color,
  ...rest
}: React.SVGProps<SVGSVGElement> & { color?: string }) => {
  const theme = useTheme();

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M12.4471 8.71094L4.46484 15.9998L6.63374 10.382L12.4471 8.71094Z"
        fill={color ?? theme.palette.grey[400]}
      />
      <path
        d="M1.60156 11.2L13.8682 0L10.526 8.64L1.60156 11.2Z"
        fill={color ?? theme.palette.grey[400]}
      />
    </svg>
  );
};
