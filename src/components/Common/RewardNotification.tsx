import React from 'react';
import { message } from 'antd';
import goldIcon from '../../assets/icons/gold_icon.png';
import './RewardNotification.less';

interface RewardNotificationProps {
  amount: number;
  icon?: string;
  duration?: number;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({ 
  amount, 
  icon = goldIcon, 
  duration = 2 
}) => {
  const content = (
    <div className="reward-message">
      <img src={icon} alt="Reward" className="reward-icon"/>
      <span className="reward-amount">+{amount}</span>
    </div>
  );

  return (
    <>{content}</>
  );
};

export const showReward = (amount: number, icon?: string, duration?: number) => {
  message.success({
    content: <RewardNotification amount={amount} icon={icon} />,
    className: 'custom-reward-message',
    duration: duration || 2,
  });
};

export default RewardNotification;