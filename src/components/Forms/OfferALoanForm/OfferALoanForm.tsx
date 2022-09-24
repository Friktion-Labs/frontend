import { Usdc, Btc } from "../../Icons";
import { DatePicker } from "../../DatePicker";
import { Form, FormGroup, StyledLabel, Field } from "../Common";
import { SelectTextInputGroup, SelectItem, Select } from "../Inputs";
import { ChooseSubvoltModal } from "../../Modals";
import { useState } from "react";
import { Button, ButtonWrapper } from "common/components/Button";

export const OfferALoanForm = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  const handleOk = () => console.log("next has been clicked");

  return (
    <>
      <ChooseSubvoltModal
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
      />
      <Form
        heading="Offer a loan"
        subheading="Pick a Pool to borrow from, provide loan details, submit for approval "
      >
        <FormGroup>
          <Field label="Borrowers">
            <Select
              isSearchable={false}
              placeholder="Permissioned"
              options={[
                {
                  label: (
                    <SelectItem>
                      <Usdc /> <p>Alameda Research</p>
                    </SelectItem>
                  ),
                  value: "alameda-research",
                },
                {
                  label: (
                    <SelectItem>
                      <Btc /> <p>3 Arrows Capital</p>
                    </SelectItem>
                  ),
                  value: "3-arrows",
                },
              ]}
            />
          </Field>
          <Field label="">{}</Field>
        </FormGroup>
        <FormGroup>
          <Field label={<StyledLabel>Loan amount</StyledLabel>}>
            <SelectTextInputGroup
              addonStart={<Usdc />}
              name="loanAmount"
              placeholder="00.00"
              selectPlaceholder="USDC"
              isSearchable={false}
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
              placeholder="00.00"
              selectPlaceholder="USDC"
              isSearchable={false}
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

          <Field label="Rate" additionalLabel="(APR)">
            <DatePicker />
          </Field>
        </FormGroup>
        <FormGroup>
          <Field label="Term" description="Ending: 24 May 2024">
            <Select
              placeholder="Months"
              isSearchable={false}
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
              isSearchable={false}
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "At maturity", value: "At maturity" },
              ]}
            />
          </Field>
        </FormGroup>
        <ButtonWrapper>
          <Button onClick={showModal}> Review Loan</Button>
          <Button variant="secondary">Back</Button>
        </ButtonWrapper>
      </Form>
    </>
  );
};
