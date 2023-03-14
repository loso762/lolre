import LolContext from "./lol-context";

import React from 'react';
import { useState } from 'react';

const LoLProvider = (props) => {
    
    const [user, setUser] = useState("");
    const [champ, setChamp] = useState("Akali");
    const [users,setUsers] = useState([]);
    const [num, setnum] = useState(0);
    const APIKEY = "RGAPI-5401cc17-af17-4808-bfc6-d3631f3b8b4d";

    return (
        <LolContext.Provider value={{ user,setUser,champ,setChamp,APIKEY,users,setUsers,num,setnum }}>
            {props.children}
        </LolContext.Provider>
    );
};

export default LoLProvider;