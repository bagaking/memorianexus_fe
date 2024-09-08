import React, { useEffect, useState, useRef, useCallback } from 'react';
import CDNImage from '../Common/CDNImage';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById, getDungeonDetail, PracticeResultResponse, PracticeResultEnum } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { DungeonMonster, Item, DungeonMonsterWithResult, parseUint64 } from '../../api';
import { showReward } from '../Common/RewardNotification';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';
import { useUserPoints } from "../../context/UserPointsContext";
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useIsMobile } from '../../hooks/useWindowSize';
import MonsterCarousel, { MonsterCarouselRef } from './MonsterCarousel';
import './CampaignChallenge.less';
import RecordButton from '../Common/RecordButton';

const PRELOAD_COUNT = 10;

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonsterWithResult[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const carouselRef = useRef<MonsterCarouselRef>(null);
    const [itemDetails, setItemDetails] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const { updatePoints } = useUserPoints();
    const [campaignName, setCampaignName] = useState('');
    const { contentRef, AnimatedTitle } = useScrollAnimation(loading, {
        animationDuration: 2000,
        flashCount: 4,
        flashDuration: 300
    });
    const isMobile = useIsMobile();

    const handleCardChange = useCallback((newIndex: number) => {
        console.log(`Card changed to index ${newIndex}`);
    }, []);

    const fetchCampaignName = useCallback(async () => {
        try {
            const response = await getDungeonDetail(id!);
            setCampaignName(response.data.data.title);
        } catch (error) {
            console.error('Failed to fetch campaign name:', error);
        }
    }, [id]);

    const fetchMonstersAndDetails = useCallback(async (count: number = 10) => {
        try {
            const response = await getPracticeMonsters(id!, count);
            const monstersData = response.data.data;

            const detailsPromises = monstersData.map((monster: DungeonMonster) =>
                getItemById(monster.item_id)
            );

            const detailsResponses = await Promise.all(detailsPromises);
            const details = detailsResponses.map(res => res.data.data);

            return { monsters: monstersData, itemDetails: details };
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch monsters');
            return null;
        }
    }, [id]);

    const initializeMonsters = useCallback(async () => {
        const data = await fetchMonstersAndDetails();
        if (data) {
            setMonsters(data.monsters);
            setItemDetails(data.itemDetails);
            setCurrentMonsterIndex(0);
            setLoading(false);
        }
    }, [fetchMonstersAndDetails]);

    useEffect(() => {
        fetchCampaignName();
        initializeMonsters();
    }, [fetchCampaignName, initializeMonsters]);

    const handleNeedMoreData = useCallback(async () => {
        const newData = await fetchMonstersAndDetails(PRELOAD_COUNT); // 获取PRELOAD_COUNT个新怪物
        if (newData) {
            setMonsters(prevMonsters => [...prevMonsters, ...newData.monsters]);
            setItemDetails(prevDetails => [...prevDetails, ...newData.itemDetails]);
        }
    }, [fetchMonstersAndDetails]);

    const handleAttackResult = useCallback(async (result: PracticeResultEnum) => {
        try {
            const submitResult = await submitPracticeResult(id!, {
                monster_id: monsters[currentMonsterIndex].item_id,
                result: result,
            });

            const respData = submitResult.data;

            if (respData && respData.points_update) {
                updatePoints(respData.points_update);
                await showReward(parseUint64(respData.points_update.cash));
                
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

                if (carouselRef.current) {
                    carouselRef.current.moveToNextCard(updatedMonsters, itemDetails);
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to submit attack result');
        }
    }, [currentMonsterIndex, id, monsters, updatePoints, itemDetails]);

    const handleAudioStop = useCallback((audioBlob: Blob) => {
        console.log('录音结束，音频数据:', audioBlob);
        // 这里可以将音频数据上传到服务器或进行其他处理
    }, []);

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
            icon="/layout/campaign_dungeon_icon.png"
            enableShrink={true}
            fullWidthContent={true}
        >
            <div className="campaign-challenge-container">
                <CDNImage className="campaign-challenge-background" src="/battlefield/battlefield_01.png" alt="战场背景"/>
                <div className="campaign-challenge-content" ref={contentRef}>
                    <MonsterCarousel
                        monsters={monsters}
                        itemDetails={itemDetails}
                        currentMonsterIndex={currentMonsterIndex}
                        setCurrentMonsterIndex={setCurrentMonsterIndex}
                        onCardChange={handleCardChange}
                        onNeedMoreData={handleNeedMoreData}
                        ref={carouselRef}
                    />
                    <div className="skills-and-record-container">
                        <div className={`skills-container ${isMobile ? 'mobile' : ''}`}>
                            {skillCards.map((card, index) => (
                                <SkillCard
                                    key={index}
                                    icon={card.icon}
                                    onClick={() => handleAttackResult(card.resultType as PracticeResultEnum)}
                                    resultType={card.resultType}
                                    title={card.title}
                                    backgroundImage={card.backgroundImage}
                                />
                            ))}
                        </div>
                        <div className="record-button-container">
                            <RecordButton 
                                onRecord={(isRecording) => console.log(`Recording: ${isRecording}`)} 
                                onAudioStop={handleAudioStop} 
                                position={isMobile ? "bottom" : "right"}
                                shape={isMobile ? "circle" : "rounded"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default React.memo(CampaignChallenge);