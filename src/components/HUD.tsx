import { useEffect, useState } from 'react'

interface HUDProps {
  score: number
  round: number
  health: number
  kills: number
}

export default function HUD({ score, round, health, kills }: HUDProps) {
  const [showRoundAlert, setShowRoundAlert] = useState(false)
  const [displayedRound, setDisplayedRound] = useState(round)

  useEffect(() => {
    setShowRoundAlert(true)
    setDisplayedRound(round)
    const timer = setTimeout(() => setShowRoundAlert(false), 2000)
    return () => clearTimeout(timer)
  }, [round])

  return (
    <div className="hud-container">
      {/* Scanline effect */}
      <div className="scanline" />
      <div className="noise-overlay" />

      {/* Top bar */}
      <div className="hud-top">
        <div className="hud-stat hud-score">
          <span className="hud-label">SCORE</span>
          <span className="hud-value">{score.toLocaleString()}</span>
        </div>

        <div className="hud-round-display">
          <span className="hud-round-label">ROUND</span>
          <span className="hud-round-value">{round}</span>
        </div>

        <div className="hud-stat hud-kills">
          <span className="hud-label">KILLS</span>
          <span className="hud-value">{kills}</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="hud-health-container">
        <div className="hud-health-label">VITALS</div>
        <div className="hud-health-bar">
          <div
            className="hud-health-fill"
            style={{
              width: `${health}%`,
              backgroundColor:
                health > 60 ? '#00ff88' : health > 30 ? '#ffee00' : '#ff2244',
              boxShadow: `0 0 20px ${
                health > 60 ? '#00ff88' : health > 30 ? '#ffee00' : '#ff2244'
              }`,
            }}
          />
          <div className="hud-health-segments">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="hud-health-segment" />
            ))}
          </div>
        </div>
        <div className="hud-health-value">{health}%</div>
      </div>

      {/* Round alert */}
      {showRoundAlert && (
        <div className="round-alert">
          <div className="round-alert-text">
            <span className="round-alert-label">ROUND</span>
            <span className="round-alert-number">{displayedRound}</span>
          </div>
          <div className="round-alert-subtext">SURVIVE THE HORDE</div>
        </div>
      )}

      {/* Controls hint */}
      <div className="controls-hint">
        <span className="controls-key">WASD</span>
        <span className="controls-or">or</span>
        <span className="controls-key">ARROWS</span>
        <span className="controls-desc">to move</span>
        <span className="controls-mobile">TOUCH + DRAG on mobile</span>
      </div>

      <style>{`
        .hud-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          font-family: 'Orbitron', sans-serif;
          z-index: 10;
        }

        .hud-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 20px;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
        }

        .hud-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hud-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 3px;
          margin-bottom: 4px;
        }

        .hud-value {
          font-size: 24px;
          font-weight: 700;
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88;
          animation: flicker 4s infinite;
        }

        .hud-kills .hud-value {
          color: #ff2244;
          text-shadow: 0 0 10px #ff2244, 0 0 20px #ff2244;
        }

        .hud-round-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 24px;
          border: 2px solid rgba(255, 238, 0, 0.5);
          background: rgba(0, 0, 0, 0.5);
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }

        .hud-round-label {
          font-size: 10px;
          color: rgba(255, 238, 0, 0.7);
          letter-spacing: 3px;
        }

        .hud-round-value {
          font-size: 32px;
          font-weight: 900;
          color: #ffee00;
          text-shadow: 0 0 15px #ffee00, 0 0 30px #ffee00;
        }

        .hud-health-container {
          position: absolute;
          bottom: 60px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hud-health-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 2px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .hud-health-bar {
          width: 200px;
          height: 16px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .hud-health-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .hud-health-segments {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
        }

        .hud-health-segment {
          flex: 1;
          border-right: 1px solid rgba(0, 0, 0, 0.5);
        }

        .hud-health-value {
          font-size: 14px;
          font-weight: 700;
          color: white;
          min-width: 50px;
        }

        .round-alert {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          animation: roundAlertIn 0.5s ease-out, roundAlertOut 0.5s ease-in 1.5s forwards;
        }

        @keyframes roundAlertIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes roundAlertOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .round-alert-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .round-alert-label {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 10px;
        }

        .round-alert-number {
          font-size: 120px;
          font-weight: 900;
          color: #ffee00;
          text-shadow: 0 0 30px #ffee00, 0 0 60px #ffee00, 0 0 90px rgba(255, 238, 0, 0.5);
          animation: text-glitch 0.3s infinite;
          line-height: 1;
        }

        .round-alert-subtext {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 5px;
          margin-top: 16px;
        }

        .controls-hint {
          position: absolute;
          bottom: 30px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .controls-key {
          padding: 4px 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, 0.6);
        }

        .controls-or {
          color: rgba(255, 255, 255, 0.3);
        }

        .controls-desc {
          margin-left: 4px;
        }

        .controls-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .hud-top {
            padding: 12px 12px;
          }

          .hud-value {
            font-size: 18px;
          }

          .hud-round-value {
            font-size: 24px;
          }

          .hud-round-display {
            padding: 6px 16px;
          }

          .hud-health-container {
            bottom: 50px;
            left: 12px;
          }

          .hud-health-bar {
            width: 140px;
            height: 12px;
          }

          .hud-health-label {
            display: none;
          }

          .round-alert-number {
            font-size: 72px;
          }

          .round-alert-label {
            font-size: 16px;
          }

          .controls-hint {
            bottom: 25px;
            right: 12px;
          }

          .controls-key,
          .controls-or,
          .controls-desc {
            display: none;
          }

          .controls-mobile {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
