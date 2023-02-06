import '../scss/search.scss';
import { useRef , useContext , useEffect , useState} from "react";
import { useNavigate  } from "react-router-dom";
import { whatSearch } from "../context/whatSearch";
import axios from 'axios';
import championData from "../json/champion.json"
import RankInfo from '../component/RankInfo';  
import LikeChamp from '../component/LikeChamp';
import MatchInfo from '../component/MatchInfo';
import TopHead from '../component/TopHead';
import Svg from '../component/Svg';
import { CircularProgressBar } from '@tomik23/react-circular-progress-bar'

function Search() {
    const navigate = useNavigate();
    const { user, APIKEY, setChamp, setnum } = useContext(whatSearch);
    //검색 경기 수
    const MatchNum = 8;
    
    const [Searchid, setsearchId] = useState("");
    const puuid = useRef("");
    const level = useRef(0);
    const [TChamp, setTChamp] = useState([]);

    const [solo, setSolo] = useState({ rank : "",tier : "UnRanked",LP : 0,win : 0,lose : 0,rate : 0})
    const [free, setFree] = useState({ rank : "",tier : "UnRanked",LP : 0,win : 0,lose : 0,rate : 0})

    const [matchI, setmatchI] = useState([]);
    const [myplayer, setMyplayer] = useState([]);

    const [tWin, setWin] = useState(0);
    const [tLose, setLose] = useState(0);
    const [tK, setK] = useState(0);
    const [tD, setD] = useState(0);
    const [tAs, setAs] = useState(0);
    const [teamKill, setteamKill] = useState(0);
    const [position, setPosition] = useState([]);
    
    let tempWin = 0;
    let tempLose = 0;
    let tempKill = 0;
    let tempDeath = 0;
    let tempAssist = 0;
    let tempteamKills = 0;
    let tempPosition = [];
    
    const Solo0 = () => {
        setSolo({rank : "",tier : "Unranked",LP : 0,win : 0,lose : 0,rate : 0})
    }
    const Free0 = () => {
        setFree({rank : "",tier : "Unranked",LP : 0,win : 0,lose : 0,rate : 0})
    }

    const MyPosition = ["TOP", "JUNGLE", "MIDDLE", "UTILITY", "BOTTOM"];

    const champClick = (name) => {
        let whatType = (championData.filter((c) => c.id == name))[0].tags[0];

        if(whatType=="Assassin"){setnum(0)}
        else if(whatType=="Fighter"){setnum(1)}
        else if(whatType=="Mage"){setnum(2)}
        else if(whatType=="Marksman"){setnum(3)}
        else if(whatType=="Support"){setnum(4)}
        else if(whatType=="Tank"){setnum(5)}

        setChamp(name);
        navigate("/sub/Champ");
    }

    // 배열의 최빈값 구하기
    function getMode(array){
        const counts = array.reduce((pv, cv)=>{
            pv[cv] = (pv[cv] || 0) + 1;
            return pv;
        }, {});

        const keys = Object.keys(counts);
        let mode = keys[0];
        keys.forEach((val, idx)=>{
            if(counts[val] > counts[mode]){
                mode = val;
            }
        });
        return mode;
    }

    useEffect(() => {

        axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${user}?api_key=${APIKEY}`)
            .then((u) => {
                const userData = u.data;
                puuid.current = userData.puuid;
                setsearchId(userData.name);
                level.current = userData.summonerLevel;

                //최근 매치 불러오기
                axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${userData.puuid}/ids?start=0&count=${MatchNum}&api_key=${APIKEY}`)
                    .then((m) => {   
                        let tempMatch = [];
                        let tempSearchPlayer = [];

                        (m.data).forEach(m => {
                            axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${APIKEY}`)
                                .then((mm) => {
                                    const matchInfo = mm.data.info;
                                    tempMatch.push(matchInfo);
                                    tempSearchPlayer.push(
                                        { p: (matchInfo.participants).filter((m) => m.puuid == userData.puuid), time: matchInfo.gameEndTimestamp }
                                    );
                                    
                                    (matchInfo.participants).filter((m) => m.puuid == userData.puuid)[0].win ? tempWin++ : tempLose++;
                                    tempPosition.push((matchInfo.participants).filter((m) => m.puuid == userData.puuid)[0].teamPosition); 
                                    tempKill += (matchInfo.participants).filter((m) => m.puuid == userData.puuid)[0].kills;
                                    tempDeath += (matchInfo.participants).filter((m) => m.puuid == userData.puuid)[0].deaths;
                                    tempAssist += (matchInfo.participants).filter((m) => m.puuid == userData.puuid)[0].assists;

                                    let myPlayer = (matchInfo.participants).filter((m) => m.puuid == userData.puuid);
                                    (matchInfo.participants).forEach((map) => {
                                        myPlayer.forEach((myp) => {
                                            if (myp.win == map.win) {
                                                tempteamKills += map.kills;
                                            }
                                        })
                                    })

                                    if (tempMatch.length == MatchNum) {
                                        setPosition(tempPosition);
                                        setLose(tempLose); 
                                        setWin(tempWin);
                                        setK(tempKill);
                                        setD(tempDeath);
                                        setAs(tempAssist);
                                        setmatchI(tempMatch);
                                        setMyplayer(tempSearchPlayer);
                                        setteamKill(tempteamKills);
                                    }
                                })
                        });
                    });
                
                const setFreeR = (arr) => {
                    setFree({
                        tier: arr.tier,
                        rank: arr.rank,
                        LP: arr.leaguePoints,
                        win: arr.wins,
                        lose: arr.losses,
                        rate: (arr.wins / (arr.wins + arr.losses) * 100).toFixed(1)
                    })
                }

                const setSoloR = (arr) => {
                    setSolo({
                        tier: arr.tier,
                        rank: arr.rank,
                        LP: arr.leaguePoints,
                        win: arr.wins,
                        lose: arr.losses,
                        rate: (arr.wins / (arr.wins + arr.losses) * 100).toFixed(1)
                    })
                }
                
                //검색유저 랭크 불러오기
                axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userData.id}?api_key=${APIKEY}`)
                    .then((r) => {
                        const Rankdata = r.data;

                        if(Rankdata.length === 0 ) {
                            Solo0();
                            Free0();
                        }else {
                            if (Rankdata[0].queueType === "RANKED_FLEX_SR") {
                                setFreeR(Rankdata[0]);
                                Solo0();
                            } else if (Rankdata[0]?.queueType === "RANKED_SOLO_5x5") {
                                setSoloR(Rankdata[0]);
                                if (Rankdata[1].queueType === "RANKED_FLEX_SR") {
                                    setFreeR(Rankdata[1]);
                                }else{ Free0() }
                            } else if (Rankdata[0].queueType === "RANKED_TFT_DOUBLE_UP" && Rankdata[1].queueType === "RANKED_SOLO_5x5") {
                                setSoloR(Rankdata[1]);
                                if (Rankdata[2].queueType === "RANKED_FLEX_SR") {
                                    setFreeR(Rankdata[2]);
                                }else{ Free0() }
                                Free0();
                            } else if (Rankdata[0].queueType === "RANKED_TFT_DOUBLE_UP" && Rankdata[1].queueType === "RANKED_FLEX_SR") {
                                setFreeR(Rankdata[1]);
                                Solo0();
                            }
                        }
                    });
                
                //검색 유저의 주 챔피언 불러오기
                axios.get(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${userData.id}?api_key=${APIKEY}`)
                    .then((c) => {
                        let champ = c.data;
                        champ.sort(function (a, b) { return b.championPoints - a.championPoints });
                        let tempChamp = TChamp;

                        tempChamp = [];
                        for (let i = 0; i < 5; i++) {
                            tempChamp.push(champ[i])
                        }
                        setTChamp(tempChamp);
                    })
            }).catch(error => alert("소환사명을 정확히 입력해 주세요!"));
    }, [user])
    
return (
    <>
        <TopHead num={1} />
        <main className="userInfo">
            <h2>소환사 정보</h2>
            <section className="info0 animate__animated animate__fadeIn">
                <article className="userMainInfo">
                    <div className="IDLV">
                            <p className="id"> ID : {Searchid} </p>
                            <p className="level"> Level : {level.current} </p>
                    </div>
                    <CircularProgressBar percent={tWin / (tWin + tLose) * 100} colorSlice="#5383E8" colorCircle="#E84057" fontSize='1rem' size='130' speed='100' stroke='16' />
                    <div>
                        <p className="recentWL"> {tWin}승 {tLose}패</p>
                        <p className="recentKD"> {(tK/MatchNum).toFixed(1)} / {(tD/MatchNum).toFixed(1)} / {(tAs/MatchNum).toFixed(1)} </p>
                        {
                            tD == 0 ? 
                                <>
                                    <p className="recentKDP"> 1 : 1 </p>
                                    <p className="recentKDV"> 킬관여 : 0%</p>
                                </> : 
                                <>
                                    <p className="recentKDP"> {((tK + tAs) / tD).toFixed(2)} : 1 </p>
                                    <p className="recentKDV"> 킬관여 : {((tK + tAs) / teamKill * 100).toFixed(1)}%</p>
                                </>
                        }
                    </div>
                </article>
                <article className="likePosition">
                    <h4>선호 포지션 (랭크)</h4>
                    <ul>
                        {
                            MyPosition.map((Myp,key) => {
                                return (
                                    <li key={key}>
                                        <p>{Myp}</p>
                                        {
                                            getMode(position) == Myp
                                            ? <span style={{ height: "100%" }} />
                                            : <span style={{ height: "1%" }} />
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <Svg/>
                </article>
            </section>
            
            <h2>랭크 & 주 챔피언</h2>
            <section className="info1">
                <article className="RankInfoCon animate__animated animate__fadeInLeft">
                    <RankInfo whatrank="솔로랭크" rank={solo} />
                    <RankInfo whatrank="자유랭크" rank={free} />
                </article>
                {
                    <LikeChamp champClick={champClick} TChamp={TChamp} championData={championData} puuid={ puuid.current } />
                }
            </section>

            <h2>최근 매치</h2>
                <section className="info2">
                    {
                        myplayer.length == MatchNum  && <MatchInfo matchInfo={matchI} searchplayer={myplayer} champClick={champClick}/>
                    }
            </section>
        </main>

    </>
);
}

export default Search;