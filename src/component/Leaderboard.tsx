import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const topScores = [
    { playerName: 'Alice', score: 5000 },
    { playerName: 'Bob', score: 4800 },
    { playerName: 'Charlie', score: 4700 },
    { playerName: 'David', score: 4600 },
    { playerName: 'Eve', score: 4500 },
  ];

  const lastWeekScores = [
    { playerName: 'Frank', score: 4000 },
    { playerName: 'Grace', score: 3900 },
    { playerName: 'Heidi', score: 3800 },
    { playerName: 'Ivan', score: 3700 },
    { playerName: 'Judy', score: 3600 },
  ];

  const [activeTab, setActiveTab] = useState('top');

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
            {topScores.map((score, index) => (
              <li key={index} className="leaderboard-item">
                {index + 1}. {score.playerName} - {score.score}
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'lastWeek' && (
          <ul className="leaderboard-list">
            {lastWeekScores.map((score, index) => (
              <li key={index} className="leaderboard-item">
                {index + 1}. {score.playerName} - {score.score}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
