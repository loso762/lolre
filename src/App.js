import './App.css';
import 'animate.css';
import First from './page/First';
import Sub from './page/Sub';
import { useState } from 'react';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import { whatSearch } from './context/whatSearch';

function App() {

  const [user, setUser] = useState("");
  const [champ, setChamp] = useState("Akali");
  const [users,setUsers] = useState([]);
  const [num, setnum] = useState(0);
  const APIKEY = "RGAPI-5401cc17-af17-4808-bfc6-d3631f3b8b4d"
  const MatchNum = 5;
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <whatSearch.Provider value={{ user,setUser,champ,setChamp,APIKEY,MatchNum,users,setUsers,num,setnum } }>
        <div className="App">
          <Routes>
            <Route path="/" element={<First />} />
            <Route path="/sub/*" element={<Sub/>} />
          </Routes>
        </div>
      </whatSearch.Provider>
    </BrowserRouter>
  );
}

export default App;
