import React from 'react';
import { Button, Space } from 'antd';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 2px;
  }
`;

const SaveButton = styled(StyledButton)`
  background: linear-gradient(45deg, #2196F3, #21CBF3);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(45deg, #1E88E5, #1CB5E0);
  }
`;

const DeleteButton = styled(StyledButton)`
  background: linear-gradient(45deg, #FF5252, #FF1744);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(45deg, #F44336, #D50000);
  }
`;

const ButtonContainer = styled(Space)`
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

interface ActionButtonsProps {
    isEditMode: boolean;
    onDelete: () => void;
    layout?: 'horizontal' | 'vertical';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditMode, onDelete, layout = 'horizontal' }) => {
    return (
        <ButtonContainer direction={layout}>
            <SaveButton type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {isEditMode ? 'Update' : 'Create'}
            </SaveButton>
            {isEditMode && (
                <DeleteButton onClick={onDelete} icon={<DeleteOutlined />}>
                    Delete
                </DeleteButton>
            )}
        </ButtonContainer>
    );
};