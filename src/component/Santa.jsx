import { useEffect, useRef, useState } from 'react';
import './Santa.css';
import detectEthereumProvider from '@metamask/detect-provider';
import { claimTokens } from '../middleware/integration';


function Santa() {
  const santaRef = useRef(null);
  const obstaclesRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  async function checkMetaMaskConnection() {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }
  }

  const jump = () => {
    if (santaRef.current && !isJumping) {
      let position = 0;
      setIsJumping(true);

      const jumpInterval = setInterval(() => {
        if (position >= 150) {
          clearInterval(jumpInterval);

          const fallInterval = setInterval(() => {
            if (position <= 0) {
              clearInterval(fallInterval);
              setIsJumping(false);
            } else {
              position -= 10;
              santaRef.current.style.bottom = `${position}px`;
            }
          }, 20);
        } else {
          position += 10;
          santaRef.current.style.bottom = `${position}px`;
        }
      }, 20);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const checkCollision = setInterval(() => {
        if (santaRef.current && obstaclesRef.current) {
          const santaRect = santaRef.current.getBoundingClientRect();
          const obstaclesRect = obstaclesRef.current.getBoundingClientRect();

          if (
            !isJumping &&
            obstaclesRect.left < santaRect.right &&
            obstaclesRect.right > santaRect.left &&
            obstaclesRect.bottom > santaRect.top
          ) {
            setFinalScore(score);
            setShowModal(true);
            setScore(0);
          } else {
            setScore((prevScore) => prevScore + 1);
          }
        }
      }, 10);

      return () => clearInterval(checkCollision);
    }
  }, [score, isJumping, isConnected]);

  useEffect(() => {
    if (showModal) {
      const handleSpacePress = (event) => {
        if (event.code === 'Space') {
          setShowModal(false);
        }
      };
      document.addEventListener('keydown', handleSpacePress);

      return () => document.removeEventListener('keydown', handleSpacePress);
    }
  }, [showModal]);

  useEffect(() => {
    if (isConnected) {
      document.addEventListener('keydown', jump);
      return () => document.removeEventListener('keydown', jump);
    }
  }, [isConnected]);

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  const claimButton = () => {
    console.log('finalScore', finalScore);
    claimTokens(finalScore)
  };

  return (
    <div className="game-container">
      <div className="game">
        <div className="score">Score: {score}</div>
        <div id="santa" ref={santaRef} style={{ bottom: '0px' }} />
        {isConnected && !showModal && <div id="obstacles" ref={obstaclesRef} />}
        <div className="snowflakes">
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❅</div>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Game Over</h2>
              <p className="final-p">
                Your Final Score:
                <span className="final-score">{finalScore}</span>
              </p>
              <p>
                Press <span className="key">Space</span> to continue the game.
              </p>
              <span style={{ display: 'block', margin: '20px 0px' }}>OR</span>
              <button onClick={claimButton}>Claim Button</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Santa;
