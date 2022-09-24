import { getVoltColorPair } from "09/glow09";
import { VoltNumber } from "09/registry10";
import { css } from "@emotion/react";

interface GlowTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  voltNumber: VoltNumber;
}
export const GlowTableRow = ({ voltNumber, ...rest }: GlowTableRowProps) => {
  // eslint-disable-next-line
  const [colorA, colorB] = getVoltColorPair(voltNumber);

  return (
    <tr
      css={(theme) => css`
        position: relative;
        cursor: pointer;
        border-radius: 8px;

        transition: ${theme.transitions.create(["border"], {
          duration: theme.transitions.duration.short,
        })};

        &:after {
          position: absolute;
          inset: 0;
          content: "";
          border-radius: 8px;
          box-shadow: 0px 0px 12px 1px ${colorB};
          z-index: 1;
          opacity: 0;
          transition: ${theme.transitions.create(["opacity"], {
            duration: theme.transitions.duration.short,
          })};
        }

        &:hover {
          border: 1px solid ${colorA};

          &:after {
            opacity: 0.6;
          }
        }
      `}
      {...rest}
    >
      {rest.children}
    </tr>
  );
};
