// src/components/Common/EditableTagGroup.tsx
import React, { useState, useRef } from 'react';
import {Tag, Input, Tooltip, InputRef, Form, FormInstance} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './EditableTagGroup.css';
import MdEditor from "react-markdown-editor-lite";

interface EditableTagGroupProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

interface EditableTagFormItemProps {
    name: string;
    form: FormInstance;
}

export const EditableTagGroup: React.FC<EditableTagGroupProps> = ({ tags, onChange }) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const inputRef = useRef<InputRef>(null);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        onChange(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
        setEditIndex(null);
        setInputValue('');
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && editIndex === null && !tags.includes(inputValue)) {
            onChange([...tags, inputValue]);
        } else if (inputValue && editIndex !== null) {
            const newTags = [...tags];
            newTags[editIndex] = inputValue;
            onChange(newTags);
        }
        setInputVisible(false);
        setInputValue('');
        setEditIndex(null);
    };

    const handleTagClick = (index: number) => {
        setEditIndex(index);
        setInputValue(tags[index]);
        setInputVisible(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <div className="editable-tag-group">
            {tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag
                        key={tag}
                        closable
                        onClose={() => handleClose(tag)}
                        className="editable-tag"
                        onClick={() => handleTagClick(index)}
                    >
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible && (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    className="editable-tag-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag onClick={showInput} className="site-tag-plus">
                    <PlusOutlined /> New Tag
                </Tag>
            )}
        </div>
    );
};

export const EditableTagField: React.FC<EditableTagFormItemProps> = ({ name, form }) => {
    return (
        <Form.Item shouldUpdate={true}>
            {() => {
                if (!form) {
                    return <Input></Input>
                }
                const tags = form.getFieldValue(name) || [];
                return (
                    <EditableTagGroup tags={tags} onChange={(newTags) => {
                        form.setFieldsValue({ [name]: newTags })
                        console.log("newTags", newTags, form.getFieldValue(name))
                    }} />
                );
            }}
        </Form.Item>
    );
};