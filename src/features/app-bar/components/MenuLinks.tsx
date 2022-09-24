import { css, Theme } from "@emotion/react";

export const appBarMenuLinkStyle = (theme: Theme) => css`
  font-size: 16px;
  margin: 0 2px;
  border-radius: 4px;
  padding: 10px 10px;
  cursor: pointer;
  align-self: normal;
  &:hover {
    color: #fff;
    background: hsla(230, 15%, 40%, 0.5);
  }
  &.active,
  &:active {
    color: #fff;
  }
  ${theme.typography.bodyM}
`;

export const SocialLinks = ({ close }: { close: () => void }) => (
  <>
    <a
      href="https://twitter.com/friktion_labs"
      target="_blank"
      rel="noreferrer"
      css={(theme) => appBarMenuLinkStyle(theme)}
      onClick={() => {
        close();
      }}
    >
      Twitter
    </a>
    <a
      href="https://discord.com/invite/eSkK9X67Qj"
      target="_blank"
      rel="noreferrer"
      css={(theme) => appBarMenuLinkStyle(theme)}
      onClick={() => {
        close();
      }}
    >
      Discord
    </a>
    <a
      href="https://forum.friktion.fi/"
      target="_blank"
      rel="noreferrer"
      css={(theme) => appBarMenuLinkStyle(theme)}
      onClick={() => {
        close();
      }}
    >
      Forum
    </a>
    <a
      href="https://friktionlabs.medium.com/"
      target="_blank"
      rel="noreferrer"
      css={(theme) => appBarMenuLinkStyle(theme)}
      onClick={() => {
        close();
      }}
    >
      Medium
    </a>
  </>
);
