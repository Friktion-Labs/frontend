import { css, Interpolation, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { Popover } from "antd";

import { InfoI } from "../components/VoltPerformance/VoltPerformance";

export const DocLink = ({
  children,
  href,
}: React.PropsWithChildren<{
  href: string;
}>) => {
  return (
    <DocLinkA href={href} target="_blank" rel="noreferrer">
      {children}
    </DocLinkA>
  );
};

const DocLinkA = styled.a`
  &:link {
    text-decoration: solid underline;
    text-decoration-thickness: 1px;
    color: inherit;
  }
  &:hover {
    text-decoration: solid underline;
  }
`;

export const InlineDocMissingLink = ({
  children,
  content,
  withInfoIcon = false,
  noTextUnderline = false,
  ...rest
}: React.PropsWithChildren<{
  content: string | React.ReactNode | (() => JSX.Element);
  className?: string;
  css?: Interpolation<Theme>;
  withInfoIcon?: boolean;
  noTextUnderline?: boolean;
}>) => {
  const Content = content;
  return (
    <Popover
      destroyTooltipOnHide
      placement="bottom"
      content={
        <span css={inlineDocPopoverStyles}>
          {typeof Content === "function" ? (
            <Content />
          ) : (
            (content as React.ReactNode)
          )}
        </span>
      }
      css={!noTextUnderline && inlineDocStyles}
    >
      <span {...rest}>
        {children} {withInfoIcon && <InfoI />}
      </span>
    </Popover>
  );
};

/**
 * Use this when it's not actually missing.
 */
export const InlineHoverDoc = InlineDocMissingLink;

const inlineDocStyles = css`
  text-decoration: dotted underline;
  text-decoration-thickness: 1px;
  color: inherit;
  font-family: "Euclid Circular B";
`;

export const inlineDocPopoverStyles = css`
  max-width: 300px;
  display: inline-block;
  font-family: "Euclid Circular B";
`;
