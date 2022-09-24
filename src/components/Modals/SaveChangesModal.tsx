import { FunctionComponent } from "react";
import { ApplyToBorrowModalIcon } from "../Icons";
import styled from "@emotion/styled";
import { Button } from "common/components/Button";
import { Modal, ModalTitle, ModalDescription } from "common/components/Modal";
import { CloseOutlined } from "@ant-design/icons";

type SaveChangesModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
};

export const SaveChangesModal: FunctionComponent<SaveChangesModalProps> = ({
  handleOk,
  handleCancel,
  isModalVisible,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      footer={[
        <Button onClick={handleCancel} variant="secondary">
          Discard
        </Button>,
        <Button onClick={handleOk}>Save Changes</Button>,
      ]}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={
        <CloseOutlined
          style={{ color: "#5D5D64", width: "12px", height: "12px" }}
        />
      }
    >
      <ApplyToBorrowModalIcon />
      <ModalCopy>
        <ModalTitle>Unsaved changes</ModalTitle>
        <ModalDescription>
          Do you want to save or discard changes?
        </ModalDescription>
      </ModalCopy>
    </Modal>
  );
};

const ModalCopy = styled.div``;
