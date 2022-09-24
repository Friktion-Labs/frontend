import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Connection } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SingleValue } from "react-select";

import { errorToast, successToast } from "utils/yummyNotifications";
import { MAINNET_ENDPOINTS, useAppConnection } from "features/connection";
import { AppSelect } from "common/components/AppSelect";
import { Typography } from "common/components/Typography";
import { AppButton } from "common/components/Button";
import { useTheme } from "@mui/material";

type RpcLabel = "Triton 1" | "Triton 2" | "GenesysGo" | "Serum" | "Custom";

export interface RpcOption {
  value: string;
  label: RpcLabel;
}

const CUSTOM_RPC_VALUE = "custom";
const CUSTOM_RPC_OPTION: RpcOption = {
  label: "Custom",
  value: CUSTOM_RPC_VALUE,
};

export const RPC_OPTIONS: RpcOption[] = [
  { label: "Triton 1", value: MAINNET_ENDPOINTS.triton1 },
  { label: "Triton 2", value: MAINNET_ENDPOINTS.triton2 },
  { label: "Serum", value: MAINNET_ENDPOINTS.projectserum },
  { label: "GenesysGo", value: MAINNET_ENDPOINTS.genesysgo },
  CUSTOM_RPC_OPTION,
];

interface RpcSettingsProps {
  className?: string;
  visible: boolean;
  hide: () => void;
  tps: number | undefined;
}
export function RpcSettings({
  className,
  visible,
  hide,
  tps,
}: RpcSettingsProps) {
  const { connection, setRpc, network } = useAppConnection();
  const currentEndpoint = connection.rpcEndpoint;

  const theme = useTheme();

  const currentOption = useMemo(
    () =>
      RPC_OPTIONS.find((option) => option.value === currentEndpoint) ??
      CUSTOM_RPC_OPTION,
    [currentEndpoint]
  );

  const [option, setOption] = useState(currentOption);

  const defaultCustomRpc = useMemo(
    () => (currentOption.value === CUSTOM_RPC_VALUE ? currentEndpoint : ""),
    [currentEndpoint, currentOption.value]
  );
  const [customRpc, setCustomRpc] = useState(defaultCustomRpc);

  const onSave = useCallback(async () => {
    let newRpc = "";

    if (option.value === CUSTOM_RPC_VALUE && customRpc !== defaultCustomRpc) {
      try {
        const connectionTest = new Connection(customRpc);
        await connectionTest.getSlot();
        newRpc = customRpc;
      } catch (e) {
        if (e instanceof Error) {
          errorToast("RPC error", e.message);
        }
        return;
      }
    } else if (
      option.value !== CUSTOM_RPC_VALUE &&
      option.value !== currentEndpoint
    ) {
      newRpc = option.value;
    }

    if (newRpc.length > 0) {
      setRpc(newRpc, option.value === CUSTOM_RPC_VALUE);
      successToast(
        "RPC updated",
        <span>
          RPC is currently set to{" "}
          <span
            css={css`
              white-space: nowrap;
            `}
          >
            {new URL(newRpc).origin}
          </span>
        </span>
      );
    }

    hide();
  }, [option, setRpc, hide, currentEndpoint, customRpc, defaultCustomRpc]);

  useEffect(() => {
    // reset chosen option when dialog opens again
    if (visible) {
      setOption(currentOption);
      setCustomRpc(defaultCustomRpc);
    }
  }, [visible, currentOption, defaultCustomRpc]);

  // prevent change of rpc on devnet
  if (network === "devnet") {
    return null;
  }

  return (
    <div className={className}>
      <RpcHeader
        css={css`
          margin-bottom: 6px;
        `}
      >
        <Typography variant="bodyXs">RPC Endpoint</Typography>
        {tps !== undefined && (
          <Typography
            variant="bodyXs"
            css={(theme) => css`
              font-size: 10px;
              color: ${theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[600]};
            `}
          >
            {`${tps} TPS`}
          </Typography>
        )}
      </RpcHeader>
      <RpcSelect
        value={option}
        setValue={(option) => {
          setCustomRpc(defaultCustomRpc);
          setOption(option);
        }}
      />
      {option.value === CUSTOM_RPC_VALUE && (
        <RpcInput
          css={css`
            margin-top: 8px;
          `}
          placeholder="Custom RPC"
          value={customRpc}
          onChange={(e) => {
            setCustomRpc(e.target.value);
          }}
        />
      )}
      <AppButton
        color={theme.palette.friktion.linear}
        css={css`
          width: 100%;
          margin-top: 8px;
          color: #000000;
          padding-top: 8px;
          padding-bottom: 8px;
        `}
        onClick={onSave}
      >
        Save
      </AppButton>
    </div>
  );
}

interface RpcSelectProps {
  value: RpcOption;
  setValue: React.Dispatch<React.SetStateAction<RpcOption>>;
}
function RpcSelect({ value, setValue }: RpcSelectProps) {
  const handleChange = useCallback(
    (newValue: SingleValue<RpcOption>) => {
      if (newValue !== null) {
        setValue(newValue);
      }
    },
    [setValue]
  );

  return (
    <AppSelect
      css={css`
        width: 100%;
      `}
      maxMenuHeight={Math.max(400, window.innerHeight * 0.5)}
      options={RPC_OPTIONS}
      value={value}
      onChange={handleChange}
      isSearchable={false}
    />
  );
}

const RpcInput = styled.input`
  position: relative;
  ${({ theme }) => theme.typography.bodyS};
  background: transparent;
  outline: none;
  height: 40px;
  padding: 2px 8px;
  flex-grow: 1;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200]};
  border-radius: 4px;
  border: none;
`;

const RpcHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
