/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

interface DropdownProps extends React.PropsWithChildren {
  menuItems: Array<{
    key: string;
    label: React.ReactElement | string;
    href?: string;
    onClick?: () => void;
  }>;
  width?: number | string;
  bg?: string;
  className?: string;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  menuItems,
  children,
  ...rest
}) => {
  return (
    <StyledMenu
      menuButton={<StyledButton>{children}</StyledButton>}
      transition
      {...rest}
    >
      {menuItems.map(({ key, label, href, onClick }) => (
        <MenuItem onClick={onClick} href={href} key={key}>
          {label}
        </MenuItem>
      ))}
    </StyledMenu>
  );
};

const StyledMenu = styled(Menu)<{ width?: number | string; bg?: string }>`
  .szh-menu {
    background: ${({ bg }) => (bg ? `${bg} !important` : `#323441`)};
    border-radius: 8px;
    width: ${({ width }) =>
      width ? `${width} !important` : `400px !important`};
    margin-top: 12px !important;
    padding: 10px 0px;
  }

  .szh-menu__item {
    padding: 0px 16px;
    height: 48px;
  }

  .szh-menu__item--hover {
    background: #404355;
  }
`;

const StyledButton = styled(MenuButton)`
  all: unset;
`;
