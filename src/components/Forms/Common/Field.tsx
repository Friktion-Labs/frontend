import styled from "@emotion/styled";
import { FunctionComponent } from "react";

type FieldProps = {
  label: string | React.ReactNode;
  additionalLabel?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
};

export const Field: FunctionComponent<FieldProps> = ({
  label,
  description,
  additionalLabel,
  children,
  ...rest
}) => {
  return (
    <Container {...rest}>
      <Label>
        <>
          {label} {` `}
          <Optional>{additionalLabel}</Optional>
        </>
      </Label>
      {children}
      {description && <Description>{description}</Description>}
    </Container>
  );
};

const Label = styled.label`
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[200]
      : theme.palette.grey[800]};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
`;

const Optional = styled.span`
  color: ${(props) => props.theme.palette.grey[400]};
`;

const Description = styled.p`
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[400]
      : theme.palette.grey[600]};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  margin-top: 4px;
  margin-bottom: 0;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
