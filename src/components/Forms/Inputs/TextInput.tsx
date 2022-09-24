import styled from "@emotion/styled";
import { FunctionComponent, SyntheticEvent } from "react";
import { getCommonStyles } from "../Common";
export type TextFieldProps = {
  value?: string;
  name: string;
  placeholder?: string;
  onChange?: (e: SyntheticEvent) => void;
  type?: "text" | "password" | "email" | "number";
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
  noBorder?: boolean;
};

export const TextInput: FunctionComponent<TextFieldProps> = ({
  placeholder,
  type,
  name,
  value,
  onChange,
  addonStart,
  addonEnd,
  noBorder,
  ...rest
}) => {
  return (
    <InputContainer noBorder={noBorder}>
      {addonStart && <Addon>{addonStart}</Addon>}

      <Input
        value={value}
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        {...rest}
      />
      {addonEnd && <Addon end>{addonEnd}</Addon>}
    </InputContainer>
  );
};

const Addon = styled.div<{ end?: boolean }>`
  padding: ${({ end }) => (end ? `0px 10px` : `0px`)};
`;

const InputContainer = styled.div<{ noBorder?: boolean }>`
  border-radius: 8px;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  ${({ noBorder, theme }) => getCommonStyles(theme, noBorder)}
  input {
    padding: ${({ noBorder }) => noBorder && `0px`};
  }
`;

const Input = styled.input`
  all: unset;
  text-align: left;
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 8px;
  padding: 0px 10px;
  height: 44px;
  width: 100%;

  ::placeholder {
    font-family: "Inter";
    color: ${({ theme }) => theme.palette.grey[500]};
    font-size: 16px;
    line-height: 24px;
  }
`;
