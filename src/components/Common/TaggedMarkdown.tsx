import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Typography, Tag } from 'antd';

const { Text } = Typography;

interface TaggedMarkdownProps {
  children: string;
  tagStyles?: {
    [key: string]: React.CSSProperties;
  };
  mode?: 'tag' | 'heading' | 'both';
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

const tagStyle: React.CSSProperties = {
  borderRadius: '4px', 
  padding: '0 4px', 
  marginRight: '4px', 
  fontSize: '8px',
  lineHeight: '16px',
  verticalAlign: 'middle',
};

export const createTaggedRenderer = (tagStyles: { [key: string]: React.CSSProperties }, mode: 'tag' | 'heading' | 'both' = 'tag') => {
  return (nodeType: string) => {
    return ({ children }: React.PropsWithChildren<{}>) => (
      <span style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        {(mode === 'tag' || mode === 'both') && (
          <Tag color={tagStyles[nodeType]?.color || 'default'} style={{ 
            ...tagStyle,
            ...tagStyles[nodeType]
          }}>
            <Text type="secondary">{nodeType}</Text>
          </Tag>
        )}
        {mode === 'heading' ? (
          React.createElement(nodeType, { style: { margin: 0 } }, children)
        ) : mode === 'both' ? (
          React.createElement(nodeType, { style: { margin: 0 } }, children)
        ) : (
          <Text strong>{children}</Text>
        )}
      </span>
    );
  };
};

export const TaggedMarkdown: React.FC<TaggedMarkdownProps> = ({ 
  children, 
  tagStyles = {}, 
  mode = 'both',
  customRenderers = {}
}) => {
  const mergedTagStyles = { ...defaultTagStyles, ...tagStyles };
  const defaultRenderers: Components = {
    h1: createTaggedRenderer(mergedTagStyles, mode)('h1'),
    h2: createTaggedRenderer(mergedTagStyles, mode)('h2'),
    h3: createTaggedRenderer(mergedTagStyles, mode)('h3'),
    h4: createTaggedRenderer(mergedTagStyles, mode)('h4'),
    h5: createTaggedRenderer(mergedTagStyles, mode)('h5'),
    h6: createTaggedRenderer(mergedTagStyles, mode)('h6'),
  };

  const mergedRenderers = { ...defaultRenderers, ...customRenderers };

  return <ReactMarkdown components={mergedRenderers}>{children}</ReactMarkdown>;
};

export default TaggedMarkdown;