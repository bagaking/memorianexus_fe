import React from 'react';
import { Tooltip, Card } from 'antd';
import Markdown from 'react-markdown';
import { TooltipPlacement } from 'antd/es/tooltip';
import {Link} from "react-router-dom";

interface FirstLineProps {
    content: string;
    color?: string;
    placement?: TooltipPlacement;
    showName?: string;
    link?: string;
    [key: string]: any;
}

const FirstLine: React.FC<FirstLineProps> = ({ content, color, placement, showName, link, ...rest }) => {
    const firstLine = (content || "").split('\n')[0]; // 提取首行内容

    return (
        <Tooltip
            title={ // 设置卡片高度和一般文本差不多
                <Card style={{
                    margin: 0, padding: 0, height: 'auto', lineHeight: 'normal', background:"transparent", border: "none"
                }}>
                    <Markdown>{content}</Markdown>
                    {link && <Link to={link} target="_blank">跳转</Link>}
                </Card>
            }
            color={color || "lightblue"}
            placement={placement || "topLeft"}
            overlayStyle={{ maxWidth: '500px' }} // 设置 Tooltip 的最大宽度
        >
            <div style={{ marginBottom: '8px', height: 'auto', lineHeight: 'normal' }} {...rest} // 设置卡片高度和一般文本差不多
            >
                {showName || firstLine}
            </div>
        </Tooltip>
    );
};

export default FirstLine;