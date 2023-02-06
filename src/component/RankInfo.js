import React from "react";
import '../scss/search.scss';

const RankInfo = ({ whatrank, rank }) => {
    return (
        <div className="RankInfo">
            <figure>
                <figcaption>{ whatrank }</figcaption>
                <img src={`../img/rank/${rank.tier}.png`} alt=""/>
            </figure>
            <ul>
                <li>TIER : {rank.tier} {rank.rank}</li>
                <li>LP : {rank.LP}</li>
                <li>전적 : {rank.win}승 {rank.lose}패 ( {rank.rate}% )</li>
            </ul>
        </div>
    )
};

export default RankInfo;
