import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Button as Sbutton } from "common/components/Button";
import { Modal, ModalDescription } from "common/components/Modal";
import { Typography } from "common/components/Typography";

type ApplyToBorrowModalProps = {
  handleCancel: () => void;
  isModalVisible: boolean;
};

export const ActiveLoanWarningModal: FunctionComponent<
  ApplyToBorrowModalProps
> = ({ handleCancel, isModalVisible }) => {
  return (
    <Modal
      visible={isModalVisible}
      footer={[
        <Button fullWidth onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
      onCancel={handleCancel}
      closable={false}
      width={413}
    >
      <ModalContent>
        <ModalTitle>Send a reminder</ModalTitle>
        <ModalDescription>
          How would you like to contact the borrower?
        </ModalDescription>
        <ModalButtons>
          <LinkButton fullWidth variant="link">
            <a href="https://friktion.fi/"> Telegram — @alamadalabs</a>
          </LinkButton>
          <LinkButton fullWidth variant="link">
            <a href="https://friktion.fi/">Email — team@alameda.com</a>
          </LinkButton>
        </ModalButtons>
      </ModalContent>
    </Modal>
  );
};

const ModalTitle = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h4" />
  )
)`
  font-weight: 600px;
  text-align: center;
`;

const ModalContent = styled.div``;

const ModalButtons = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Button = styled(Sbutton)`
  background: none;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const LinkButton = styled(Sbutton)`
  a {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;
