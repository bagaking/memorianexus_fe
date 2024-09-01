import React from 'react';
import styled from 'styled-components';

interface MonsterPortraitProps {
    src: string;
    alt: string;
}

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
`;

const PortraitImage = styled.img`
    width: 100%;
    object-fit: cover;
    object-position: center top;
`;

const MonsterPortrait: React.FC<MonsterPortraitProps> = ({ src, alt }) => {
    return (
        <ImageWrapper>
            <PortraitImage src={src} alt={alt} />
        </ImageWrapper>
    );
};

export default MonsterPortrait;