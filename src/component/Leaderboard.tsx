import React, { useEffect, useState } from 'react';
import './Leaderboard.css';
import {
  fetchAllTimeRanking,
  fetchLast7DaysRanking,
} from '../middleware/integration';

const Leaderboard = () => {
  const [topScores, setTopScores] = useState([]);
  const [lastWeekScores, setLastWeekScores] = useState([]);
  const [activeTab, setActiveTab] = useState('top');

  const fetchScores = async () => {
    try {
      const allTimeRanking = await fetchAllTimeRanking();
      setTopScores(allTimeRanking);

      const last7DaysRanking = await fetchLast7DaysRanking();
      setLastWeekScores(last7DaysRanking);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="leaderboard">
      <h2>🎄 MeldRun Leaderboard 🎄</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'top' ? 'active' : ''}`}
          onClick={() => setActiveTab('top')}
        >
          Top 5 Scores
        </button>
        <button
          className={`tab-button ${activeTab === 'lastWeek' ? 'active' : ''}`}
          onClick={() => setActiveTab('lastWeek')}
        >
          Top 5 Scores Last Week
        </button>
      </div>
      <div className="leaderboard-content">
        {activeTab === 'top' && (
          <ul className="leaderboard-list">
            {topScores.map((score: any, index) => (
              <li key={index} className="leaderboard-item">
                {index + 1}. {score?.address} - {score?.score}
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'lastWeek' && (
          <ul className="leaderboard-list">
            {lastWeekScores.map((score: any, index) => (
              <li key={index} className="leaderboard-item">
                {index + 1}. {score?.address} - {score?.score}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
