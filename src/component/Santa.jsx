import React, { useEffect, useRef, useState } from 'react';
import './Santa.css';

function Santa() {
  const santaRef = useRef(null);
  const obstaclesRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

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
          alert('Game Over! Your Score: ' + score);
          setScore(0);
        } else {
          setScore((prevScore) => prevScore + 1);
        }
      }
    }, 10);

    return () => clearInterval(checkCollision);
  }, [score, isJumping]);

  useEffect(() => {
    document.addEventListener('keydown', jump);
    return () => document.removeEventListener('keydown', jump);
  }, []);

  return (
    <div className="game-container">
      <div className="game">
        <div className="score">Score: {score}</div>
        <div id="santa" ref={santaRef} style={{ bottom: '0px' }}></div>
        <div id="obstacles" ref={obstaclesRef}></div>
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
      </div>
    </div>
  );
}

export default Santa;
