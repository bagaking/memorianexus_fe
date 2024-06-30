// src/components/Common/EditableTagGroup.tsx
import React, { useState, useRef } from 'react';
import {Tag, Input, Tooltip, InputRef, Form} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './EditableTagGroup.css';

interface EditableTagGroupProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
}

export const EditableTagGroup: React.FC<EditableTagGroupProps> = ({ value, onChange }) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const inputRef = useRef<InputRef>(null);

    const handleClose = (removedTag: string) => {
        const newTags = (value || []).filter(tag => tag !== removedTag);
        onChange && onChange(newTags);
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
        if (inputValue && editIndex === null && !(value || []).includes(inputValue)) {
            onChange && onChange([...(value || []), inputValue]);
        } else if (inputValue && editIndex !== null) {
            const newTags = [...(value || [])];
            newTags[editIndex] = inputValue;
            onChange && onChange(newTags);
        }
        setInputVisible(false);
        setInputValue('');
        setEditIndex(null);
    };

    const handleTagClick = (index: number) => {
        setEditIndex(index);
        setInputValue((value || [])[index]);
        setInputVisible(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <div className="editable-tag-group">
            {(value || []).map((tag, index) => {
                const isLongTag: boolean = tag.length > 20;
                const tagElem = (
                    <Tag key={tag} closable className="editable-tag"
                         onClose={() => handleClose(tag)} onClick={() => handleTagClick(index)}>
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
                <Input ref={inputRef} type="text" size="small" className="editable-tag-input" value={inputValue}
                       onChange={handleInputChange} onBlur={handleInputConfirm} onPressEnter={handleInputConfirm}/>
            )}
            {!inputVisible && (
                <Tag onClick={showInput} className="site-tag-plus">
                    <PlusOutlined /> New Tag
                </Tag>
            )}
        </div>
    );
};


interface EditableTagGroupFormItemProps {
    name: string;
    label?: string;
    rules?: any;
    value?: string[];
    onChange?: (tags: string[]) => void;
    [key: string]: any; // 透传其他属性
}

export const EditableTagField: React.FC<EditableTagGroupFormItemProps> = (
    {name, label, rules, value = [], onChange, ...rest}
) => {
    return (
        <Form.Item name={name} label={label} rules={rules} valuePropName="value" getValueFromEvent={(e) => {
                console.log("e", e)
                return e // 可以拿到
            }}>
            <EditableTagGroup value={value} onChange={v => {
                console.log("v", v)
                onChange && onChange(v)
            }} {...rest} />
        </Form.Item>
    );
};

// export const MarkdownField: React.FC<MarkdownEditorProps> = ({name,label, rules, placeholder = 'Description', value, ...rest}) => {
//     return   <Form.Item name={name} label={label} rules={rules} valuePropName="value" getValueFromEvent={(e) => e.text}>
//         <MdEditor value={value} placeholder={placeholder}
//                   renderHTML={(text) => mdParser.render(text)} style={{height: '300px', width: '100%'}}
//                   {...rest}
//         ></MdEditor>
//     </Form.Item>
// }