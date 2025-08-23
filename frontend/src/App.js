import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signup2 from './components/Signup2';
import TakeVideo from './components/TakeVideo';
import AsgInfo from './components/AsgInfo';
import LessonsLibrary from './components/LessonsLibrary';
import Leaderboard from './components/Leaderboard';
import HomePage from './components/HomePage';
import RedeemCoupon from './components/RedeemCoupon';
import HomeAdmin from './components/HomeAdmin';
import Profile from './components/Profile';
import SpeechLesson from './components/SpeechLesson';
import AsgGraded from './components/AsgGraded';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/LessonsLibrary" element={<LessonsLibrary />}/>
          <Route path="/AsgUpVideo" element={<AsgInfo status="video" />}/>
          <Route path="/AsgUp" element={<AsgInfo status="upload" />}/>
          <Route path="/AsgGrade" element={<AsgInfo status="graded" />}/>
          <Route path="/TakeVideo" element={<TakeVideo />} />
          <Route path="/" element={<Signup />} />
          <Route path="/signup2" element={<Signup2 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/RedeemCoupon" element={<RedeemCoupon />}/>
          <Route path="/HomePage" element={<HomePage />}/>
          <Route path="/HomeAdmin" element={<HomeAdmin />}/>
          <Route path="/SpeechLesson" element={<SpeechLesson />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/AsgGraded" element={<AsgGraded />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
