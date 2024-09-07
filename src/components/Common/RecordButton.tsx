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

const Button = styled.button<{ $isRecording: boolean; $shape: 'circle' | 'rounded' }>`
    background: linear-gradient(135deg, #007aff, #0051a8);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    animation: ${props => props.$isRecording ? css`${rotate} 1s linear infinite` : 'none'};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    ${props => props.$shape === 'circle' 
        ? css`border-radius: 50%;` 
        : css`border-radius: 10px;`
    }

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
        min-width: 40px;
        min-height: 40px;
    }
`;

const Container = styled.div<{ position: 'left' | 'right' | 'bottom' }>`
    position: fixed;
    z-index: 1000;
    cursor: move;

    ${props => {
        switch (props.position) {
            case 'left':
                return css`
                    left: 20px;
                    bottom: 20px;
                `;
            case 'right':
                return css`
                    right: 20px;
                    bottom: 20px;
                `;
            case 'bottom':
                return css`
                    left: 50%;
                    bottom: 20px;
                    transform: translateX(-50%);
                `;
        }
    }}

    @media (max-width: 768px) {
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
    }
`;

interface RecordButtonProps {
    onRecord: (isRecording: boolean) => void;
    onAudioStop: (audioBlob: Blob) => void;
    onTranscript?: (transcript: string) => void;
    onError?: (error: string) => void;
    position: 'left' | 'right' | 'bottom';
    shape?: 'circle' | 'rounded';
    dragBounds?: { top: number, right: number, bottom: number, left: number };
    playAfterRecording?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({ 
    onRecord, 
    onAudioStop, 
    onTranscript, 
    position, 
    shape = 'circle',
    onError, 
    dragBounds,
    playAfterRecording = false
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
        if (!playAfterRecording) return;

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

    const initializeTranscription = () => {
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
                playAudio(audioBlob);

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
            <Button 
                $isRecording={isRecording} 
                $shape={shape}
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
            </Button>
        </Container>
    );
};

export default RecordButton;