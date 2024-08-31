import React from 'react';

interface MonsterPortraitProps {
    src: string;
    alt: string;
}

const MonsterPortrait: React.FC<MonsterPortraitProps> = ({ src, alt }) => {
    return (
        <div className="monster-image-wrapper">
            <img src={src} alt={alt} className="monster-image" />
        </div>
    );
};

export default MonsterPortrait;