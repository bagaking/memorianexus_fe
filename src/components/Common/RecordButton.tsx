import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaMicrophone, FaStop } from 'react-icons/fa'; // 导入图标

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Button = styled.button<{ isRecording: boolean }>`
    background: linear-gradient(135deg, #007aff, #0051a8); /* 渐变背景 */
    color: white;
    border: none;
    border-radius: 50%; /* 圆形按钮 */
    width: 50px; /* 调整宽度 */
    height: 50px; /* 调整高度 */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease; /* 背景色和缩放过渡效果 */
    animation: ${props => props.isRecording ? css`${rotate} 1s linear infinite` : 'none'}; /* 录音时旋转动画 */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 阴影效果 */

    &:hover {
        background: linear-gradient(135deg, #0051a8, #003d7a); /* 悬停时的渐变颜色 */
        transform: scale(1.05); /* 悬停时放大 */
    }

    &:active {
        transform: scale(0.95); /* 点击时缩小 */
    }

    &:disabled {
        background-color: #b0b0b0; /* 禁用状态的颜色 */
        cursor: not-allowed; /* 禁用状态的光标 */
    }
`;

const Container = styled.div<{ position: 'left' | 'right' }>`
    position: fixed;
    bottom: 20px; /* 默认位置在底部 */
    ${props => props.position}: 20px; /* 根据配置放置在左边或右边 */
    z-index: 1000; /* 确保在其他元素之上 */
    cursor: move; /* 拖拽时显示手型 */
`;

interface RecordButtonProps {
    onRecord: (isRecording: boolean) => void;
    onAudioStop: (audioBlob: Blob) => void; // 新增回调处理音频
    onError?: (error: string) => void; // 新增错误处理回调
    position: 'left' | 'right'; // 配置位置
    dragBounds?: { top: number, right: number, bottom: number, left: number }; // 可拖动范围
}

const RecordButton: React.FC<RecordButtonProps> = ({ onRecord, onAudioStop, position, onError, dragBounds }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    const handleRecordingError = (error: string) => {
        onError && onError(error);
        console.error(error);
        stopRecording();
    };

    const playAudio = (audioBlob: Blob) => {
        console.log('playAudio');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.addEventListener('canplaythrough', () => {
            audio.play().catch(error => {
                console.error('播放音频时出错:', error);
            });
        });
        audio.addEventListener('error', (error) => {
            console.error('音频加载时出错:', error);
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            const chunks: Blob[] = [];
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
                console.log('ondataavailable event:', event.data);
            };

            recorder.start();
            setIsRecording(true);
            onRecord(true);

            recorder.onstop = async () => {
                console.log('recorder.onstop');
                console.log('chunks:', chunks);

                if (chunks.length <= 0) {
                    handleRecordingError('录音数据为空');
                    return;
                }

                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                setAudioChunks(chunks);
                setIsRecording(false);
                onRecord(false);

                onAudioStop(audioBlob);
                playAudio(audioBlob);
            };

        } catch (error) {
            handleRecordingError(`获取麦克风权限失败: ${error}`);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setOffset({ x: e.clientX, y: e.clientY });
        const container = document.getElementById('record-button-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            setInitialPosition({ x: rect.left, y: rect.top });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            const container = document.getElementById('record-button-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const bounds = dragBounds || { top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0 };
                const newX = Math.min(bounds.right - rect.width, Math.max(bounds.left, initialPosition.x + e.clientX - offset.x));
                const newY = Math.min(bounds.bottom - rect.height, Math.max(bounds.top, initialPosition.y + e.clientY - offset.y));
                container.style.transform = `translate(${newX - initialPosition.x}px, ${newY - initialPosition.y}px)`;
            }
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <Container
            id="record-button-container"
            position={position}
            onMouseDown={handleMouseDown}
        >
            <Button isRecording={isRecording} onClick={isRecording ? async () => await stopRecording() : startRecording}>
                {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />} {/* 使用图标 */}
            </Button>
        </Container>
    );
};

export default RecordButton;