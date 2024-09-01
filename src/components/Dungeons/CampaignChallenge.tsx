import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, message } from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById, getDungeonDetail } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { DungeonMonster, Item, ParsePercentage } from '../Basic/dto';
import { showReward } from '../Common/RewardNotification';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';
import MonsterPortrait from './MonsterPortrait';
import MonsterHealthBar from './MonsterHealthBar';
import { useUserPoints } from "../../context/UserPointsContext";
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useIsMobile } from '../../hooks/useWindowSize';
import './CampaignChallenge.less';

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonster[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
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

    function getFirstNonEmptyLine(content: string = "") {
        return content.split('\n').filter(line => line.trim() !== '')[0] || ''
    }

    const handleAttackResult = async (result: "defeat" | "miss" | "hit" | "kill" | "complete") => {
        try {
            const submitResult = await submitPracticeResult(id!, {
                monster_id: monsters[currentMonsterIndex].item_id,
                result: result,
            });

            const resp = submitResult.data.data

            if(!!resp && !!resp.points_update) {
                showReward(resp.points_update.cash);
                updatePoints(resp.points_update)
            }

            if (currentMonsterIndex < monsters.length - 1) {
                setCurrentMonsterIndex(currentMonsterIndex + 1);
                setShowFullContent(false); // 重置卡片状态
            } else {
                await fetchMonstersAndDetails();
                setShowFullContent(false); // 重置卡片状态
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to submit attack result');
        }
    };

    const toggleMonsterContent = () => {
        setShowFullContent(!showFullContent);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const currentMonster = monsters[currentMonsterIndex];
    const currentItemDetail = itemDetails.find(detail => detail.id === currentMonster.item_id);

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
                    <div className={`monster-card ${showFullContent ? 'show-full-content' : ''}`} onClick={toggleMonsterContent}>
                        <div className="monster-image-container">
                            <MonsterPortrait 
                                src="/portraits/skeleton_warrior_01.png" 
                                alt="Monster Avatar" 
                            />
                            <MonsterHealthBar 
                                health={100 - ParsePercentage(currentMonster.familiarity)}
                            />
                            <h2 className="monster-title">
                                <TaggedMarkdown>{getFirstNonEmptyLine(currentItemDetail?.content)}</TaggedMarkdown>
                            </h2>
                        </div>
                        <div className="monster-content">
                            <TaggedMarkdown mode='both'>{currentItemDetail?.content || ''}</TaggedMarkdown>
                        </div>
                    </div>
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
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CampaignChallenge;