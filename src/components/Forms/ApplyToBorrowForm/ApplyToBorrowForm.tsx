import { useState } from "react";
import { TextInput, Select } from "../Inputs";
import { SaveChangesModal, CompletedModal } from "../../Modals";
import { Form, FormGroup, Divider, Field } from "../Common";
import { countries } from "./Countries";
import { Button, ButtonWrapper } from "common/components/Button";

export type FormValues = {
  firstAndLastName: string;
  companyName: string;
  email: string;
  assets: string;
  wallet: string;
  companyWebsite: string;
  twitter: string;
  telegram: string;
  companyAddress: string;
  companyAddressTwo?: string;
  city: string;
  country: string;
};

export const ApplyToBorrowForm = () => {
  const [inputs, setInputs] = useState({} as FormValues);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCompletedModalVisible, setIsCompletedModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);
  const showCompletedModal = () => setIsCompletedModalVisible(true);
  const handleCompletedOk = () => setIsCompletedModalVisible(false);
  const handleCompletedCancel = () => setIsCompletedModalVisible(false);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <>
      <SaveChangesModal
        handleCancel={handleCancel}
        handleOk={handleOk}
        isModalVisible={isModalVisible}
      />
      <CompletedModal
        handleCancel={handleCompletedCancel}
        handleOk={handleCompletedOk}
        isModalVisible={isCompletedModalVisible}
        title="Application Submitted"
        description="You’ll hear from us soon."
      />
      <Form
        heading="Apply to Borrow"
        subheading="We need some information to set you up to borrow from our lending volts"
      >
        <FormGroup>
          <Field label="First and last name">
            <TextInput
              type="text"
              name="firstAndLastName"
              placeholder="Enter name"
              value={inputs.firstAndLastName}
              onChange={handleChange}
            />
          </Field>

          <Field label="Company name">
            <TextInput
              type="text"
              name="companyName"
              placeholder="Enter name"
              value={inputs.companyName}
              onChange={handleChange}
            />
          </Field>
        </FormGroup>
        <Divider />

        <FormGroup>
          <Field label="Assets under management">
            <TextInput
              name="assets"
              placeholder="Enter amount"
              value={inputs.assets}
              onChange={handleChange}
              type="number"
            />
          </Field>

          <Field label="Solana wallet" description="This can be changed later">
            <TextInput
              name="wallets"
              placeholder="Enter"
              value={inputs.wallet}
              onChange={handleChange}
              type="text"
            />
          </Field>
        </FormGroup>

        <FormGroup>
          <Field label="Email">
            <TextInput
              name="email"
              placeholder="Enter email"
              value={inputs.email}
              onChange={handleChange}
              type="email"
            />
          </Field>

          <Field
            label="Company website"
            description="This can be changed later"
          >
            <TextInput
              name="companyWebsite"
              placeholder="Enter URL"
              value={inputs.companyWebsite}
              onChange={handleChange}
              type="text"
            />
          </Field>
        </FormGroup>

        <FormGroup>
          <Field label="Twitter">
            <TextInput
              name="twitter"
              placeholder="@example"
              value={inputs.twitter}
              onChange={handleChange}
              type="text"
            />
          </Field>

          <Field
            label="Telegram"
            description="This can be changed later"
            additionalLabel="(Optional)"
          >
            <TextInput
              name="telegram"
              placeholder="@example"
              value={inputs.telegram}
              onChange={handleChange}
              type="text"
            />
          </Field>
        </FormGroup>

        <Divider />
        <FormGroup>
          <Field label="Company address">
            <TextInput
              name="companyAddress"
              placeholder="123 Main St."
              value={inputs.companyAddress}
              onChange={handleChange}
              type="text"
            />
          </Field>

          <Field
            label="Company address  2"
            description="This can be changed later"
            additionalLabel="(Optional)"
          >
            <TextInput
              name="companyAddressTwo"
              placeholder="Parktown"
              value={inputs.companyAddressTwo || ""}
              onChange={handleChange}
              type="text"
            />
          </Field>
        </FormGroup>

        <FormGroup>
          <Field label="City/County">
            <TextInput
              name="city"
              placeholder="123 Main St."
              value={inputs.city || ""}
              onChange={handleChange}
              type="text"
            />
          </Field>

          <Field label="Country">
            <Select options={countries} />
          </Field>
        </FormGroup>
        <ButtonWrapper>
          <Button onClick={showCompletedModal}>Submit application</Button>
          <Button variant="secondary" onClick={showModal}>
            Back
          </Button>
        </ButtonWrapper>
      </Form>
    </>
  );
};
