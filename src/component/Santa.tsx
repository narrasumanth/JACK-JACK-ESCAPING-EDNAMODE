import React, { useEffect, useRef, useState } from 'react';
import './Santa.css';
import detectEthereumProvider from '@metamask/detect-provider';
import {
  claimTokens,
  totalBurn,
  totalBurnByUser,
} from '../middleware/integration';

function Santa() {
  const santaRef = useRef(null);
  const obstaclesRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [finalScore, setFinalScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalBurnValueFetching, setTotalBurnValueFetching] = useState('');
  const [totalBurnValueUserFetching, setTotalBurnValueUserFetching] =
    useState('');
  const [userAccount, setUserAccount] = useState('');
  
  async function checkMetaMaskConnection() {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts: any = await window?.ethereum.request({
        method: 'eth_accounts',
      });
      setUserAccount(accounts[0]);
      if (accounts?.length > 0) {
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
    if (isConnected && isGameStarted) {
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
            setIsGameOver(true);
            setIsGameStarted(false);
          } else {
            setScore((prevScore) => prevScore + 1);
          }
        }
      }, 10);

      return () => clearInterval(checkCollision);
    }
  }, [score, isJumping, isConnected, isGameStarted]);

  useEffect(() => {
    const handleSpacePress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (isGameOver) {
          setShowModal(false);
          setIsGameOver(false);
          setIsGameStarted(true);
        } else if (!isGameStarted) {
          setIsGameStarted(true);
          setShowModal(false);
        }
      }
    };

    const handleTouch = (event) => {
      if (event.target.closest('button')) {
        return;
      }

      if (isGameOver) {
        setShowModal(false);
        setIsGameOver(false);
        setIsGameStarted(true);
      } else if (!isGameStarted) {
        setIsGameStarted(true);
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleSpacePress);
    document.addEventListener('touchstart', handleTouch);
    return () => {
      document.removeEventListener('keydown', handleSpacePress);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [isGameOver, isGameStarted]);

  useEffect(() => {
    if (isConnected && isGameStarted) {
      document.addEventListener('keydown', jump);
      document.addEventListener('touchstart', jump);
      return () => {
        document.removeEventListener('keydown', jump);
        document.removeEventListener('touchstart', jump);
      };
    }
  }, [isConnected, isGameStarted]);

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  const claimButton = async () => {
    console.log('finalScore', finalScore);
    let value = await claimTokens(finalScore);
    if (value === 'success') {
      setShowModal(false);
      setScore(0);
      alert('Burn Success');
    }
  };

  const fetchScores = async () => {
    try {
      const totalBurnValue = await totalBurn();
      setTotalBurnValueFetching(totalBurnValue);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const fetchUserScores = async () => {
    try {
      const totalBurnValueUser = await totalBurnByUser(userAccount);
      setTotalBurnValueUserFetching(totalBurnValueUser);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  useEffect(() => {
    fetchScores();
    if (userAccount) {
      fetchUserScores();
    }
  }, [userAccount]);

  useEffect(() => {
    const burnButton = document.querySelector('.burn-button');
    if (burnButton) {
      burnButton.addEventListener('touchstart', function (event) {
        event.preventDefault();
        claimButton();
      });
    }

    return () => {
      if (burnButton) {
        burnButton.removeEventListener('touchstart', claimButton);
      }
    };
  }, []);

  return (
    <div className="game-container">
      <div className="game">
        <div className="score">
          <span>Current Score: {score}</span>
          <span>
            {' '}
            - Platform Burn: {Math.round(totalBurnValueFetching * 100) / 100}
          </span>{' '}
          {userAccount && (
            <span>
              - Your Burn: {Math.round(totalBurnValueUserFetching * 100) / 100}
            </span>
          )}
        </div>

        <div id="santa" ref={santaRef} style={{ bottom: '0px' }} />
        {isConnected && isGameStarted && !showModal && (
          <div id="obstacles" ref={obstaclesRef} />
        )}
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
        {showModal ? (
          <div className="modal">
            <div className="modal-content">
              {isGameOver ? (
                <>
                  <h2>Game Over</h2>
                  <p className="final-p">
                    Your Final Score:
                    <span className="final-score">{finalScore}</span>
                  </p>
                  <p>
                    Press <span className="key">Space</span> or{' '}
                    <span className="key">Tap the screen</span> to continue the
                    game.
                  </p>
                  <span style={{ display: 'block', margin: '20px 0px' }}>
                    OR
                  </span>
                  <button
                    onClick={claimButton}
                    className="burn-button"
                    style={{ pointerEvents: 'auto', zIndex: 1001 }}
                    tabIndex={0}
                  >
                    Burn EDNA Tokens
                  </button>
                </>
              ) : isConnected ? (
                <p>
                  Press <span className="key">Space</span> or{' '}
                  <span className="key">Tap the screen</span> to start the game.
                </p>
              ) : (
                <p>
                  Please <span className="key">Connect your wallet</span> to
                  start the game.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Santa;
