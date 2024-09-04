// src/components/Common/FormFields.tsx
import React from 'react';
import { Form, Input, Select } from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import styled from 'styled-components';
import { useIsMobile } from '../../hooks/useWindowSize';

const TyItemFlashCard = "flash_card"
const TyItemMultipleChoice = "multiple_choice"
const TyItemCompletion = "completion"

interface MarkdownEditorProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    rules: any
    onChange?: (value: string) => void;
}

const mdParser = new MarkdownIt();

const StyledMdEditor = styled(MdEditor)`
  .rc-md-editor {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  .rc-md-navigation {
    background-color: #f0f2f5;
    border-bottom: 1px solid #d9d9d9;
    padding: 5px;
  }

  @media (max-width: 768px) {

    .rc-md-navigation {
      justify-content: center;
      font-size: 12px;
    }
 
    .rc-md-editor .editor-container {
      flex-direction: column;
    }

    .rc-md-editor .editor-container .sec-md,
    .rc-md-editor .editor-container .sec-html {
      width: 100% !important;
      flex: none !important;
    }

    .rc-md-editor .editor-container .sec-md {
      border-right: none;
      border-bottom: 1px solid #d9d9d9;
    }
  }

  @media (max-width: 480px) {
    .rc-md-navigation .button-wrap .button {
      margin: 2px;
      padding: 4px;
      font-size: 12px;
    }

    .rc-md-editor-content {
      min-height: 150px;
    }
  }
`;

export const MarkdownField: React.FC<MarkdownEditorProps> = ({
    name,
    label,
    placeholder = 'Description',
    value,
    onChange,
    rules,
    ...rest
}) => {
   const isMobile = useIsMobile();

   return (
     <Form.Item 
       name={name} 
       label={label} 
       valuePropName="value" 
       getValueFromEvent={(e: { text: string }) => e.text} 
       rules={rules}
     >
       <StyledMdEditor 
         value={value} 
         placeholder={placeholder} 
         onChange={(e: { text: string }) => onChange && onChange(e.text)}
         renderHTML={(text: string) => mdParser.render(text)} 
         style={{width: '100%'}} 
         view={{ menu: true, md: true, html: !isMobile }}
         {...rest}
       />
     </Form.Item>
   );
}

interface TitleFieldProps {
    name?: string;
}

export const TitleField: React.FC<TitleFieldProps> = ({ name = "title" }) => (
    <Form.Item name={name} rules={[{ required: true, message: 'Please enter the title!' }]}>
        <Input placeholder="Title" />
    </Form.Item>
)

const { Option } = Select;
export const TypeField: React.FC = () => (
    <Form.Item name="type" rules={[{ required: true, message: 'Please select the item type!' }]}>
        <Select placeholder="Select a type">
            <Option value={TyItemFlashCard}>Flashcard</Option>
            <Option value={TyItemMultipleChoice}>Multiple Choice</Option>
            <Option value={TyItemCompletion}>Fill in the Blank</Option>
        </Select>
    </Form.Item>
);

export const BookIdsField: React.FC = () => (
    <Form.Item name="book_ids">
        <Input placeholder="Book IDs (comma separated)" />
    </Form.Item>
);