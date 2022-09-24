import { TextInput, Select } from ".";
import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import { SelectPropsDeprecated, TextFieldProps } from ".";
import { getCommonStyles } from "../Common";

interface SelectTextInputGroupProps
  extends SelectPropsDeprecated,
    TextFieldProps {
  selectPlaceholder?: string;
}

export const SelectTextInputGroup: FunctionComponent<
  SelectTextInputGroupProps
> = ({ addonStart, options, name, selectPlaceholder, placeholder }) => {
  return (
    <Container>
      <TextInput
        addonStart={addonStart}
        type="text"
        name={name}
        placeholder={placeholder}
        noBorder
      />
      <Select options={options} placeholder={selectPlaceholder} noBorder />
    </Container>
  );
};

const Container = styled.div`
  text-align: left;
  color: white;
  border-radius: 8px;
  padding: 0px 10px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => getCommonStyles(theme)}
`;
