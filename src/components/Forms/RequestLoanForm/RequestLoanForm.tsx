import { FunctionComponent } from "react";

import { Usdc, Btc } from "../../Icons";

import { DatePicker } from "../../DatePicker";
import { SelectTextInputGroup, Select } from "../Inputs";

import { Form, FormGroup, StyledLabel, Field } from "../Common";
import { Button, ButtonWrapper } from "common/components/Button";
import { css } from "@emotion/react";

export const RequestLoanForm: FunctionComponent<{
  handleSubmit: () => void;
  handleCancel: () => void;
}> = ({ handleSubmit, handleCancel }) => {
  return (
    <Form>
      <FormGroup>
        <Field label={<StyledLabel>Loan amount</StyledLabel>}>
          <SelectTextInputGroup
            addonStart={<Usdc />}
            name="loanAmount"
            placeholder="00.00"
            selectPlaceholder="USDC"
            options={[
              { label: "USDC", value: "USDC" },
              { label: "LUNA", value: "LUNA" },
            ]}
          />
        </Field>

        <Field
          label="Collateral amount"
          additionalLabel="(Optional)"
          description="0% collateral"
        >
          <SelectTextInputGroup
            addonStart={<Btc />}
            name="collateralAmount"
            selectPlaceholder="USDC"
            placeholder="00.00"
            options={[
              { label: "USDC", value: "USDC" },
              { label: "LUNA", value: "LUNA" },
            ]}
          />
        </Field>
      </FormGroup>

      <FormGroup>
        <Field label="Start Date">
          <DatePicker />
        </Field>

        <Field
          label={
            <StyledLabel>
              Rate{" "}
              <span
                css={(theme) => css`
                  color: ${theme.palette.grey[400]};
                `}
              >
                (APR)
              </span>
            </StyledLabel>
          }
        >
          <DatePicker />
        </Field>
      </FormGroup>

      <FormGroup>
        <Field label="Term" description="Ending: 24 May 2024">
          <Select
            placeholder="Months"
            options={[
              { label: "0", value: "0" },
              { label: "2", value: "2" },
            ]}
          />
        </Field>

        <Field
          label="Repayments"
          additionalLabel="(Optional)"
          description="First payment due on..."
        >
          <Select
            placeholder="Select a repayment option"
            options={[
              { label: "Monthly", value: "Monthly" },
              { label: "At maturity", value: "At maturity" },
            ]}
          />
        </Field>
      </FormGroup>

      <ButtonWrapper>
        <Button onClick={handleCancel} variant="secondary">
          Back
        </Button>
        <Button onClick={handleSubmit}>Review loan</Button>
      </ButtonWrapper>
    </Form>
  );
};
