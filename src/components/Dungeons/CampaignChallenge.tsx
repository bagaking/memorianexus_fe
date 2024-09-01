import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById, getDungeonDetail, PracticeResultResponse } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { DungeonMonster, Item, DungeonMonsterWithResult, ParseUint64 } from '../Basic/dto';
import { showReward } from '../Common/RewardNotification';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';
import { useUserPoints } from "../../context/UserPointsContext";
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useIsMobile } from '../../hooks/useWindowSize';
import MonsterCarousel, { MonsterCarouselRef } from './MonsterCarousel';
import './CampaignChallenge.less';
import RecordButton from '../Common/RecordButton'; // 导入录音按钮组件

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonsterWithResult[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const carouselRef = useRef<MonsterCarouselRef>(null);
    const [itemDetails, setItemDetails] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const { updatePoints } = useUserPoints();
    const [showFullContent, setShowFullContent] = useState(false);
    const [campaignName, setCampaignName] = useState('');
    const { contentRef, AnimatedTitle } = useScrollAnimation(loading, {
        animationDuration: 2000,
        flashCount: 4,
        flashDuration: 300
    });
    const isMobile = useIsMobile();

    const handleCardChange = (newIndex: number) => {
        console.log(`Card changed to index ${newIndex}`);
    };

    const handleUserAnswer = () => {
        console.log(`handleUserAnswer called, currentMonsterIndex: ${currentMonsterIndex}`);
        if (carouselRef.current) {
            carouselRef.current.moveToNextCard();
        }
    };

    const fetchCampaignName = async () => {
        try {
            const response = await getDungeonDetail(id!);
            setCampaignName(response.data.data.title);
        } catch (error) {
            console.error('Failed to fetch campaign name:', error);
        }
    };

    const fetchMonstersAndDetails = async () => {
        try {
            const response = await getPracticeMonsters(id!, 10);
            const monstersData = response.data.data;

            const detailsPromises = monstersData.map((monster: DungeonMonster) =>
                getItemById(monster.item_id)
            );

            const detailsResponses = await Promise.all(detailsPromises);
            const details = detailsResponses.map(res => res.data.data);

            setMonsters(monstersData);
            setItemDetails(details);
            setCurrentMonsterIndex(0); // 重置当前怪物索引
            setLoading(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch monsters');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaignName();
        fetchMonstersAndDetails();
    }, [id]);

    const handleAttackResult = async (result: "defeat" | "miss" | "hit" | "kill" | "complete") => {
        try {
            const submitResult = await submitPracticeResult(id!, {
                monster_id: monsters[currentMonsterIndex].item_id,
                result: result,
            });

            const respData = submitResult.data;

            console.log("respData", respData);
            if (respData && respData.points_update) {
                updatePoints(respData.points_update);
                await showReward(ParseUint64(respData.points_update.cash));
                
                // 更新当前怪物的提交结果
                const updatedMonsters = [...monsters];
                updatedMonsters[currentMonsterIndex] = {
                    ...updatedMonsters[currentMonsterIndex],
                    submitResult: {
                        familiarity: respData.updates.familiarity,
                        next_practice_at: respData.updates.next_practice_at,
                        practice_at: respData.updates.practice_at,
                        practice_count: respData.from.practice_count + 1,
                    }
                };
                setMonsters(updatedMonsters);

                // 移动到下一张卡片
                const nextIndex = (currentMonsterIndex + 1) % monsters.length;
                setCurrentMonsterIndex(nextIndex);
                setShowFullContent(false); // 重置卡片状态

                // 如果到达最后一张卡片，重新获取怪物
                if (nextIndex === 0) {
                    await fetchMonstersAndDetails();
                }

                handleUserAnswer(); // 直接调用
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to submit attack result');
        }
    };

    const toggleMonsterContent = () => {
        setShowFullContent(!showFullContent);
    };

    const handleAudioStop = (audioBlob: Blob) => {
        // 处理录音结束后的音频数据
        console.log('录音结束，音频数据:', audioBlob);
        // 这里可以将音频数据上传到服务器或进行其他处理
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const skillCards = [
        { icon: <CloseCircleOutlined/>, resultType: "defeat", title: "Defeat", backgroundImage: "/skill-backgrounds/defeat.jpg" },
        { icon: <StopOutlined/>, resultType: "miss", title: "Miss", backgroundImage: "/skill-backgrounds/miss.jpg" },
        { icon: <CheckCircleOutlined/>, resultType: "hit", title: "Hit", backgroundImage: "/skill-backgrounds/hit.jpg" },
        { icon: <FireOutlined/>, resultType: "kill", title: "Kill", backgroundImage: "/skill-backgrounds/kill.jpg" },
        { icon: <TrophyOutlined/>, resultType: "complete", title: "Complete", backgroundImage: "/skill-backgrounds/complete.jpg" },
    ];

    return (
        <PageLayout 
            title={<AnimatedTitle>{`${campaignName || "Campaign Challenge"}`}</AnimatedTitle>}
            backUrl={`/campaigns`} 
            icon="/campaign_dungeon_icon.png"
        >
            <div className="campaign-challenge-container">
                <div className="campaign-challenge-content" ref={contentRef}>
                    <MonsterCarousel
                        monsters={monsters}
                        itemDetails={itemDetails}
                        showFullContent={showFullContent}
                        toggleMonsterContent={toggleMonsterContent}
                        currentMonsterIndex={currentMonsterIndex}
                        setCurrentMonsterIndex={setCurrentMonsterIndex}
                        onCardChange={handleCardChange}
                        ref={carouselRef}
                    />
                    <div className={`skills-container ${isMobile ? 'mobile' : ''}`}>
                        {skillCards.map((card, index) => (
                            <SkillCard
                                key={index}
                                icon={card.icon}
                                onClick={() => handleAttackResult(card.resultType as any)}
                                resultType={card.resultType}
                                title={isMobile ? '' : card.title}
                                backgroundImage={card.backgroundImage}
                            />
                        ))}
                        <RecordButton 
                            onRecord={(isRecording) => console.log(`Recording: ${isRecording}`)} 
                            onAudioStop={handleAudioStop} 
                            position="right" 
                        /> {/* 添加录音按钮 */}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CampaignChallenge;