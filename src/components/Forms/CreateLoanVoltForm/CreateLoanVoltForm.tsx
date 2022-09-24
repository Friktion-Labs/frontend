import { useState } from "react";
import { TextInput, Select, SelectTextInputGroup } from "../Inputs";
import { Form, FormGroup, Field } from "../Common";
import { Usdc, Btc, Random } from "../../Icons";
import { Button, ButtonWrapper } from "common/components/Button";
import { useNavigate } from "react-router";

export type FormValues = {
  voltName: string;
  maxSupply: string;
  minSupply: string;
};

export const CreateLoanVoltForm = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({} as FormValues);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <Form heading="Create a SubVolt">
      <FormGroup>
        <Field label="Volt name">
          <TextInput
            type="text"
            name="firstAndLastName"
            placeholder="Enter name"
            value={inputs.voltName}
            onChange={handleChange}
            addonEnd={<Random />}
          />
        </Field>

        <Field label="Max Supply">
          <SelectTextInputGroup
            addonStart={<Btc />}
            name="maxSupply"
            placeholder="00.00"
            selectPlaceholder="USDC"
            options={[
              { label: "USDC", value: "USDC" },
              { label: "LUNA", value: "LUNA" },
            ]}
          />
        </Field>
      </FormGroup>

      <FormGroup>
        <Field label="Lender type">
          <Select
            placeholder="Permissioned"
            options={[
              { label: "Permissioned", value: "Permissioned" },
              { label: "Some Value", value: "Some Value" },
            ]}
          />
        </Field>

        <Field label="Max Borrow">
          <SelectTextInputGroup
            addonStart={<Usdc />}
            name="maxBorrow"
            placeholder="00.00"
            selectPlaceholder="USDC"
            options={[
              { label: "USDC", value: "USDC" },
              { label: "LUNA", value: "LUNA" },
            ]}
          />
        </Field>
      </FormGroup>
      <ButtonWrapper>
        <Button onClick={() => navigate("../../loans/request")}>Create</Button>
        <Button variant="secondary">Back</Button>
      </ButtonWrapper>
    </Form>
  );
};
