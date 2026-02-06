import { useState, useEffect } from 'react'

interface MainMenuProps {
  onStart: () => void
  highScore: number
}

export default function MainMenu({ onStart, highScore }: MainMenuProps) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 100)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="menu-container">
      <div className="menu-background" />
      <div className="scanline" />
      <div className="noise-overlay" />

      <div className="menu-content">
        <div className="title-container">
          <h1 className={`game-title ${glitch ? 'glitch' : ''}`}>
            <span className="title-line">ZOMBIE</span>
            <span className="title-line title-blade">BLADE</span>
          </h1>
          <div className="title-subtitle">SURVIVAL PROTOCOL</div>
        </div>

        <div className="menu-divider">
          <div className="divider-line" />
          <div className="divider-icon">&#9876;</div>
          <div className="divider-line" />
        </div>

        <button className="start-button" onClick={onStart}>
          <span className="button-bg" />
          <span className="button-text">INITIATE PROTOCOL</span>
          <span className="button-glow" />
        </button>

        {highScore > 0 && (
          <div className="high-score">
            <span className="high-score-label">HIGHEST RECORDED SCORE</span>
            <span className="high-score-value">{highScore.toLocaleString()}</span>
          </div>
        )}

        <div className="menu-instructions">
          <div className="instruction-row">
            <div className="instruction-key">WASD / ARROWS</div>
            <div className="instruction-desc">Movement Control</div>
          </div>
          <div className="instruction-row">
            <div className="instruction-key">AUTO</div>
            <div className="instruction-desc">Blade Rotation</div>
          </div>
          <div className="instruction-row mobile-instruction">
            <div className="instruction-key">TOUCH + DRAG</div>
            <div className="instruction-desc">Mobile Control</div>
          </div>
        </div>

        <div className="version-tag">v1.0.0 // CLASSIFIED</div>
      </div>

      <style>{`
        .menu-container {
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

        .menu-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.9) 100%),
            linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 50%, rgba(255, 34, 68, 0.05) 100%);
          pointer-events: none;
        }

        .menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          animation: fadeIn 1s ease-out;
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

        .title-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .game-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(48px, 12vw, 96px);
          font-weight: 900;
          margin: 0;
          line-height: 0.9;
          display: flex;
          flex-direction: column;
        }

        .title-line {
          display: block;
          color: #ffffff;
          text-shadow:
            0 0 20px rgba(255, 255, 255, 0.5),
            0 0 40px rgba(0, 255, 136, 0.3);
          letter-spacing: 0.1em;
        }

        .title-blade {
          color: #00ff88;
          text-shadow:
            0 0 20px #00ff88,
            0 0 40px #00ff88,
            0 0 60px rgba(0, 255, 136, 0.5),
            0 0 80px rgba(0, 255, 136, 0.3);
        }

        .game-title.glitch {
          animation: text-glitch 0.1s ease;
        }

        .title-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(12px, 3vw, 18px);
          color: rgba(255, 238, 0, 0.7);
          letter-spacing: 0.5em;
          margin-top: 16px;
        }

        .menu-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 32px 0;
          width: 100%;
          max-width: 400px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent);
        }

        .divider-icon {
          color: #00ff88;
          font-size: 24px;
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .start-button {
          position: relative;
          padding: 20px 48px;
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(14px, 3vw, 18px);
          font-weight: 700;
          letter-spacing: 4px;
          color: #0a0a0a;
          background: transparent;
          border: none;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease;
          pointer-events: auto;
          min-height: 60px;
        }

        .start-button:hover {
          transform: scale(1.05);
        }

        .start-button:active {
          transform: scale(0.98);
        }

        .button-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        .button-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: #00ff88;
          clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          filter: blur(10px);
          opacity: 0.5;
          z-index: -1;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .high-score {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          border: 1px solid rgba(255, 238, 0, 0.3);
          background: rgba(0, 0, 0, 0.5);
        }

        .high-score-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(255, 238, 0, 0.6);
          letter-spacing: 3px;
        }

        .high-score-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #ffee00;
          text-shadow: 0 0 20px rgba(255, 238, 0, 0.5);
        }

        .menu-instructions {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .instruction-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .instruction-key {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          min-width: 120px;
          text-align: center;
        }

        .instruction-desc {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
        }

        .mobile-instruction {
          display: none;
        }

        .version-tag {
          position: absolute;
          bottom: 40px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .menu-content {
            padding: 24px;
          }

          .menu-divider {
            max-width: 280px;
          }

          .start-button {
            padding: 16px 32px;
            min-height: 50px;
          }

          .high-score {
            padding: 12px 24px;
          }

          .high-score-value {
            font-size: 24px;
          }

          .mobile-instruction {
            display: flex;
          }

          .version-tag {
            bottom: 30px;
          }
        }
      `}</style>
    </div>
  )
}
