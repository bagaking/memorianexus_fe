import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message, Card, Progress, Button } from 'antd';
import { getPracticeMonsters, submitPracticeResult, getItemById } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import {DungeonMonster, Item, ParsePercentage} from '../Basic/dto';
import '../Common/CommonStyles.css';
import './CampaignChallenge.css';
import Markdown from 'react-markdown';
import { CloseCircleOutlined, StopOutlined, CheckCircleOutlined, FireOutlined, TrophyOutlined } from '@ant-design/icons';
import SkillCard from './SkillCard';
import goldIcon from '../../assets/icons/gold_icon.png';
import {useUserPoints} from "../../context/UserPointsContext";

const CampaignChallenge: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonster[]>([]);
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const [itemDetails, setItemDetails] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFullContent, setShowFullContent] = useState(false);
    const { refreshPoints } = useUserPoints();


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

    const handleAttackResult = async (result: "defeat" | "miss" | "hit" | "kill" | "complete") => {
        try {
            const submitResult = await submitPracticeResult(id!, {
                monster_id: monsters[currentMonsterIndex].item_id,
                result: result,
            });

            const resp = submitResult.data.data

            if(!!resp && !!resp.points_update && resp.points_update.cash) {
                message.success(<div>
                    <img src={goldIcon} alt="Cash" className="point-icon"/> + {resp.points_update.cash}
                </div>, 5);
                refreshPoints(resp.points_update)
            }

            if (currentMonsterIndex < monsters.length - 1) {
                setCurrentMonsterIndex(currentMonsterIndex + 1);
                setShowFullContent(false);
            } else {
                fetchMonstersAndDetails()
                console.log('All monsters defeated!');
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
                <div className="campaign-detail-card">
                    {!!currentMonster ?
                        <div className="campaign-challenge-monster-detail">
                        <Card className="campaign-challenge-monster-card"
                              onClick={() => setShowFullContent(!showFullContent)}>
                            <Progress style={{marginBottom: '12px'}}
                                      percent={ParsePercentage(currentMonster.familiarity)} status="active"/>
                            {showFullContent ? (
                                <div className="campaign-challenge-monster-text-container"
                                     style={{textAlign: 'left'}}>
                                    <Markdown>
                                        {currentItemDetail?.content || ''}
                                    </Markdown>
                                </div>
                            ) : (
                                <div className="campaign-challenge-monster-image-container">
                                    <Markdown>{firstNonEmptyLine || ''}</Markdown>
                                    <img className="left-portrait" src="/portraits/skeleton_warrior_01.png"
                                         alt="Monster Avatar"/>
                                </div>
                            )}
                            {showFullContent && (
                                <Button type="primary" style={{marginTop: '20px'}} onClick={() => {
                                    setShowFullContent(false);
                                    if (currentMonsterIndex < monsters.length - 1) {
                                        setCurrentMonsterIndex(currentMonsterIndex + 1);
                                        console.log("skip to next monster", currentMonsterIndex, currentMonster, monsters);
                                    } else {
                                        console.log("cannot skip", currentMonsterIndex, currentMonster, monsters);
                                    }
                                }}>
                                    Skip & Next
                                </Button>
                            )}
                        </Card>

                        <div className="attack-buttons">
                            <div className="skill-cards-container">
                                <SkillCard
                                    icon={<CloseCircleOutlined/>}
                                    onClick={() => handleAttackResult("defeat")}
                                    resultType="defeat"
                                    title="Defeat"
                                />
                                <SkillCard
                                    icon={<StopOutlined/>}
                                    onClick={() => handleAttackResult("miss")}
                                    resultType="miss"
                                    title="Miss"
                                />
                                <SkillCard
                                    icon={<CheckCircleOutlined/>}
                                    onClick={() => handleAttackResult("hit")}
                                    resultType="hit"
                                    title="Hit"
                                />
                                <SkillCard
                                    icon={<FireOutlined/>}
                                    onClick={() => handleAttackResult("kill")}
                                    resultType="kill"
                                    title="Kill"
                                />
                                <SkillCard
                                    icon={<TrophyOutlined/>}
                                    buttonProps={{onClick: () => handleAttackResult("complete")}}
                                    onClick={() => handleAttackResult("complete")}
                                    resultType="complete"
                                    title="Complete"
                                />
                            </div>
                        </div>
                    </div>
                        : <Card title="All monsters defeated!">
                            <p>这个副本里暂时没有存活的怪物了</p>
                            <p>新的怪物稍后出现</p>
                            <p>去其他地方看看吧</p>
                        </Card>
                    }
                </div>
            </div>
        </PageLayout>
    );
};

export default CampaignChallenge;