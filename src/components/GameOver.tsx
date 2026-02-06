import { useEffect, useState } from 'react'

interface GameOverProps {
  score: number
  round: number
  kills: number
  highScore: number
  onRestart: () => void
  onMenu: () => void
}

export default function GameOver({
  score,
  round,
  kills,
  highScore,
  onRestart,
  onMenu,
}: GameOverProps) {
  const [showStats, setShowStats] = useState(false)
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  useEffect(() => {
    setIsNewHighScore(score >= highScore && score > 0)
    const timer = setTimeout(() => setShowStats(true), 500)
    return () => clearTimeout(timer)
  }, [score, highScore])

  return (
    <div className="gameover-container">
      <div className="gameover-background" />
      <div className="scanline" />
      <div className="noise-overlay" />

      <div className="gameover-content">
        <div className="gameover-title-container">
          <h1 className="gameover-title">TERMINATED</h1>
          <div className="gameover-subtitle">VITAL SIGNS: FLATLINED</div>
        </div>

        {isNewHighScore && (
          <div className="new-highscore-badge">
            <span className="badge-icon">&#9733;</span>
            NEW HIGH SCORE
            <span className="badge-icon">&#9733;</span>
          </div>
        )}

        <div className={`stats-container ${showStats ? 'visible' : ''}`}>
          <div className="stat-row">
            <span className="stat-label">FINAL SCORE</span>
            <span className="stat-value score-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">ROUND REACHED</span>
            <span className="stat-value round-value">{round}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">TOTAL KILLS</span>
            <span className="stat-value kills-value">{kills}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-row highscore-row">
            <span className="stat-label">BEST SCORE</span>
            <span className="stat-value highscore-value">{highScore.toLocaleString()}</span>
          </div>
        </div>

        <div className="button-container">
          <button className="gameover-button restart-button" onClick={onRestart}>
            <span className="button-bg restart-bg" />
            <span className="button-text">RETRY PROTOCOL</span>
          </button>
          <button className="gameover-button menu-button" onClick={onMenu}>
            <span className="button-bg menu-bg" />
            <span className="button-text">ABORT MISSION</span>
          </button>
        </div>
      </div>

      <style>{`
        .gameover-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .gameover-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse at center, rgba(255, 34, 68, 0.1) 0%, transparent 50%),
            rgba(0, 0, 0, 0.85);
          pointer-events: none;
        }

        .gameover-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gameover-title-container {
          text-align: center;
          margin-bottom: 24px;
        }

        .gameover-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(40px, 10vw, 72px);
          font-weight: 900;
          margin: 0;
          color: #ff2244;
          text-shadow:
            0 0 20px #ff2244,
            0 0 40px #ff2244,
            0 0 60px rgba(255, 34, 68, 0.5);
          letter-spacing: 0.1em;
          animation: text-glitch 2s infinite;
        }

        .gameover-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(10px, 2.5vw, 14px);
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.3em;
          margin-top: 12px;
        }

        .new-highscore-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: linear-gradient(135deg, rgba(255, 238, 0, 0.2), rgba(255, 170, 0, 0.2));
          border: 2px solid #ffee00;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #ffee00;
          letter-spacing: 3px;
          margin-bottom: 24px;
          animation: pulseGlow 1.5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 238, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 238, 0, 0.8);
          }
        }

        .badge-icon {
          font-size: 16px;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px 40px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 32px;
          min-width: 280px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .stats-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 2px;
        }

        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 24px;
          font-weight: 700;
        }

        .score-value {
          color: #00ff88;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .round-value {
          color: #ffee00;
          text-shadow: 0 0 10px rgba(255, 238, 0, 0.5);
        }

        .kills-value {
          color: #ff2244;
          text-shadow: 0 0 10px rgba(255, 34, 68, 0.5);
        }

        .stat-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          margin: 8px 0;
        }

        .highscore-row .stat-label {
          color: rgba(255, 238, 0, 0.7);
        }

        .highscore-value {
          color: #ffee00;
          text-shadow: 0 0 15px rgba(255, 238, 0, 0.7);
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .gameover-button {
          position: relative;
          padding: 16px 40px;
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(12px, 2.5vw, 14px);
          font-weight: 700;
          letter-spacing: 3px;
          color: #0a0a0a;
          background: transparent;
          border: none;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease;
          pointer-events: auto;
          min-width: 240px;
          min-height: 52px;
        }

        .gameover-button:hover {
          transform: scale(1.05);
        }

        .gameover-button:active {
          transform: scale(0.98);
        }

        .button-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }

        .restart-bg {
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        }

        .menu-bg {
          background: linear-gradient(135deg, #666 0%, #444 100%);
        }

        .menu-button {
          color: #ffffff;
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .gameover-content {
            padding: 24px;
          }

          .stats-container {
            padding: 20px 24px;
            min-width: 240px;
          }

          .stat-row {
            gap: 24px;
          }

          .stat-value {
            font-size: 20px;
          }

          .new-highscore-badge {
            font-size: 12px;
            padding: 10px 16px;
          }

          .gameover-button {
            min-width: 200px;
            padding: 14px 32px;
          }
        }
      `}</style>
    </div>
  )
}
