// src/components/Common/ActionButtons.tsx
import React from 'react';
import { Button, Form } from 'antd';
import '../Common/CommonStyles.css';

interface ActionButtonsProps {
    isEditMode: boolean;
    onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditMode, onDelete }) => {
    return (
        <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                {isEditMode ? 'Update' : 'Create'}
            </Button>
            {isEditMode && (
                <Button type="primary" danger onClick={onDelete}>
                    Delete
                </Button>
            )}
        </Form.Item>
    );
};