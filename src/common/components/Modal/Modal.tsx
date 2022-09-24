import { FunctionComponent } from "react";
import { Modal as AntdModal } from "antd";
import styled from "@emotion/styled";
import { Typography } from "common/components/Typography";

type FooterSpacing = "space-between" | "flex-start" | "flex-end";
type ModalProps = {
  footer?: React.ReactNode[] | boolean;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  closeIcon?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  closable?: boolean;
  zeroPadding?: boolean;
  footerSpacing?: FooterSpacing;
};

export const Modal: FunctionComponent<ModalProps> = ({
  visible,
  footer,
  onOk,
  onCancel,
  closeIcon,
  children,
  width = 400,
  closable,
  zeroPadding,
  footerSpacing,
}) => {
  return (
    <ModalContainer
      closable={closable}
      centered
      width={width}
      zeroPadding={zeroPadding}
      maskStyle={{
        background: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(2px)",
        WebkitBackfaceVisibility: "hidden",
        MozBackfaceVisibility: "hidden",
        WebkitTransform: "translate3d(0, 0, 0)",
        MozTransformOrigin: "translate3d(0, 0, 0)",
      }}
      visible={visible}
      footer={footer}
      onOk={onOk}
      onCancel={onCancel}
      closeIcon={closeIcon}
      title={null}
      footerSpacing={footerSpacing}
    >
      {children}
    </ModalContainer>
  );
};

const ModalContainer = styled(AntdModal)<{
  width?: number;
  zeroPadding?: boolean;
  footerSpacing?: FooterSpacing;
}>`
  .ant-modal-content {
    background: ${({ theme }) => theme.palette.background.modal};
    border: ${({ zeroPadding }) =>
      zeroPadding ? "0" : "1px solid rgba(255, 255, 255, 0.07)"};
    border-radius: 8px;
    width: ${({ width }) => width || 400}px;
    box-shadow: 0 0px 0px 0px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
      0 0px 28px -2px rgb(0 0 0 / 5%);
  }

  .ant-modal-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: ${({ zeroPadding }) => (zeroPadding ? "0px" : "24px")};
    padding-bottom: ${({ zeroPadding }) => (zeroPadding ? "0px" : "32px")};
  }

  .ant-modal-footer {
    padding: 24px;
    gap: 24px;
    padding-top: 0;
    display: flex;
    justify-content: ${({ footerSpacing }) => footerSpacing || "space-between"};
    border-top: none;
  }
`;

export const ModalTitle = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="h3" />
  )
)`
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "#FFFFFF !important"
      : "#000000 !important"};
`;

export const ModalDescription = styled(
  (props: { className?: string; children?: React.ReactNode }) => (
    <Typography {...props} variant="bodyM" />
  )
)`
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "#FFFFFF !important"
      : "#000000 !important"};
`;
