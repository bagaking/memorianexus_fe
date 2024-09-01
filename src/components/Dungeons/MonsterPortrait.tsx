import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// CDN 加速域名
const CDN_DOMAIN = 'https://memnexus-img.kenv.tech';

// 本地头像文件名数组
const portraits = [
    "skeleton_warrior_01.png",
    "skeleton_warrior_02.png",
    "skeleton_warrior_03.png",
    "skeleton_warrior_04.png",
    "skeleton_warrior_05.png",
    "skeleton_warrior_06.png",
    "skeleton_warrior_07.png",
    "evil_warrior_01.png",
    "evil_warrior_02.png",
    "evil_warrior_03.png",
    "evil_warrior_04.png",
    "evil_warrior_05.png",
    "evil_warrior_06.png",
    "human_warrior_01.png",
    "human_warrior_02.png",
    "human_warrior_03.png",
    "human_warrior_04.png",
    "human_warrior_05.png",
    "human_warrior_06.png",
    "goblin_warrior_01.png",
    "goblin_warrior_02.png",
    "goblin_warrior_03.png",
    "goblin_warrior_04.png",
    "sea_warrior_01.png",
    "sea_warrior_02.png",
    "sea_warrior_03.png",
    "sea_warrior_04.png",
    "sea_warrior_05.png",
    "sea_warrior_06.png",
    "sea_warrior_07.png",
    "engineer_warrior_01.png",
    "engineer_warrior_02.png",
    "engineer_warrior_03.png",
    "engineer_warrior_04.png",
    "engineer_warrior_05.png",
    "engineer_warrior_06.png",
];

// 计算字符串的哈希值
const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // 转换为32位整数
    }
    return hash;
};

// 根据 ID 获取怪物头像文件名
export const getMonsterPortrait = (id: string): string => {
    const hash = hashCode(id);
    const index = Math.abs(hash) % portraits.length;
    return portraits[index];
};

// 组件属性接口
interface MonsterPortraitProps {
    id: string;
    alt: string;
}

// 样式化的容器组件
const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

// 样式化的图片组件
const PortraitImage = styled.img`
    width: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.3s ease;
`;

// 怪物头像组件
const MonsterPortrait: React.FC<MonsterPortraitProps> = ({ id, alt }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [useCDN, setUseCDN] = useState(true);

    useEffect(() => {
        const portraitFileName = getMonsterPortrait(id);
        const cdnUrl = `${CDN_DOMAIN}/portraits/${portraitFileName}`;
        const localUrl = `/portraits/${portraitFileName}`;
        setImageSrc(useCDN ? cdnUrl : localUrl);
    }, [id, useCDN]);

    const handleImageError = () => {
        if (useCDN) {
            // 如果 CDN 加载失败，切换到本地图片
            setUseCDN(false);
        }
    };

    return (
        <ImageWrapper>
            <PortraitImage src={imageSrc} alt={alt} onError={handleImageError} />
        </ImageWrapper>
    );
};

export default MonsterPortrait;