import React from 'react';
import './InPageControlPanel.less';

interface InPageControlPanelProps {
    children: React.ReactNode; // 接收子组件
    layout?: 'default' | 'center' | 'spread'; // 布局方式
}

const InPageControlPanel: React.FC<InPageControlPanelProps> = ({ children, layout = 'default' }) => {
    return (
        <div className={`in-page-control-panel ${layout}`}>
            <div className="control-content">
                {children}
            </div>
        </div>
    );
};

export default InPageControlPanel;