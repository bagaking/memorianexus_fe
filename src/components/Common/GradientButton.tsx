import React from 'react';
import { Button, ButtonProps } from 'antd';
import styled, { css, keyframes } from 'styled-components';

interface GradientButtonProps {
  startColor?: string;
  endColor?: string;
  hoverStartColor?: string;
  hoverEndColor?: string;
  textColor?: string;
  animation?: 'none' | 'pulse' | 'shake' | 'rotate' | 'shine';
  animationDuration?: string;
}

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const StyledButton = styled(Button)<GradientButtonProps>`
  background: ${props => `linear-gradient(135deg, ${props.startColor}, ${props.endColor})`};
  border: none;
  color: ${props => props.textColor || '#ffffff'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover, &:focus {
    background: ${props => `linear-gradient(135deg, ${props.hoverStartColor}, ${props.hoverEndColor})`};
    color: ${props => props.textColor || '#ffffff'};
  }

  ${props => props.type === 'link' && css`
    background: none !important;
    padding: 4px 8px;
    height: auto;
    
    &:hover, &:focus {
      background: none !important;
      text-decoration: underline;
    }
  `}

  ${props => props.animation === 'pulse' && css`
    &:hover {
      animation: ${pulseAnimation} ${props.animationDuration || '0.5s'} ease-in-out infinite;
    }
  `}

  ${props => props.animation === 'shake' && css`
    &:hover {
      animation: ${shakeAnimation} ${props.animationDuration || '0.5s'} ease-in-out;
    }
  `}

  ${props => props.animation === 'rotate' && css`
    &:hover {
      animation: ${rotateAnimation} ${props.animationDuration || '0.5s'} linear infinite;
    }
  `}

  ${props => props.animation === 'shine' && css`
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to right, 
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(30deg);
      transition: all 0.3s ease;
    }
    &:hover::after {
      animation: ${shineAnimation} ${props.animationDuration || '1.5s'} linear infinite;
    }
  `}
`;

const GradientButton: React.FC<ButtonProps & GradientButtonProps> = ({
  startColor = '#1890ff',
  endColor = '#40a9ff',
  hoverStartColor = '#40a9ff',
  hoverEndColor = '#1890ff',
  textColor = '#ffffff',
  animation = 'none',
  animationDuration = '0.5s',
  children,
  ...props
}) => {
  return (
    <StyledButton
      startColor={startColor}
      endColor={endColor}
      hoverStartColor={hoverStartColor}
      hoverEndColor={hoverEndColor}
      textColor={textColor}
      animation={animation}
      animationDuration={animation === 'shine' ? '1.5s' : animationDuration}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default GradientButton;