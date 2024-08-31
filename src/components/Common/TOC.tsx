import React from 'react';
import { Card } from 'antd';
import { Link as ScrollLink } from 'react-scroll';
import styled from 'styled-components';

interface TOCProps {
    title?: string;
  sections: string[];
}

const TOCContainer = styled(Card)`
  .ant-card-body {
    padding: 12px;
  }
`;

const TOCList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li`
  margin-bottom: 8px;
`;

const TOCLink = styled(ScrollLink)`
  display: block;
  padding: 4px 8px;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  white-space: normal;
  word-break: break-word;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &.active {
    color: #1890ff;
    background-color: rgba(24, 144, 255, 0.1);
  }
`;

const formatSectionName = (section: string) => {
  return section
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const TOC: React.FC<TOCProps> = ({ title = "menu", sections }) => {
  return (
    <TOCContainer title={title}>
      <TOCList>
        {sections.map((section) => (
          <TOCItem key={section}>
            <TOCLink
              to={section}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              activeClass="active"
            >
              {formatSectionName(section)}
            </TOCLink>
          </TOCItem>
        ))}
      </TOCList>
    </TOCContainer>
  );
};

export default TOC;