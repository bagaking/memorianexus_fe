import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { DungeonMonster, Item, ParsePercentage } from '../Basic/dto';
import { showReward } from '../Common/RewardNotification';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';
import MonsterPortrait from './MonsterPortrait';
import MonsterHealthBar from './MonsterHealthBar';
import { useUserPoints } from "../../context/UserPointsContext";
import './CampaignChallenge.less';

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonster[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const [itemDetails, setItemDetails] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const { refreshPoints } = useUserPoints();
    const [showFullContent, setShowFullContent] = useState(false);

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

            if(!!resp && !!resp.points_update && resp.points_update.cash) {
                showReward(resp.points_update.cash);
                refreshPoints(resp.points_update)
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

    return (
        <PageLayout title="Campaign Challenge" backUrl={`/campaigns`} icon="/campaign_dungeon_icon.png">
            <div className="campaign-challenge-container">
                <div className="campaign-challenge-content">
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
                            <TaggedMarkdown>{currentItemDetail?.content || ''}</TaggedMarkdown>
                        </div>
                    </div>
                    <div className="skills-container">
                        <SkillCard
                            icon={<CloseCircleOutlined/>}
                            onClick={() => handleAttackResult("defeat")}
                            resultType="defeat"
                            title="Defeat"
                            backgroundImage="/skill-backgrounds/defeat.jpg"
                        />
                        <SkillCard
                            icon={<StopOutlined/>}
                            onClick={() => handleAttackResult("miss")}
                            resultType="miss"
                            title="Miss"
                            backgroundImage="/skill-backgrounds/miss.jpg"
                        />
                        <SkillCard
                            icon={<CheckCircleOutlined/>}
                            onClick={() => handleAttackResult("hit")}
                            resultType="hit"
                            title="Hit"
                            backgroundImage="/skill-backgrounds/hit.jpg"
                        />
                        <SkillCard
                            icon={<FireOutlined/>}
                            onClick={() => handleAttackResult("kill")}
                            resultType="kill"
                            title="Kill"
                            backgroundImage="/skill-backgrounds/kill.jpg"
                        />
                        <SkillCard
                            icon={<TrophyOutlined/>}
                            onClick={() => handleAttackResult("complete")}
                            resultType="complete"
                            title="Complete"
                            backgroundImage="/skill-backgrounds/complete.jpg"
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CampaignChallenge;