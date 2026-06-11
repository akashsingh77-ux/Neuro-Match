import { useEffect, useState } from "react";

const EMOJIS = ["🎮", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎺"];

export default function MemoryMatchGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && !gameWon) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameWon]);

  useEffect(() => {
    if (matched.length === EMOJIS.length && matched.length > 0) {
      setGameWon(true);
      setIsActive(false);
      setTimeout(() => {
        alert(`🎉 Congratulations! You won in ${seconds} seconds with ${moves} moves!`);
      }, 300);
    }
  }, [matched]);

  function startGame() {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
      }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setSeconds(0);
    setIsActive(false);
  }

  function handleClick(card) {
    if (
      flipped.length === 2 ||
      flipped.includes(card) ||
      matched.includes(card.emoji)
    ) {
      return;
    }

    // Start timer on first click
    if (!isActive) setIsActive(true);

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setMatched([...matched, card.emoji]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  function isFlipped(card) {
    return flipped.includes(card) || matched.includes(card.emoji);
  }

  // Format time to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="game-container">
      <style>{`
        .game-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
        }

        .game-card-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 { color: #4db8ff; margin-top: 0; margin-bottom: 5px;}
        
        .stats {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          font-weight: bold;
          font-size: 1rem;
          background: rgba(0,0,0,0.2);
          padding: 10px;
          border-radius: 8px;
        }

        .btn-new-game {
          background: #4db8ff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
          margin-bottom: 10px;
          width: 100%;
        }

        .btn-new-game:hover {
          background: #37a2eb;
          transform: translateY(-2px);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 10px;
        }

        .card {
          aspect-ratio: 1/1;
          background: #0f3460;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
          user-select: none;
        }

        .card:hover {
          border-color: #4db8ff;
          transform: scale(1.05);
        }

        .win-text {
          color: #00ff88;
          margin: 10px 0;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="game-card-panel">
        <h1>Memory Match</h1>
        
        <button className="btn-new-game" onClick={startGame}>New Game</button>

        <div className="stats">
          <span>⏱ {formatTime(seconds)}</span>
          <span>Moves: {moves}</span>
          <span>Pairs: {matched.length}/{EMOJIS.length}</span>
        </div>

        {gameWon && <h2 className="win-text">🎉 You Win!</h2>}

        <div className="grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card"
              style={{
                background: isFlipped(card) ? "#16213e" : "#0f3460",
                color: isFlipped(card) ? "white" : "transparent"
              }}
              onClick={() => handleClick(card)}
            >
              {isFlipped(card) ? card.emoji : "?"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}