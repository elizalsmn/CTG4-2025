import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signup2 from './components/Signup2';
import TakeVideo from './components/TakeVideo';
import AsgGraded from './components/AsgGraded'
import AsgUp from './components/AsgUp'
import AsgUpVid from './components/AsgUpVid'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/AsgUpVid" element={<AsgUpVid />}/>
          <Route path="/AsgUp" element={<AsgUp />}/>
          <Route path="/AsgGraded" element={<AsgGraded />} />
          <Route path="/TakeVideo" element={<TakeVideo />} />
          <Route path="/" element={<Signup />} />
          <Route path="/signup2" element={<Signup2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
