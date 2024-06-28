// src/components/Common/FormFields.tsx
import React, {useRef, useState} from 'react';
import { Form, Input, Select, FormInstance } from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface MarkdownEditorProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    rules: any
    onChange?: (value: string) => void;
}

const mdParser = new MarkdownIt();

export const MarkdownField: React.FC<MarkdownEditorProps> = ({
        name,
        label,
        placeholder = 'Description',
        value,
        onChange,
        rules,
        ...rest
}) => {
   return   <Form.Item name={name} label={label} valuePropName="value" getValueFromEvent={(e) => e.text} rules={rules}>
                <MdEditor value={value} placeholder={placeholder} onChange={e => onChange && onChange(e.text)}
                          renderHTML={(text) => mdParser.render(text)} style={{height: '300px', width: '100%'}} {...rest}
                ></MdEditor>
            </Form.Item>
}


export const TitleField: React.FC = () => (
    <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
        <Input placeholder="Title" />
    </Form.Item>
)


const { Option } = Select;
export const TypeField: React.FC = () => (
    <Form.Item name="type" rules={[{ required: true, message: 'Please select the item type!' }]}>
        <Select placeholder="Select a type">
            <Option value="flashcard">Flashcard</Option>
            <Option value="multiple_choice">Multiple Choice</Option>
            <Option value="fill_in_the_blank">Fill in the Blank</Option>
        </Select>
    </Form.Item>
);

export const BookIdsField: React.FC = () => (
    <Form.Item name="book_ids">
        <Input placeholder="Book IDs (comma separated)" />
    </Form.Item>
);