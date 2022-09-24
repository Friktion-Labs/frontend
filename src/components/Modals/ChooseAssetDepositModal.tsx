import { FunctionComponent, useState } from "react";
import styled from "@emotion/styled";
import { Modal, ModalTitle, ModalDescription } from "common/components/Modal";
import { Select } from "../Forms/Inputs";
import { GroupBase, OptionProps } from "react-select";
import { AllSymbolsUnion, GlobalId, VoltNumber } from "09/registry10";
import { Card09Props } from "09/Card10";
import { ViewAssetButton } from "common/components/ViewAssetButton";
import { cx } from "@emotion/css";
import invariant from "tiny-invariant";
import { ManualUniversalAssetLogo } from "09/UniversalAssetLogo";
import { css } from "@emotion/react";

type ChooseAssetDepositModalProps = {
  cards: Card09Props[];
  voltNumber: VoltNumber;
  handleDeposit: (voltNumber: VoltNumber, globalId: GlobalId) => void;
  handleCancel: () => void;
  isModalVisible: boolean;
};

export type Op = {
  globalId: GlobalId;
  label: string;
  apy: string;
  underlyingSymbol: AllSymbolsUnion;
  depositTokenSymbol: AllSymbolsUnion;
  optionType: "call" | "put" | undefined;
};

const Option = styled.div`
  display: flex;
  color: black;
  font-size: 16px;
  gap: 14px;
  min-height: 48px;
  padding: 0 10px 0 20px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[100]};
  }
  &.isFocused {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[100]};
  }
`;

export const CustomOption: React.ComponentType<
  OptionProps<
    {
      value: string;
      label: string;
    },
    false,
    GroupBase<{
      value: string;
      label: string;
    }>
  >
> = ({ children, getStyles, innerRef, ...props }) => {
  // bad jason bad boy
  const op = props.data as unknown as Op;
  const label = op.label;
  const apy = op.apy;
  const underlyingSymbol = op.underlyingSymbol;
  const depositTokenSymbol = op.depositTokenSymbol;
  const optionType = op.optionType;

  return (
    <Option
      ref={innerRef}
      {...props.innerProps}
      // onClick={props.selectOption}
      className={cx(
        {
          isDisabled: props.isDisabled,
        },
        { isFocused: props.isFocused },
        { isSelected: props.isSelected }
      )}
      key={props.data.label}
    >
      <ManualUniversalAssetLogo
        mainSymbol={
          optionType === "call" ? underlyingSymbol : depositTokenSymbol
        }
        secondarySymbol={optionType === "call" ? undefined : underlyingSymbol}
      />
      <div
        css={(theme) => css`
          min-width: 60px;
          color: ${theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"};
        `}
      >
        {label}
      </div>
      <div
        css={(theme) =>
          css`
            color: ${theme.palette.mode === "dark"
              ? theme.palette.grey[300]
              : theme.palette.grey[600]};
            min-width: 80px;
            text-align: right;
          `
        }
      >
        {apy}% APY
      </div>
    </Option>
  );
};

export const ChooseAssetDepositModal: FunctionComponent<
  ChooseAssetDepositModalProps
> = ({ cards, voltNumber, handleDeposit, handleCancel, isModalVisible }) => {
  const [selectedOption, setSelectedOption] = useState<Op | null>(null);

  const handleChange = (a: Op) => {
    setSelectedOption(a);
  };

  const options: Op[] = cards
    .filter((card) => card.def && card.data)
    .flatMap((card) => {
      invariant(card.def, "card def not defined");
      invariant(card.data, "card data not defined");
      return {
        globalId: card.def.globalId,
        label:
          card.def.optionType === "put"
            ? `${card.underlyingAssetSymbol}/${card.def.depositToken.symbol}`
            : card.underlyingAssetSymbol,
        apy: card.data.apy.toFixed(1),
        underlyingSymbol: card.underlyingAssetSymbol,
        depositTokenSymbol: card.def.depositToken.symbol,
        optionType: card.def.optionType,
      };
    });

  return (
    <Modal
      visible={isModalVisible}
      footer={[
        <ViewAssetButton
          onClick={() => {
            if (selectedOption === null) return;
            handleDeposit(voltNumber, selectedOption.globalId);
          }}
          voltNumber={voltNumber}
        />,
      ]}
      onCancel={() => {
        setSelectedOption(null);
        handleCancel();
      }}
      closable={false}
    >
      <ModalCopy>
        <ModalTitle>Select an asset</ModalTitle>
        <ModalDescription>
          Pick an asset to deposit into Volt {voltNumber}
        </ModalDescription>
        <Select
          placeholder="Choose asset"
          background="light"
          options={options}
          selectedOption={selectedOption}
          onChange={handleChange}
          useCustomOption={true}
        />
      </ModalCopy>
    </Modal>
  );
};

const ModalCopy = styled.div`
  width: 100%;
`;
