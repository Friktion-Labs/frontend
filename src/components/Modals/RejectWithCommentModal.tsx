import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Modal, ModalTitle, ModalDescription } from "common/components/Modal";
import { Textarea } from "../Forms/Inputs";
import { Button } from "common/components/Button";

type RejectWithCommentModalProps = {
  handleOk: () => void;
  handleCancel: () => void;
  isModalVisible: boolean;
};

export const RejectWithCommentModal: FunctionComponent<
  RejectWithCommentModalProps
> = ({ handleOk, handleCancel, isModalVisible }) => {
  return (
    <Modal
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button variant="outline-primary" fullWidth onClick={handleCancel}>
          Skip
        </Button>,
        <Button variant="primary" fullWidth onClick={handleOk}>
          Reject with comment
        </Button>,
      ]}
      closable={false}
      width={578}
      footerSpacing="flex-end"
    >
      <ModalCopy>
        <ModalTitle>Reject with comment</ModalTitle>
        <ModalDescription>
          Help the borrower understand why their loan was rejected.
        </ModalDescription>

        <Textarea value="Collateral was a bit too low, please re-apply with collateral above $1,000,000 or equivelant value and we can accept." />
      </ModalCopy>
    </Modal>
  );
};

const ModalCopy = styled.div`
  width: 100%;
`;
