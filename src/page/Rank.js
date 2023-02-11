import React from "react";
import '../scss/rank.scss';
import axios from 'axios';
import { useContext , useEffect , useState , useRef } from "react";
import { whatSearch } from "../context/whatSearch";
import { useNavigate  } from "react-router-dom";
import TopHead from '../component/TopHead';
import AOS from "aos";
import "aos/dist/aos.css";

function Rank() {

  useEffect(() => {AOS.init();})

  const { setUser, APIKEY } = useContext(whatSearch);
  const [whatleauge, setWl] = useState("challengerleagues");
  const [whatleauge2, setWl2] = useState("");
  const [whatDivi, setwhatDivi] = useState("I");
  const onDivision = useRef();
  const [ranker, setRanker] = useState([]);
  const navigate = useNavigate();
  const divi = useRef([]);
  const league = useRef([]);
  const isMounted = useRef(false);
  const isMounted2 = useRef(false);

  useEffect(() => {
    league.current[0].classList.add("active");
  }, [])
  
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

  const fetch1 = (e) => {
    onDivision.current.classList.remove("active");
    setWl(e.target.className);
    
    league.current.forEach(l => l.classList.remove("active"))
    e.target.classList.add("active");
  }

  const fetch2 = (e) => {
    onDivision.current.classList.add("active");
    setWl2(e.target.className);
    setwhatDivi("I");
    divi.current.forEach(d => d.classList.remove("active") )
    divi.current[0].classList.add("active");

    league.current.forEach(l => l.classList.remove("active"))
    e.target.classList.add("active");
  }

  const fetch3 = (e) => {
    setwhatDivi(e.target.className);
    divi.current.forEach(d => d.classList.remove("active") )
    e.target.classList.add("active");
  }

  const leaguesArr = [["challengerleagues", "챌린저"], ["grandmasterleagues", "그랜드 마스터"], ["masterleagues", "마스터"], ["DIAMOND", "다이아"], ["PLATINUM", "플래티넘"], ["GOLD", "골드"], ["SILVER", "실버"], ["BRONZE", "브론즈"]];
    
  const divisionArr = ["I", "II", "III", "IV"];

  return (
    <>      
      <TopHead num={0} />
      <main className="Ranking animate__animated animate__fadeIn">
        <h2>유저 랭킹</h2>
        <ul className="leagues">
          {
            leaguesArr.map((l,key)=>{
              return key < 3
                ? <li key={key} className={l[0]} onClick={(e) => { fetch1(e) }} ref={e => league.current[key] = e}>{l[1]}</li>
                :  <li key={key} className={l[0]} onClick={(e) => { fetch2(e) }} ref={e => league.current[key] = e}>{l[1]}</li>
            })
          }
        </ul>
        <ul className="division" ref={onDivision}>
          {
            divisionArr.map((d,key)=>{
              return <li key={key} className={d} onClick={(e) => { fetch3(e) }} ref={e => divi.current[key] = e}>{d}</li>
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