import Search from './Search';
import Rank from './Rank';
import Champ from './Champ';
import GoTop from "../component/GoTop";
import '../scss/header.scss'
import { Routes, Route } from 'react-router-dom';

function Sub() {
    return (
        <div className="Sub">
            <Routes>
                <Route path="/Search" element={<Search/>}/>
                <Route path="/Rank" element={<Rank/>}/>
                <Route path="/Champ" element={<Champ/>}/>
            </Routes>
            <GoTop />
            <img className='mainbg' alt=''></img>
        </div>
    );
}

export default Sub;