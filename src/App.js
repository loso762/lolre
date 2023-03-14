import './App.css';
import 'animate.css';
import First from './page/First';
import Sub from './page/Sub';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import LoLProvider from './store/LoLProvider';

function App() {

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <LoLProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<First />} />
            <Route path="/sub/*" element={<Sub/>} />
          </Routes>
        </div>
      </LoLProvider>
    </BrowserRouter>
  );
}

export default App;
