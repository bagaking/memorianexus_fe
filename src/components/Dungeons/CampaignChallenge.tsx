import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {message, Card, Progress, Button} from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { DungeonMonster, Item } from '../Common/dto';
import '../Common/CommonStyles.css';
import './CampaignChallenge.css';
import Markdown from 'react-markdown';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonster[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const [itemDetails, setItemDetails] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFullContent, setShowFullContent] = useState(false);

    useEffect(() => {
        const fetchMonstersAndDetails = async () => {
            try {
                const response = await getPracticeMonsters(id!, 15, 'classic');
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

        fetchMonstersAndDetails();
    }, [id]);

    const handleAttackResult = async (result: "defeat" | "miss" | "hit" | "kill" | "complete") => {
        try {
            await submitPracticeResult(id!, {
                monster_id: monsters[currentMonsterIndex].item_id,
                result: result,
            });
            message.success('Attack result submitted successfully');
            if (currentMonsterIndex < monsters.length - 1) {
                setCurrentMonsterIndex(currentMonsterIndex + 1);
                setShowFullContent(false);
            } else {
                message.success('All monsters defeated!');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to submit attack result');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const currentMonster = monsters[currentMonsterIndex];
    const currentItemDetail = itemDetails.find(detail => detail.id === currentMonster.item_id);

    const firstNonEmptyLine = currentItemDetail?.content.trim().split('\n').find(line => line.trim() !== '');

    return (
        <PageLayout title="Campaign Challenge" backUrl={`/campaigns`} icon="/campaign_dungeon_icon.png">
            <div className="campaign-challenge-background">
                <Card className="campaign-detail-card">
                    <div className="monster-detail">
                        <Card className="monster-card" onClick={() => setShowFullContent(!showFullContent)}>
                            {showFullContent ? (
                                <Markdown>
                                    {currentItemDetail?.content || ''}
                                </Markdown>
                            ) : (
                                <>
                                    <Markdown>{firstNonEmptyLine || ''}</Markdown>
                                    <div className="monster-image-container">
                                        <img src="/src/assets/portraits/skeleton_warrior_01.png" alt="Monster Avatar" />
                                    </div>
                                </>
                            )}
                        </Card>

                        <div className="attack-buttons">
                            <SkillCard
                                icon={<CloseCircleOutlined />}
                                buttonProps={{ onClick: () => handleAttackResult("defeat") }}
                                resultType="defeat"
                                title="Defeat"
                            />
                            <SkillCard
                                icon={<StopOutlined />}
                                buttonProps={{ onClick: () => handleAttackResult("miss") }}
                                resultType="miss"
                                title="Miss"
                            />
                            <SkillCard
                                icon={<CheckCircleOutlined />}
                                buttonProps={{ onClick: () => handleAttackResult("hit") }}
                                resultType="hit"
                                title="Hit"
                            />
                            <SkillCard
                                icon={<FireOutlined />}
                                buttonProps={{ onClick: () => handleAttackResult("kill") }}
                                resultType="kill"
                                title="Kill"
                            />
                            <SkillCard
                                icon={<TrophyOutlined />}
                                buttonProps={{ onClick: () => handleAttackResult("complete") }}
                                resultType="complete"
                                title="Complete"
                            />
                        </div>
                    </div>
                    <Progress percent={50} status="active" style={{ marginTop: '20px' }} />
                </Card>
                {showFullContent && (
                    <Button type="primary" style={{ marginTop: '20px' }} onClick={() => {
                        setShowFullContent(false);
                        if (currentMonsterIndex < monsters.length - 1) {
                            setCurrentMonsterIndex(currentMonsterIndex + 1);
                        }
                    }}>
                        Next
                    </Button>
                )}
            </div>
        </PageLayout>
    );
};

export default CampaignChallenge;