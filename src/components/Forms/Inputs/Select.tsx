import { FunctionComponent, SyntheticEvent } from "react";
import styled from "@emotion/styled";
import ReactSelect from "react-select";
import { getCommonStyles } from "../Common";
import { CustomOption, Op } from "components/Modals/ChooseAssetDepositModal";

export type SelectPropsDeprecated = {
  onChange?: (e: SyntheticEvent) => void;
  options:
    | {
        label: string | React.ReactNode;
        value: string;
      }[]
    | Op[];
  placeholder?: string;
  width?: number;
  background?: "light" | "dark";
  noBorder?: boolean;
  isSearchable?: boolean;
};

export type SelectProps = {
  onChange?: (a: Op) => void;
  options:
    | {
        label: string | React.ReactNode;
        value: string;
      }[]
    | Op[];
  placeholder?: string;
  width?: number;
  background?: "light" | "dark";
  noBorder?: boolean;
  isSearchable?: boolean;
  useCustomOption?: boolean;
  selectedOption?: Op | null;
};

export const Select: FunctionComponent<SelectProps> = ({
  options,
  placeholder,
  noBorder,
  isSearchable,
  useCustomOption,
  selectedOption,
  onChange,
}) => {
  return (
    <StyledSelect
      placeholder={placeholder}
      classNamePrefix="Select"
      options={options}
      noBorder={noBorder}
      isSearchable={isSearchable}
      value={selectedOption}
      components={
        useCustomOption
          ? {
              Option: CustomOption as any,
            }
          : undefined
      }
      //@ts-ignore // ugh i dont want to deal with this. its not infectious
      onChange={onChange}
    />
  );
};

const StyledSelect = styled(ReactSelect)<{ noBorder?: boolean }>`
  .Select__control {
    height: 44px;
    width: auto;
    ${(props) => props.theme.typography.bodyM}
    color: ${({ theme }) => theme.palette.grey[200]};
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    ${({ theme, noBorder }) => getCommonStyles(theme, noBorder)}
  }

  .Select__single-value {
    color: ${({ theme }) => (theme.palette.mode === "dark" ? "#FFF" : "#000")};
  }

  .Select__control:hover {
    border-color: none;
  }

  .Select__indicator-separator {
    display: none;
  }

  .Select__menu {
    cursor: pointer;
    color: ${({ theme }) => (theme.palette.mode === "dark" ? "#FFF" : "#000")};
    text-align: left;
    ${({ theme }) => getCommonStyles(theme)}
  }

  .Select__option {
    &.Select__option--is-focused,
    &:hover {
      background-color: #404355;
    }
  }
`;

export const SelectItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;

  p {
    margin: 0px;
  }
`;
