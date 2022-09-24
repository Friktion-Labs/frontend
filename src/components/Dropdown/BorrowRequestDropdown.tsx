/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from "common/components/Button";
import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import { Dropdown } from "common/components/Dropdown";
import { Typography } from "common/components/Typography";
interface BorrowRequestDropdownProps {
  menuItems: Array<{
    href: string;
    onClick?: () => void;
    issuer: {
      name: string;
      icon: React.ReactNode;
    };
    value: {
      amount: string;
      currency: React.ReactNode;
    };
  }>;
}

export const BorrowRequestDropdown: FunctionComponent<
  BorrowRequestDropdownProps
> = ({ menuItems = [] }) => {
  const requestLength = menuItems.length;

  const items = menuItems.map(({ issuer, value, onClick, href }) => {
    return {
      key: issuer.name,
      href: href,
      onClick: onClick,
      label: (
        <MenuItem>
          <ValueContainer>
            {issuer.icon}
            {issuer.name}
          </ValueContainer>

          <ValueContainer>
            {value.amount}
            {value.currency}
          </ValueContainer>
        </MenuItem>
      ),
    };
  });

  return (
    <Dropdown menuItems={items}>
      <Button
        variant="link"
        fullWidth
      >{`${requestLength} borrow requests pending`}</Button>
    </Dropdown>
  );
};

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ValueContainer = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyM" />
  )
)`
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${(props) => props.theme.palette.grey[200]};
`;
