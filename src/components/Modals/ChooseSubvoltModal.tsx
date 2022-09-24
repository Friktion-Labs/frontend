import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Button } from "common/components/Button";
import { Modal, ModalTitle, ModalDescription } from "common/components/Modal";
import { Select } from "../Forms/Inputs";

type ChooseSubvoltModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
};

export const ChooseSubvoltModal: FunctionComponent<ChooseSubvoltModalProps> = ({
  handleOk,
  handleCancel,
  isModalVisible,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      footer={[
        <Button onClick={handleCancel} variant="secondary">
          Cancel
        </Button>,
        <Button onClick={handleOk}>Next</Button>,
      ]}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
    >
      <ModalCopy>
        <ModalTitle>Choose a Subvolt</ModalTitle>
        <ModalDescription>
          Pick a Subvolt to issue the loan for
        </ModalDescription>
        <Select
          placeholder="Choose Volt"
          background="light"
          options={[
            { label: "Appollo", value: "appollo" },
            { label: "Athena", value: "athena" },
            { label: "Create new Volt", value: "create-new-volt" },
          ]}
        />
      </ModalCopy>
    </Modal>
  );
};

const ModalCopy = styled.div`
  width: 100%;
`;
