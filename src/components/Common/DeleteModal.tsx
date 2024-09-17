// src/components/Common/DeleteModal.tsx
import React from "react";
import { Modal } from "antd";
import "../Common/CommonStyles.less";

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="Confirm Delete"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete this item?</p>
    </Modal>
  );
};
