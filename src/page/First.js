import React,{ useRef , useContext, useState, useEffect } from "react";
import { matchPath, useNavigate  } from "react-router-dom";
import { whatSearch } from "../context/whatSearch";
import '../scss/first.scss';

function First() {
    const navigate = useNavigate();
    const SearchBtn = useRef();
    const SearchName = useRef();
    const [Slist, setSlist] = useState(false);
    let tempUsers = [];


    let {setUser,users,setUsers} = useContext(whatSearch);

    useEffect(() => {
        const findSearch = JSON.parse(localStorage.getItem("user"));
        if (findSearch !== null) {
            setUsers(findSearch) //전에 있던 items 유지
        }
    }, []);
    
    const clickbtn = () => {
        if (SearchName.current.value == "") {
            alert("찾으시는 소환사를 정확히 입력해주세요!")
        } else {
            tempUsers = users;
            tempUsers.unshift({ id: Date.now(), name: SearchName.current.value });
            console.log(tempUsers.slice(0, 4));
            savesearch();
            setUsers(tempUsers.slice(0, 4));
            search(SearchName.current.value);
        }
    };

    const deleteList = (e) => {
        console.log(e.target.parentElement);
        const li = e.target.parentElement;
        setUsers(users.filter((users) => users.id != parseInt(li.id)));
        savesearch();
    };

    const search = (t) => {
        setUser(t);
        SearchName.current.value = "";
        navigate("/sub/Search");
    };
    
    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            clickbtn();
        }
    };

    function savesearch() { 
        typeof(Storage) !== 'undefined' && localStorage.setItem("user", JSON.stringify(tempUsers.slice(0,4)));
    };
    
    return (
        <section className="Homesearch" style={{background:"url('../img/bg.webp') center / cover"}}>
            <div className="wrapper">
                <h1 data-heading="LOLCORD">LOLCORD</h1>
            </div>
            <div className="searchwrapper animate__animated animate__fadeInUp" onClick={() => setSlist(!Slist)}>
                <input type="text" ref={SearchName} placeholder="소환사명을 입력해주세요" className="inputID" onKeyDown={onKeyPress}/>
                <button className="inputIDBtn" value="" ref={SearchBtn} onClick={() => clickbtn()}/>
                {
                    Slist && (<div className="search-inner animate__animated animate__fadeIn">
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
            {/* <img src="../img/bg3.png"></img> */}
        </section>
    );
}


export default First;