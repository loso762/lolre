import React from "react";
import RuneSpell from "./RuneSpell";
import itemData from "../json/item.json";
import "aos/dist/aos.css";


const MatchInfo = ({ matchInfo, searchplayer,champClick }) => {

    searchplayer.sort(function (a, b) { return b.time - a.time });
    matchInfo.sort(function (a, b) { return b.gameEndTimestamp - a.gameEndTimestamp });

    //킬관여도
    const KDV = (t, key) => {
        let totalkill = 0;
        t.participants.filter((p) => p.win == searchplayer[key].p[0].win).forEach(mm => {
            totalkill += (mm.kills)
        });
        return totalkill === 0 ? 0 : ((searchplayer[key].p[0].kills + searchplayer[key].p[0].assists) / totalkill * 100).toFixed(0) ;
    }

    //사용 아이템
    let items = [];
    searchplayer.forEach(s => {
        items.push([s.p[0].item0,s.p[0].item1,s.p[0].item2,s.p[0].item3,s.p[0].item4,s.p[0].item5,s.p[0].item6])
    });

    //매치정보
    const whatQue = (queueId) => {
        if (queueId === 420) { queueId = "솔로랭크" }
        else if (queueId === 430) { queueId = "일반게임" }
        else if (queueId === 440) { queueId = "자유랭크" }
        else if (queueId === 450) { queueId = "칼바람" }
        else{ queueId = "U.R.F." }
    
        return queueId;
    }

    // 매치종료시간
    const matchEnd = (endTimestamp) => {
        let now = new Date(), endTime = new Date(endTimestamp);
        let lasttime = Math.ceil((now - endTime) / 1000 / 60);
        if (lasttime >= 1440) {
            return `${Math.floor(lasttime / 60 / 24)}일 전`
        }else if (lasttime >= 60 && lasttime < 1440) {
            return `${(Math.floor(lasttime / 60)) % 24}시간 전`
        }
        else { return `${lasttime % 60}분 전` }
    }

    //승패여부
    const winlose = (win) => { 
        return win ? "승리" : "패배"
    }
    const wlcolor = (win) => {
        return win ? "#9dc7f4d9" : "#eea1abd8"
    }

    return (
        matchInfo.map((matchInfo, key) => {
            const SearchPlayer = searchplayer[key].p[0];
            const { gameEndTimestamp, queueId, gameDuration, participants} = matchInfo
            const { win, perks, summoner2Id, summoner1Id, teamPosition, champLevel, championName, kills, assists, deaths, totalDamageDealtToChampions, totalDamageTaken, visionWardsBoughtInGame, totalMinionsKilled } = SearchPlayer;
                return (
                    <div className="matchCon" key={key} style={{ background: `${wlcolor(win)}` }}
                        data-aos="fade-up" data-aos-duration="1000">
                        <div className="matchInfo">
                            <ul className="MI1">
                                <li>{matchEnd(gameEndTimestamp)}</li>
                                <li>{whatQue(queueId)}</li>
                                <li style={win ? {color:"blue"} :  {color:"red"}} >
                                    {winlose(win)}
                                </li>
                                <li>{Math.floor(gameDuration / 60)}분 {gameDuration % 60}초</li>
                            </ul>
                            <figure>
                                <img className="Pickchamp" src={`../img/champion/${championName}.png`} alt="" onClick={()=>champClick(championName)}/>
                                <figcaption className="champLevel">{champLevel}</figcaption>
                                <p className="lane">{teamPosition}</p>
                            </figure>
                            <ul className="MI2">
                                <li className="mySpell">
                                    <RuneSpell rs="rune" src={perks.styles[1].style}/>
                                    <RuneSpell rs="rune" src={perks.styles[0].selections[0].perk}/>
                                    <RuneSpell rs="spell" src={summoner2Id}/>
                                    <RuneSpell rs="spell" src={summoner1Id}/>
                                </li>                        
                                <li className="myKD">
                                    <p>KD : {kills} / <span>{deaths}</span> / {assists} </p>
                                    <p>킬 관여 : {KDV(matchInfo, key)}%</p>
                                    {
                                        deaths === 0 
                                        ? <p>평점 : {kills + assists} </p>
                                        : <p>평점 : {((kills + assists) / deaths).toFixed(1)} : 1</p> 
                                    }
                                </li>
                                <li className="myItem">
                                    {
                                        items[key].map((i, k) => {
                                            return (
                                                <figure key={k}>
                                                    <img src={`../img/item/${i}.png`} alt=""/>
                                                    <figcaption style={{width:`${itemData[i].name.length*12.5}px`}}>{itemData[i].name}</figcaption>
                                                </figure>
                                            )
                                        })
                                    }
                                </li>
                            </ul>
                            <ul className="MI3">
                                <li>딜량 : {totalDamageDealtToChampions}</li>
                                <li>피해량 : {totalDamageTaken}</li>
                                <li>제어와드 :{visionWardsBoughtInGame}</li>
                                <li>CS : {totalMinionsKilled} ({((totalMinionsKilled / gameDuration)*60).toFixed(1)})</li>
                            </ul>
                        </div>
                        <ul className="participantsList">
                            {
                                participants.map((p,key) => {
                                    return (
                                        <li key={key} className="participants">
                                            {p.summonerName}
                                            <img src={`../img/champion/${p.championName}.png`} alt=""  onClick={()=>champClick(p.championName)}/>
                                            <p> {p.kills} / {p.deaths} / {p.assists}</p>
                                        </li>)
                                })
                            }
                        </ul>
                    </div>
                )
            })
        
    )
};

export default MatchInfo;
