import React, { useState, useEffect } from 'react';

// CDN 加速域名
const CDN_DOMAIN = 'http://memnexus-img.kenv.tech';

// 判断是否为测试环境
const isTestEnvironment = (): boolean => {
//   return false // 用于测试 CDN
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

interface CDNImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrcs?: string[];
}

const CDNImage: React.FC<CDNImageProps> = ({ src, alt, fallbackSrcs = [], ...props }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [fallbackIndex, setFallbackIndex] = useState<number>(-1);

  const isAbsoluteUrl = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
  };

  const getCDNUrl = (url: string): string => {
    if (isTestEnvironment() || isAbsoluteUrl(url)) {
      return url;
    }
    return `${CDN_DOMAIN}${url}`;
  };

  useEffect(() => {
    setCurrentSrc(getCDNUrl(src));
    setFallbackIndex(-1);
  }, [src]);

  const handleImageError = () => {
    if (fallbackIndex === -1) {
      console.log(`图片加载失败：${currentSrc}，正在尝试回退选项`);
      setFallbackIndex(0);
    } else if (fallbackIndex < fallbackSrcs.length) {
      console.log(`回退选项 ${fallbackIndex} 加载失败：${currentSrc}，尝试下一个选项`);
      setFallbackIndex(fallbackIndex + 1);
    } else {
      console.log(`所有选项都失败，使用原始源：${src}`);
      setCurrentSrc(src);
    }
  };

  useEffect(() => {
    if (fallbackIndex >= 0 && fallbackIndex < fallbackSrcs.length) {
      setCurrentSrc(getCDNUrl(fallbackSrcs[fallbackIndex]));
    } else if (fallbackIndex >= fallbackSrcs.length) {
      setCurrentSrc(src);
    }
  }, [fallbackIndex, fallbackSrcs, src]);

  return <img src={currentSrc} alt={alt} onError={handleImageError} {...props} />;
};

export default CDNImage;