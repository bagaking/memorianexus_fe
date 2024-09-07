import React from 'react';
import './InPageControlPanel.less';

interface InPageControlPanelProps {
    children: React.ReactNode; // 接收子组件
}

const InPageControlPanel: React.FC<InPageControlPanelProps> = ({ children }) => {
    return (
        <div className="in-page-control-panel">
            <div className="control-content">
                {children}
            </div>
        </div>
    );
};

export default InPageControlPanel;