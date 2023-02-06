import React from "react";
import { useRef , useContext, useState , useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import { whatSearch } from "../context/whatSearch";

function TopHead({ num }) {
  const navigate = useNavigate();
  const SearchBtn2 = useRef();
  const SearchName2 = useRef();
  const menulist = useRef([]);
  const [Slist, setSlist] = useState(false);
  let { setUser, users, setUsers } = useContext(whatSearch);
  let menu = ["Rank", "Search", "Champ"];

  const clickbtn = () => {
    menulist.current.forEach((d) => {
      d.classList.remove("active");
    })

    menulist.current[1].classList.add("acitve");
    setUsers(([{ id: Date.now(), name: SearchName2.current.value }, ...users]).slice(0, 4));
    savesearch();
    search(SearchName2.current.value);
  }

  const search = (t) => {
    setUser(t);
    SearchName2.current.value = "";
    navigate("/sub/Search");
  }

  function savesearch() { 
    typeof(Storage) !== 'undefined' && localStorage.setItem("user", JSON.stringify(users));
  };
  
  const deleteList = (e) => {
    const li = e.target.parentElement;
    setUsers(users.filter((users) => users.id != parseInt(li.id)));
    savesearch();
  }
  
  const onKeyPress = (e) => {
      if (e.key === 'Enter') {
          clickbtn();
      }
  }

  useEffect(() => {
    const findSearch = JSON.parse(localStorage.getItem("user"));
    if (findSearch !== null) {
      setUsers(findSearch) //전에 있던 items 유지
    }
    menulist.current[num].classList.add("active")
  }, []);
  
  const TT = useRef();
    
  window.addEventListener("scroll", () => {
      if (window.scrollY <= 30 ) {
          TT.current.style = "transform:scaleY(1); opacity:1"
      } else{
          TT.current.style = "transform:scaleY(0); opacity:0"
      }
  })
  
  return (
    <header ref={TT}>
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
                  <input type="text"  ref={SearchName2} placeholder="소환사명을 입력해주세요" className="inputID" onKeyPress={(e) => onKeyPress(e)}/>
                  <button  className="inputIDBtn" ref={SearchBtn2} onClick={() => clickbtn()} />
                  {
                    Slist && (
                      <div className="search-inner">
                          <ul id="search-list">
                                  {
                                      users.map((u) => {
                                          return (
                                              <li key={u.id} id={u.id}>
                                                  <span onClick={(e) => search(u.name)}>{u.name}</span>
                                                  <button onClick={e => deleteList(e)}>X</button>
                                              </li>
                                          )
                                      })
                                  }
                      </ul>
                    </div>)
                  }
            </div>
        </section>
      </div>
      </header> 
  );
}

export default TopHead;