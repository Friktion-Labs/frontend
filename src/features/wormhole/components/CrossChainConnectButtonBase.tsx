import React from "react";

import { Button09 } from "09/Button09";
import { getTickerFromWormholeChainId } from "../constants/constants";
import styled from "@emotion/styled";
import { CrossChainConnectButtonProps } from "./CrossChainConnectButtonProps";
import { css } from "@emotion/react";

interface CrossChainConnectButtonBaseProps
  extends CrossChainConnectButtonProps {
  connect: () => void;
  connected: boolean;
  error?: string;
}

export const CrossChainConnectButtonBase: React.VFC<
  CrossChainConnectButtonBaseProps
> = ({ connect, connected, chainId, connectedComponent, error, ...rest }) => {
  return (
    <div {...rest}>
      {connected && connectedComponent ? (
        connectedComponent(error) ?? null
      ) : (
        <CrossChainConnectButtonWrapper>
          <Button09
            css={(theme) => css`
              background: ${theme.palette.pink[700]};
            `}
            onClick={connect}
          >{`Connect ${getTickerFromWormholeChainId(
            chainId
          )} wallet`}</Button09>
        </CrossChainConnectButtonWrapper>
      )}
    </div>
  );
};

const CrossChainConnectButtonWrapper = styled.div`
  margin: 22px 20px 22px 20px;
  .Button09 {
    width: 100%;
  }
`;
