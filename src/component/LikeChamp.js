import React from "react";

const LikeChamp = ({ TChamp, championData,champClick }) => {

    return (
        <ul className="likeChamp">
            <div className="top">
                <p>주 챔피언</p>
                <p>챔피언포인트</p>
                <p>최근플레이</p>
            </div>
                    {
                        TChamp[0] && TChamp.map((t, k) => {
                            return(
                                championData.map((cd) => {
                                    if (t.championId == cd.key) {
                                        let now = new Date(),
                                            endTime = new Date(t.lastPlayTime),
                                            EndPlay = "";
                                        let lasttime = Math.ceil((now - endTime) / 1000 / 60);

                                        if (lasttime >= 1440) {
                                            EndPlay = `${Math.floor(lasttime / 60 / 24)}일 전`
                                        } else if (lasttime >= 60 && lasttime < 1440) {
                                            EndPlay = `${(Math.floor(lasttime / 60)) % 24}시간 전`
                                        } else { EndPlay = `${lasttime % 60}분 전` }

                                        return (
                                            <li key={k}>
                                                <img src={`../img/champion/${cd.id}.png`} alt='' onClick={() => champClick(cd.id)}/>
                                                <h4 onClick={() => champClick(cd.id)}>{cd.name}</h4>
                                                <p>{t.championPoints}</p>
                                                <p>{EndPlay}</p>
                                            </li>
                                        )
                                    }
                                })
                            )
                        })
                    }
        </ul>
    )
};

export default LikeChamp;
