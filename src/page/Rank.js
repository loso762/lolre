import React from "react";
import '../scss/rank.scss';
import axios from 'axios';
import { useContext , useEffect , useState , useRef } from "react";
import { LolContext } from "../store/lol-context";
import { useNavigate  } from "react-router-dom";
import TopHead from '../component/TopHead';
import AOS from "aos";
import "aos/dist/aos.css";

function Rank() {

  useEffect(() => {AOS.init();})

  const { setUser, APIKEY } = useContext(LolContext);
  const [whatleauge, setWhatleague] = useState("challengerleagues");
  const [whatleauge2, setWhatleague2] = useState("");
  const [leagueNum, setleagueNum] = useState("");

  const [whatDivi, setwhatDivi] = useState("I");
  const [divisionNum, setdivisionNum] = useState(-1);

  const [ranker, setRanker] = useState([]);
  const navigate = useNavigate();
  
  const isMounted = useRef(false);
  const isMounted2 = useRef(false);

  const leaguesArr = [["challengerleagues", "챌린저"], ["grandmasterleagues", "그랜드 마스터"], ["masterleagues", "마스터"], ["DIAMOND", "다이아"], ["PLATINUM", "플래티넘"], ["GOLD", "골드"], ["SILVER", "실버"], ["BRONZE", "브론즈"]];
  
  const divisionArr = ["I", "II", "III", "IV"];

  useEffect(() => {
      axios.get(`https://kr.api.riotgames.com/lol/league/v4/${whatleauge}/by-queue/RANKED_SOLO_5x5?api_key=${APIKEY}`)
        .then((m) => {
          (m.data.entries).sort(function (a, b) { return b.leaguePoints - a.leaguePoints });
          setRanker((m.data.entries).slice(0, 100));
        })
  },[whatleauge])

  useEffect(() => {
    if(isMounted.current){
      axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${whatleauge2}/I?page=1&api_key=${APIKEY}`)
            .then((m) => { 
              (m.data).sort(function (a, b) { return b.leaguePoints - a.leaguePoints });
              setRanker((m.data).slice(0, 100));
            }).catch();
    } else {
      isMounted.current = true;
    }
  },[whatleauge2])


  useEffect(() => {
    if(isMounted2.current){
      axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${whatleauge2}/${whatDivi}?page=1&api_key=${APIKEY}`)
      .then((m) => { 
        (m.data).sort(function (a, b) { return b.leaguePoints - a.leaguePoints });
        setRanker((m.data).slice(0, 100));
      }).catch();
    } else {
      isMounted2.current = true;
    }
  }, [whatDivi])
  
  const RankerSearch = (name) => {
    setUser(name);
    navigate("/sub/Search");
  }

  const fetch1 = (e,key) => {
    setWhatleague(e.target.id);
    setdivisionNum(-1);
    setleagueNum(key);
  }

  const fetch2 = (e,key) => {
    setWhatleague2(e.target.id);
    setwhatDivi("I");
    setdivisionNum(0);
    setleagueNum(key);
  }

  const fetch3 = (e,num) => {
    setwhatDivi(e.target.id);
    setdivisionNum(num);
  }

  return (
    <>      
      <TopHead num={0} />
      <main className="Ranking animate__animated animate__fadeIn">

        <h2>유저 랭킹</h2>

        <ul className="leagues">
          {
            leaguesArr.map((league,key)=>{
              return key < 3
                ? <li key={key} id={league[0]} className={(key === leagueNum) ? "active" : ""}  onClick={(e) => { fetch1(e,key) }} > {league[1]} </li>
                : <li key={key} id={league[0]} className={(key === leagueNum) ? "active" : ""}  onClick={(e) => { fetch2(e,key) }} > {league[1]} </li>
            })
          }
        </ul>

        <ul className={ (divisionNum === -1) ? "division" : "division active"}>
          {
            divisionArr.map((division, key) => {
              return  <li key={key} className={(key === divisionNum) ? "active" : ""} id={division} onClick={(e) => { fetch3(e, key) }}>
                        {division}
                      </li>
            })
          }
        </ul>

        <ul className="rankers">
          <li className="topItem"><p>순위</p><p> 소환사</p><p>LP</p><p>승패</p><p>승률</p></li>
          {
            ranker.map((r,key) => {
              return (
                <li key={key}>
                  <p className="rank">{ key+1 }</p>
                  <p className="rankerName" onClick={()=>RankerSearch(r.summonerName)}>{r.summonerName}</p>
                  <p className="LP">{r.leaguePoints}</p>
                  <div className="winlose">
                    <p className="win" style={{width:`${(r.wins/(r.wins+r.losses)*100).toFixed(0)}%`}}>{r.wins}W</p>
                    <p className="lose" style={{width:`${100-(r.wins/(r.wins+r.losses)*100).toFixed(0)}%`}}>{r.losses}L</p>
                  </div>
                  <p className="Odds">{(r.wins/(r.wins+r.losses)*100).toFixed(0)}%</p>
                </li>
              )
            })
          }
        </ul>
      </main>
    </>
  );
}

export default Rank;