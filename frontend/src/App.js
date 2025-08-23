import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signup2 from './components/Signup2';
import TakeVideo from './components/TakeVideo';
import AsgInfo from './components/AsgInfo';
import LessonsLibrary from './components/LessonsLibrary';
import Leaderboard from './components/Leaderboard';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/LessonsLibrary" element={<LessonsLibrary />}/>
          <Route path="/AsgInfo" element={<AsgInfo status="video" />}/>
          <Route path="/AsgInfo" element={<AsgInfo status="upload" />}/>
          <Route path="/AsgInfo" element={<AsgInfo status="graded" />}/>
          <Route path="/TakeVideo" element={<TakeVideo />} />
          <Route path="/" element={<Signup />} />
          <Route path="/signup2" element={<Signup2 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
