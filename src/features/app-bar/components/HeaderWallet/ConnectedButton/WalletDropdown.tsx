import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Popover } from "antd";
import { useState } from "react";
import { RpcSettings } from "./RpcSettings";
import { WalletActions } from "./WalletActions";
import { WalletInfoHeader } from "./WalletInfoHeader";

interface WalletDropdownProps {
  children: React.ReactNode;
  tps: number | undefined;
}

export const WalletDropdown = ({ children, tps }: WalletDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hide = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      destroyTooltipOnHide
      trigger="click"
      visible={isOpen}
      onVisibleChange={setIsOpen}
      placement="bottomRight"
      content={
        <DropdownContent>
          <WalletInfoHeader
            css={css`
              margin-bottom: 20px;
            `}
          />
          <WalletActions />
          <Divider />
          <RpcSettings visible={isOpen} hide={hide} tps={tps} />
        </DropdownContent>
      }
    >
      {children}
    </Popover>
  );
};

const DropdownContent = styled.div`
  padding: 8px 4px 8px 4px;
  width: 200px;
`;

const Divider = styled.hr`
  margin: 16px 0px;
  flex-shrink: 0;
  border-width: 0px 0px thin;
  border-style: solid;
  border-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"};
`;
