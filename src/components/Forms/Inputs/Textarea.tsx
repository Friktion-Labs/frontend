import styled from "@emotion/styled";
import { FunctionComponent, SyntheticEvent } from "react";
import { getCommonStyles } from "../Common";

export type TextareaProps = {
  onChange?: (e: SyntheticEvent) => void;
  value: string;
};

export const Textarea: FunctionComponent<TextareaProps> = (props) => {
  return <StyledTextArea {...props} />;
};

const StyledTextArea = styled.textarea`
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  height: 160px;
  border: none;
  resize: none;
  font-family: "Euclid Circular B";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  ${({ theme }) => getCommonStyles(theme)}

  :focus {
    border: none;
    outline: none;
  }
`;
