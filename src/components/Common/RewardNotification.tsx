import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import goldIcon from '../../assets/icons/gold_icon.png';
import './RewardNotification.less';

interface RewardNotificationProps {
  amount: number;
  icon?: string;
  duration?: number;
  children?: React.ReactNode;
  onClose: () => void;
  index: number;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({ 
  amount, 
  icon = goldIcon, 
  duration = 2000,
  children,
  onClose,
  index
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAmount, setCurrentAmount] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startTime = Date.now();
    const numberScrollAnimationDura = 600;

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animateCounting = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / numberScrollAnimationDura, 1);
      const easedProgress = easeOutQuart(progress);
      setCurrentAmount(Math.floor(easedProgress * amount));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCounting);
      }
    };
    animationRef.current = requestAnimationFrame(animateCounting);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 1000); // 保持消失动画时间
    }, duration);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [amount, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`custom-reward-message ${isVisible ? '' : 'custom-reward-message-leave'}`} style={{top: `${10 + index * 5}%`}}>
      <div className="light-beam"></div>
      <div className="reward-message">
        <img src={icon} alt="Reward" className="reward-icon"/>
        <span className="reward-amount">+{currentAmount}</span>
        {children && <div className="reward-details">{children}</div>}
      </div>
    </div>
  );
};

let rewardContainer: HTMLDivElement | null = null;
let notificationIndex = 0;

export const showReward = (amount: number, icon?: string, duration?: number, children?: React.ReactNode) => {
  if (!rewardContainer) {
    rewardContainer = document.createElement('div');
    rewardContainer.className = 'reward-container';
    document.body.appendChild(rewardContainer);
  }

  const notificationId = notificationIndex++;
  const notificationElement = document.createElement('div');
  notificationElement.style.position = 'relative';
  notificationElement.style.zIndex = `${9999 - notificationId}`; // 确保新的通知在前面
  rewardContainer.insertBefore(notificationElement, rewardContainer.firstChild);

  const closeNotification = () => {
    if (notificationElement && notificationElement.parentNode) {
      ReactDOM.unmountComponentAtNode(notificationElement);
      notificationElement.parentNode.removeChild(notificationElement);
    }
  };

  ReactDOM.render(
    <RewardNotification 
      amount={amount} 
      icon={icon} 
      duration={duration} 
      onClose={closeNotification}
      index={notificationId}
    >
      {children}
    </RewardNotification>,
    notificationElement
  );
};

export default RewardNotification;