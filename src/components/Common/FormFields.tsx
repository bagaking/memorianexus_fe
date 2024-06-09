// src/components/Common/FormFields.tsx
import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

export const TitleField: React.FC = () => (
    <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
        <Input placeholder="Title" />
    </Form.Item>
);

export const DescriptionField: React.FC = () => (
    <Form.Item name="description" rules={[{ required: true, message: 'Please enter the description!' }]}>
        <Input.TextArea placeholder="Description" rows={4} />
    </Form.Item>
);

export const TagsField: React.FC = () => (
    <Form.Item name="tags">
        <Input placeholder="Tags (comma separated)" />
    </Form.Item>
);

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