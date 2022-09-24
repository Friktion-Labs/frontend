import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

interface FormProps {
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
  onSubmit?: (e: React.SyntheticEvent | Event) => void;
}
export const Form: FunctionComponent<FormProps> = ({
  heading,
  subheading,
  children,
  onSubmit,
}) => {
  return (
    <FormContainer>
      {heading && <FormHeading>{heading}</FormHeading>}
      {subheading && <FormSubheading>{subheading}</FormSubheading>}
      <form onSubmit={onSubmit}>{children}</form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 100%;
  max-width: 656px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 24px auto;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 41px;
  }
`;

const FormHeading = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h3" />
  )
)`
  font-weight: 700;
  color: #fdfdfe;
  margin-bottom: 16px;
`;

const FormSubheading = styled.p`
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;

export const Divider = styled.div`
  border: 1px solid #323441;
  width: 100%;
`;

export const StyledLabel = styled.span`
  text-decoration: underline;
  text-decoration-style: dotted;
`;
