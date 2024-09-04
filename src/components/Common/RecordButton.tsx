import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Button = styled.button<{ $isRecording: boolean }>`
    background: linear-gradient(135deg, #007aff, #0051a8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    animation: ${props => props.$isRecording ? css`${rotate} 1s linear infinite` : 'none'};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    &:hover {
        background: linear-gradient(135deg, #0051a8, #003d7a);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        background-color: #b0b0b0;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
    }
`;

const Container = styled.div<{ position: 'left' | 'right' }>`
    position: fixed;
    bottom: 20px;
    ${props => props.position}: 20px;
    z-index: 1000;
    cursor: move;

    @media (max-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
        ${props => props.position}: auto;
    }
`;

interface RecordButtonProps {
    onRecord: (isRecording: boolean) => void;
    onAudioStop: (audioBlob: Blob) => void;
    onTranscript?: (transcript: string) => void;
    onError?: (error: string) => void;
    position: 'left' | 'right';
    dragBounds?: { top: number, right: number, bottom: number, left: number };
    playAfterRecording?: boolean; // 新增参数
}

const RecordButton: React.FC<RecordButtonProps> = ({ 
    onRecord, 
    onAudioStop, 
    onTranscript, 
    position, 
    onError, 
    dragBounds,
    playAfterRecording = false // 默认为 false
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [recognition, setRecognition] = useState<any>(null);

    const handleRecordingError = (error: string) => {
        onError && onError(error);
        console.error(error);
        stopRecording();
    };

    const playAudio = (audioBlob: Blob) => {
        if (!playAfterRecording) return; // 如果 playAfterRecording 为 false，则不播放

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

    const initializeTranscription = () => { // 用浏览器默认的识别，不太行，还是考虑用第三方服务的 ASR
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('浏览器不支持语音识别');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');
            
            if (onTranscript) {
                onTranscript(transcript);
            }
            
            console.log('transcript', transcript, event.results);
        };

        recognition.start();
        return recognition;
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

            const newRecognition = initializeTranscription();
            setRecognition(newRecognition);

            recorder.onstop = async () => {
                console.log('recorder.onstop');
                console.log('chunks:', chunks);

                if (chunks.length <= 0) {
                    handleRecordingError('录音数据为空');
                    return;
                }

                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                setIsRecording(false);
                onRecord(false);

                onAudioStop(audioBlob);
                playAudio(audioBlob); // 这里会根据 playAfterRecording 参数决定是否播放

                if (newRecognition) {
                    newRecognition.stop();
                }
            };

        } catch (error) {
            handleRecordingError(`获取麦克风权限失败: ${error}`);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (recognition) {
            recognition.stop();
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
            <Button $isRecording={isRecording} onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
            </Button>
        </Container>
    );
};

export default RecordButton;