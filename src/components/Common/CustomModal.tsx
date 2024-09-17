import React from "react";
import { Modal, Button } from "antd";
import "./CustomModal.less";

interface CustomModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  content: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title,
  content,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="custom-modal"
      closable={false}
      centered
    >
      <div className="custom-modal-header">{title}</div>
      <div className="custom-modal-body">{content}</div>
      <div className="custom-modal-footer">
        <Button onClick={onCancel} className="cancel-button">
          取消
        </Button>
        <Button type="primary" onClick={onConfirm} className="confirm-button">
          确认
        </Button>
      </div>
    </Modal>
  );
};

export default CustomModal;
