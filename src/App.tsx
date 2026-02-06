import { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'
import Game from './components/Game'
import HUD from './components/HUD'
import MainMenu from './components/MainMenu'
import GameOver from './components/GameOver'
import './styles.css'

export type GameState = 'menu' | 'playing' | 'gameover'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [health, setHealth] = useState(100)
  const [kills, setKills] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('zombieSwordHighScore')
    return saved ? parseInt(saved, 10) : 0
  })

  const startGame = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setRound(1)
    setHealth(100)
    setKills(0)
  }, [])

  const endGame = useCallback(() => {
    setGameState('gameover')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('zombieSwordHighScore', score.toString())
    }
  }, [score, highScore])

  const returnToMenu = useCallback(() => {
    setGameState('menu')
  }, [])

  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      endGame()
    }
  }, [health, gameState, endGame])

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 12, 12], fov: 50 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 15, 35]} />
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#00ff88" />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

          {gameState === 'playing' && (
            <Game
              round={round}
              setRound={setRound}
              score={score}
              setScore={setScore}
              health={health}
              setHealth={setHealth}
              kills={kills}
              setKills={setKills}
            />
          )}

          <Environment preset="night" />
        </Canvas>
      </div>

      {gameState === 'menu' && (
        <MainMenu onStart={startGame} highScore={highScore} />
      )}

      {gameState === 'playing' && (
        <HUD
          score={score}
          round={round}
          health={health}
          kills={kills}
        />
      )}

      {gameState === 'gameover' && (
        <GameOver
          score={score}
          round={round}
          kills={kills}
          highScore={highScore}
          onRestart={startGame}
          onMenu={returnToMenu}
        />
      )}

      <footer className="footer">
        Requested by <span className="footer-highlight">@plantingtoearn</span> · Built by <span className="footer-highlight">@clonkbot</span>
      </footer>
    </div>
  )
}

export default App
