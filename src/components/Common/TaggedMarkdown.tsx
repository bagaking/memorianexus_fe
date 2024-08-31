import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Typography, Tag } from 'antd';

const { Text } = Typography;

interface TaggedMarkdownProps {
  children: string;
  tagStyles?: {
    [key: string]: React.CSSProperties;
  };
  indentHeadings?: boolean;
  customRenderers?: Partial<Components>;
}

const defaultTagStyles: { [key: string]: React.CSSProperties } = {
  h1: { color: '#1890ff' },
  h2: { color: '#52c41a' },
  h3: { color: '#faad14' },
  h4: { color: '#f5222d' },
  h5: { color: '#722ed1' },
  h6: { color: '#eb2f96' },
};

export const createTaggedRenderer = (tagStyles: { [key: string]: React.CSSProperties }, indentHeadings: boolean) => {
  return (nodeType: string) => {
    return ({ children }: React.PropsWithChildren<{}>) => (
      <Text>
        {indentHeadings && (
          <Tag color={tagStyles[nodeType]?.color || 'default'} style={{ 
            borderRadius: '2px', 
            padding: '0 2px', 
            marginRight: '2px', 
            fontSize: '10px',
            ...tagStyles[nodeType]
          }}>
            <Text type="secondary">{nodeType}</Text>
          </Tag>
        )}
        <Text strong>{children}</Text>
      </Text>
    );
  };
};

export const TaggedMarkdown: React.FC<TaggedMarkdownProps> = ({ 
  children, 
  tagStyles = {}, 
  indentHeadings = true,
  customRenderers = {}
}) => {
  const mergedTagStyles = { ...defaultTagStyles, ...tagStyles };
  const defaultRenderers: Components = {
    h1: createTaggedRenderer(mergedTagStyles, indentHeadings)('h1'),
    h2: createTaggedRenderer(mergedTagStyles, indentHeadings)('h2'),
    h3: createTaggedRenderer(mergedTagStyles, indentHeadings)('h3'),
    h4: createTaggedRenderer(mergedTagStyles, indentHeadings)('h4'),
    h5: createTaggedRenderer(mergedTagStyles, indentHeadings)('h5'),
    h6: createTaggedRenderer(mergedTagStyles, indentHeadings)('h6'),
  };

  const mergedRenderers = { ...defaultRenderers, ...customRenderers };

  return <ReactMarkdown components={mergedRenderers}>{children}</ReactMarkdown>;
};

export default TaggedMarkdown;