// src/components/Common/FormFields.tsx
import React, {useRef, useState} from 'react';
import { Form, Input, Select, FormInstance } from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface MarkdownEditorProps {
    name: string;
    initialValue?: string;
    required?: boolean;
    message?: string;
    placeholder?: string;
    shouldUpdate?: boolean;
    form?: FormInstance;
}

const mdParser = new MarkdownIt();
const { Option } = Select;


export const MarkdownField: React.FC<MarkdownEditorProps> = ({ name, form , required = false, message = 'Please enter!', placeholder = 'Description' }) => {
    return <Form.Item name={name} rules={[{required, message}]} shouldUpdate >
        {(!form) ?
            <Input style={{height: '300px', width: '100%'}}  /> :
            <MdEditor value={form.getFieldValue(name)}
                      style={{height: '300px', width: '100%'}}
                      renderHTML={(text) => mdParser.render(text)}
                    onChange={({text}) => form.setFieldsValue({[name]: text})}></MdEditor>
        }
    </Form.Item>
}


export const TitleField: React.FC = () => (
    <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
        <Input placeholder="Title" />
    </Form.Item>
)


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