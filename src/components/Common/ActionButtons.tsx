import React from 'react';
import { Button } from 'antd';
import {ButtonType} from "antd/es/button";

import './CommonStyles.css';
import './ActionButtons.less';

interface ActionButtonsProps {
    isEditMode: boolean;
    onDelete: () => void;
    additionalButtons?: { label: string; onClick: () => void; type?: ButtonType; }[];
    layout?: 'horizontal' | 'vertical';
    flex_mode?: 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
}

export const ActionButtons: React.FC<ActionButtonsProps> = (
    {
        isEditMode, onDelete,
        additionalButtons = [],
        layout = 'horizontal',
        flex_mode ='flex-start'}
) => {
    return (
        <div className={`button-container ${layout === 'vertical' ? 'vertical' : 'horizontal'} ${flex_mode || 'flex-start'}`} >
            <Button type="primary" htmlType="submit" className="ant-btn-primary">
                {isEditMode ? 'Update' : 'Create'}
            </Button>
            {onDelete && (
                <Button type="primary" danger onClick={onDelete} className="ant-btn-danger">
                    Delete
                </Button>
            )}
            {additionalButtons.map((button, index) => (
                <Button key={index} type={button.type || 'default'} onClick={button.onClick} className="custom-btn">
                    {button.label}
                </Button>
            ))}
        </div>
    );
};