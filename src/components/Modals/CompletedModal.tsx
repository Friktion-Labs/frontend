import { FunctionComponent } from "react";
import { CompletedIcon } from "../Icons";
import styled from "@emotion/styled";
import { Modal, ModalTitle, ModalDescription } from "common/components/Modal";

type CompletedModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
  title: string;
  description: string;
};

export const CompletedModal: FunctionComponent<CompletedModalProps> = ({
  handleOk,
  handleCancel,
  isModalVisible,
  title,
  description,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      closable={false}
      width={386}
    >
      <IconContainer>
        <CompletedIcon />
      </IconContainer>
      <ModalCopy>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
      </ModalCopy>
    </Modal>
  );
};

const IconContainer = styled.div`
  margin-bottom: 16px;
`;

const ModalCopy = styled.div``;
