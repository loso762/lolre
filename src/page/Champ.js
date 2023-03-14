import React, { useContext, useEffect, useRef, useState } from "react";
import '../scss/champ.scss';
import TopHeadChamp from '../component/TopHeadChamp';
import { LolContext } from "../store/lol-context";
import championData from "../json/champion.json"
import axios from 'axios';
import '../scss/champ.scss'


function Champ() {

  const { champ, setChamp, num, setnum } = useContext(LolContext);
  const [champInfo, setChampInfo] = useState();

  const [skinNum, setskinNum] = useState(0);
  const [skinKey, setskinKey] = useState(0);
  const [skinName, setskinName] = useState("");
  const [onskins, setOnskins] = useState(false);

  const champTypeRef = useRef([]);
  const [clickType, setclickType] = useState([]);
  const ChampionTypeList = [
    { en: "Assassin", ko: "암살자" }, { en: "Fighter", ko: "전사" }, { en: "Mage", ko: "마법사" }, { en: "Marksman", ko: "원거리딜러" }, { en: "Support", ko: "서포터" }, { en: "Tank", ko: "탱커" }
  ];


  useEffect(() => {

    axios.get(`../json/champion/${champ}.json`)
      .then((s) => {
        setChampInfo(s.data.data[champ]);
    })

    champTypeRef[num].classList.remove("active");
    setclickType(championData.filter((champ) => champTypeRef[num].classList.value === champ.tags[0]));
    setskinNum(0);
    setOnskins(false);
    champTypeRef[num].classList.add("active");

  }, [champ])


  useEffect(() => {
    setskinNum(champInfo?.skins[skinKey].num);
    setskinName(champInfo?.skins[skinKey].name);
  },[skinKey])

  const clickList = (type,key) => {
    
    //챔피언 타입 클릭하면 그 타입의 첫번째 챔피언 불러오기
    setChamp((championData.filter((c) => type === c.tags[0]))[0].id);
    champTypeRef[num].classList.remove("active");

    setnum(key);

    setskinNum(0);
    setOnskins(false);
  }

  const clickChamp = (e, id) => {
    e.stopPropagation();
    setChamp(id);
  }

  const onSkinClick  = (champ,idx)=>{
    setskinNum(champ.num); 
    setskinName(champ.name); 
    setskinKey(idx);
  }

  return (
    <>
      <TopHeadChamp setnum={setnum} setclickType={setclickType} num={num} champTypeRef={champTypeRef}/>
      <section className="selectChamp">
        <ul className="typeChamp animate__animated animate__fadeIn">
          {
            ChampionTypeList.map((type, idx) => {
              return <li className={type.en} onClick={() => clickList(type.en, idx)} ref={e => champTypeRef[idx] = e} key={idx} >{type.ko}</li>     
            })
          }
        </ul>
        <ul className="champList animate__animated animate__fadeIn">
          {
            clickType.map((c,key) => {
              return <li key={key} className={ champ === c.id ? "active" : ""} onClick={(e) => clickChamp(e, c.id)}>{c.name}</li>
            })
          }
        </ul>
    </section>

    <main className="Info">
        <h2>챔피언 정보</h2>
        <section className="champInfo animate__animated animate__fadeInUp">
        {
          champInfo && <a href={`https://namu.wiki/w/${champInfo.name}`} target="_blank" className="wikilink">자세히</a>
        }
        {
          champInfo && (
            <>
                <article className="mainInfo">
                  
                  <figure>
                    <img src={`../img/champ2/${champInfo.id}_0.jpg`} alt="" onClick={() => setOnskins(!onskins)} />
                    <p className="name">{champInfo.name}, {champInfo.title}</p> 
                    <div className={onskins ? "skins active" : "skins"}>
                      <a href="https://www.youtube.com/channel/UCCMQyaKDjQJY79VimTdaYYQ" target="_blank" className="ULink" rel="noreferrer">관련 유튜브</a>
                      {
                        (champInfo.skins).map((c, key) => {
                          if (c.num !== 0) {
                            return (
                              <div key={key}>
                                <img
                                  id={c.num}
                                  src={`../img/champ2/${champInfo.id}_${c.num}.jpg`} alt=""
                                  onClick={() => { onSkinClick(c,key) }}
                                />
                                <p id={c.name}>{c.name}</p>
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                    <figcaption className={onskins ? "active" : ""}>{champInfo.blurb}</figcaption>
                    <span> { onskins ? "스킨접기" : "스킨보기" } </span>
                  </figure>

                  {
                  skinNum > 0 && (
                    <div className="popup">
                      <button onClick={() => setskinNum(0)}>✖️</button>
                      
                      <span
                        className="left material-symbols-outlined"
                        onClick={() => { skinKey > 1 && setskinKey(skinKey - 1)}}
                      >chevron_left</span>
                      
                      <span
                        className="right material-symbols-outlined"
                        onClick={() => { skinKey < champInfo.skins.length - 1 && setskinKey(skinKey + 1) }}
                      >chevron_right</span>
                        
                      <img src={`../img/champ2/${champInfo.id}_${skinNum}.jpg`} alt="" /> 
                      <p>{skinName}</p>
                    </div>
                  )}

                  <p className="type">타입 : {champInfo.partype}</p>

                  <div className="tags">
                    <figure>                      
                      <p>주역할군</p>
                      <img src={`../img/role/${champInfo.tags[0]}.png`} alt="" title={`${champInfo.tags[0]}`} />
                      <figcaption>{(ChampionTypeList.find(type => type.en == [champInfo.tags[0]])).ko}</figcaption>
                    </figure>
                    <figure>               
                      <p>부역할군</p>
                      <img src={`../img/role/${champInfo.tags[1]}.png`} alt="" title={`${champInfo.tags[1]}`} />
                      <figcaption>{(ChampionTypeList.find(type => type.en == [champInfo.tags[1]]))?.ko}</figcaption>
                    </figure>
                  </div>

                </article>
                
              <article className="stats">
                  <h3>챔피언 스탯</h3>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Health.png" alt=""></img>
                      <figcaption>HP</figcaption>
                    </figure>
                    {champInfo.stats.hp} (+{champInfo.stats.hpperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Mp.png" alt=""></img>
                      <figcaption>MP</figcaption>
                    </figure>{champInfo.stats.mp} (+{champInfo.stats.mpperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Attack.png" alt=""></img>
                      <figcaption>공격력</figcaption>
                    </figure>{champInfo.stats.attackdamage} (+{champInfo.stats.attackdamageperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Armor.png" alt=""></img>
                      <figcaption>방어력</figcaption>
                    </figure>{champInfo.stats.armor} (+{champInfo.stats.armorperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/MagicResist.png" alt=""></img>
                      <figcaption>마법저항력</figcaption>
                    </figure>{champInfo.stats.spellblock} (+{champInfo.stats.spellblockperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Ats.png" alt=""/>
                      <figcaption>공격속도</figcaption>
                    </figure>{champInfo.stats.attackspeed} (+{champInfo.stats.attackspeedperlevel})
                  </div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Speed.png" alt=""/>
                      <figcaption>이동속도</figcaption>
                    </figure>{champInfo.stats.movespeed}</div>
                  <div>
                    <figure>
                      <img src="../img/StatMods/Range.png" alt=""/>
                      <figcaption>사거리</figcaption>
                    </figure>{champInfo.stats.attackrange}</div>
                  
                </article>
                
              <article className="info">
                  <h3>챔피언 정보</h3>
                  {
                    Object.entries(champInfo.info).map((entrie,idx) => {
                      return <div key={idx}>
                              <p>{entrie[0]}</p>
                              <div>
                                <span style={{ width: `${entrie[1] * 20}px` }}>
                                </span>
                                <p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>
                              </div>
                            </div>
                    })
                  }
                </article>
                
              <article className="spells">
                  <h3>스킬</h3>
                  <div className="passive">
                    <h4>{champInfo.passive.name} (Passive)</h4>
                    <figure>
                      <img src={`../img/passive/${champInfo.passive.image.full}`} alt=""/>
                      <p dangerouslySetInnerHTML={{__html:champInfo.passive.description}}></p>
                    </figure>
                  </div>
                  {
                    champInfo.spells.map((c,idx) => {
                      return (
                        <div className="spellBox" key = {idx} >
                          <h4>{c.name} ({["Q","W","E","R"][idx]})</h4>
                          <figure>
                            <img src={`../img/spell/${c.image.full}`} alt=""/>
                            <figcaption dangerouslySetInnerHTML={{__html:c.description}}></figcaption>
                          </figure>
                          <div>
                            <p>재사용 대기시간 : {c.cooldownBurn}</p>
                            <p>마나 소모량 : {c.costBurn}</p>
                            <p>사거리 : {c.rangeBurn}</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </article>
                
              <article className="tips">
                  <p>TIP</p>
                {
                    champInfo.allytips.map((tip,k) => {
                      return <span key={k}>{k+1}. {tip}</span>
                  })
                }
                  <p>상대 TIP</p>
                {
                    champInfo.enemytips.map((enemytip,k) => {
                      return <span key={k}>{k+1}. {enemytip}</span>
                  })
                }
              </article>
            </>
          )
        }
        </section>
    </main>
    </>
  );
}

export default Champ;