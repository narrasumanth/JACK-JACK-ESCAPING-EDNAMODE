import './App.css';
import Headers from './component/Headers';
import Leaderboard from './component/Leaderboard';
import Santa from './component/Santa.jsx';

function App() {
  return (
    <>
      <div className="App">
        <Headers />
        <Santa />
        <Leaderboard />
      </div>
    </>
  );
}

export default App;
