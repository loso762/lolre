import React from "react";
import { useRef , useContext, useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { LolContext } from "../store/lol-context";
import championData from "../json/champion.json"

function TopHeadChamp({setclickType, num, setnum, champTypeRef}) {
  const SearchBtn3 = useRef();
  const SearchName3 = useRef();
  const menulist = useRef([]);
  const [Slist, setSlist] = useState(false);
  
  let { setChamp } = useContext(LolContext);
  let menu = ["Rank", "Search", "Champ"];

  const onSearchBtnClick = () => {
    if (championData.filter((c) => c.name == SearchName3.current.value) != ""){
      let TempChamp = (championData.filter((c) => c.name == SearchName3.current.value))[0].id;
      let whatType = (championData.filter((c) => c.name == SearchName3.current.value))[0].tags[0];

      champTypeRef[num].classList.remove("active");
      
      if(whatType==="Assassin"){setnum(0)} else if(whatType==="Fighter"){setnum(1)}
      else if(whatType==="Mage"){setnum(2)} else if(whatType==="Marksman"){setnum(3)}
      else if(whatType==="Support"){setnum(4)} else if(whatType==="Tank"){setnum(5)}

      let tempType = [];
      championData.forEach((c) => {
        if (whatType === c.tags[0]) {
          tempType.push(c)
        }
      })


      setclickType(tempType);
      setChamp(TempChamp);
    }
    SearchName3.current.value = "";
  }

  const onKeyPress = (e) => {
      if (e.key === 'Enter') {
        onSearchBtnClick();
      }
  }
  
  useEffect(() => {
    menulist.current[2].classList.add("active");
  },[])
  
  const headerRef = useRef();
  

  useEffect(() => {
    window.addEventListener("scroll", headeron);

    return () => {
      window.removeEventListener("scroll", headeron)
    }
  },[])
    
  function headeron() { 
    if (window.scrollY <= 30) {
      headerRef.current.style = "transform:scaleY(1); opacity:1"
    } else {
      headerRef.current.style = "transform:scaleY(0); opacity:0"
    }
  }
  

  return (
    <header ref={headerRef}>
      <div className="headerCon" onMouseLeave={() => setSlist(false)}>

      <nav className="menu">
          <ul className="list">
            <li className="item">
              <Link to="/" className="Home">Home</Link>
            </li>
            {
              menu.map((m,k) => {
                return (
                  <li key={k} className={m} ref={e => menulist.current[k] = e}>
                    <Link to={`/sub/${m}`}>{m}</Link>
                  </li>
              )})
            }
          </ul>
      </nav>
        
        <section className="search">
            <div className="searchwrapper" onClick={() => setSlist(!Slist)}>
              <input type="text"  ref={SearchName3} placeholder="챔피언을 입력해주세요" className="inputID" onKeyPress={(e) => onKeyPress(e)}/>
              <button  className="inputIDBtn" ref={SearchBtn3} onClick={() => onSearchBtnClick()} />
            </div>
        </section>
      </div>
    </header> 
  );
}

export default TopHeadChamp;