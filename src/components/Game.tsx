import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Plane, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Player from './Player'
import Zombie from './Zombie'

interface GameProps {
  round: number
  setRound: (r: number | ((prev: number) => number)) => void
  score: number
  setScore: (s: number | ((prev: number) => number)) => void
  health: number
  setHealth: (h: number | ((prev: number) => number)) => void
  kills: number
  setKills: (k: number | ((prev: number) => number)) => void
}

interface ZombieData {
  id: number
  position: THREE.Vector3
  health: number
  speed: number
}

const ARENA_SIZE = 20
const SPAWN_DISTANCE = 18

export default function Game({
  round,
  setRound,
  score,
  setScore,
  health,
  setHealth,
  kills,
  setKills,
}: GameProps) {
  const playerRef = useRef<THREE.Group>(null!)
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [zombies, setZombies] = useState<ZombieData[]>([])
  const [zombiesKilledThisRound, setZombiesKilledThisRound] = useState(0)
  const [totalZombiesThisRound, setTotalZombiesThisRound] = useState(0)
  const [spawnedThisRound, setSpawnedThisRound] = useState(0)
  const [swordRotation, setSwordRotation] = useState(0)
  const lastSpawnTime = useRef(0)
  const zombieIdCounter = useRef(0)
  const { camera } = useThree()

  // Calculate zombies per round
  const zombiesPerRound = useMemo(() => {
    return Math.floor(3 + round * 2 + Math.pow(round, 1.3))
  }, [round])

  // Zombie speed increases with rounds
  const zombieSpeed = useMemo(() => {
    return 1.5 + round * 0.2
  }, [round])

  // Zombie health increases with rounds
  const zombieHealth = useMemo(() => {
    return 1 + Math.floor(round / 3)
  }, [round])

  // Initialize round
  useEffect(() => {
    setTotalZombiesThisRound(zombiesPerRound)
    setZombiesKilledThisRound(0)
    setSpawnedThisRound(0)
    lastSpawnTime.current = 0
  }, [round, zombiesPerRound])

  // Check for round completion
  useEffect(() => {
    if (zombiesKilledThisRound >= totalZombiesThisRound && totalZombiesThisRound > 0) {
      setTimeout(() => {
        setRound((r: number) => r + 1)
      }, 1500)
    }
  }, [zombiesKilledThisRound, totalZombiesThisRound, setRound])

  // Spawn zombies
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Spawn rate decreases (faster) as rounds progress
    const spawnInterval = Math.max(0.5, 2 - round * 0.1)

    if (
      time - lastSpawnTime.current > spawnInterval &&
      spawnedThisRound < totalZombiesThisRound &&
      zombies.length < Math.min(15, 5 + round) // Max zombies on screen
    ) {
      lastSpawnTime.current = time

      // Random position around the arena
      const angle = Math.random() * Math.PI * 2
      const spawnPos = new THREE.Vector3(
        Math.cos(angle) * SPAWN_DISTANCE,
        0,
        Math.sin(angle) * SPAWN_DISTANCE
      )

      const newZombie: ZombieData = {
        id: zombieIdCounter.current++,
        position: spawnPos,
        health: zombieHealth,
        speed: zombieSpeed * (0.8 + Math.random() * 0.4),
      }

      setZombies((prev) => [...prev, newZombie])
      setSpawnedThisRound((s) => s + 1)
    }

    // Update camera to follow player
    const targetCamPos = new THREE.Vector3(
      playerPosition.x,
      12,
      playerPosition.z + 12
    )
    camera.position.lerp(targetCamPos, 0.05)
    camera.lookAt(playerPosition.x, 0, playerPosition.z)
  })

  const handleZombieHit = useCallback(
    (zombieId: number) => {
      setZombies((prev) => {
        return prev
          .map((z) => {
            if (z.id === zombieId) {
              return { ...z, health: z.health - 1 }
            }
            return z
          })
          .filter((z) => {
            if (z.id === zombieId && z.health <= 0) {
              setScore((s: number) => s + 100 * round)
              setKills((k: number) => k + 1)
              setZombiesKilledThisRound((k) => k + 1)
              return false
            }
            return true
          })
      })
    },
    [round, setScore, setKills]
  )

  const handlePlayerHit = useCallback(() => {
    setHealth((h: number) => Math.max(0, h - 10))
  }, [setHealth])

  return (
    <group>
      {/* Arena Floor */}
      <Plane
        args={[50, 50]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.2}
        />
      </Plane>

      {/* Grid pattern on floor */}
      <gridHelper
        args={[50, 50, '#00ff8844', '#00ff8811']}
        position={[0, 0.01, 0]}
      />

      {/* Arena barriers */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2
        return (
          <RoundedBox
            key={i}
            args={[ARENA_SIZE * 2 + 4, 2, 1]}
            position={[
              Math.sin(angle) * (ARENA_SIZE + 0.5),
              1,
              Math.cos(angle) * (ARENA_SIZE + 0.5),
            ]}
            rotation={[0, angle, 0]}
            radius={0.1}
          >
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.2}
              transparent
              opacity={0.3}
            />
          </RoundedBox>
        )
      })}

      {/* Corner posts */}
      {[
        [ARENA_SIZE, ARENA_SIZE],
        [ARENA_SIZE, -ARENA_SIZE],
        [-ARENA_SIZE, ARENA_SIZE],
        [-ARENA_SIZE, -ARENA_SIZE],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 2, z]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
          <meshStandardMaterial
            color="#ff2244"
            emissive="#ff2244"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Player */}
      <Player
        ref={playerRef}
        onPositionChange={setPlayerPosition}
        onSwordRotationChange={setSwordRotation}
        arenaSize={ARENA_SIZE}
      />

      {/* Zombies */}
      {zombies.map((zombie) => (
        <Zombie
          key={zombie.id}
          id={zombie.id}
          initialPosition={zombie.position}
          targetPosition={playerPosition}
          speed={zombie.speed}
          swordRotation={swordRotation}
          playerPosition={playerPosition}
          onHit={handleZombieHit}
          onPlayerHit={handlePlayerHit}
        />
      ))}

      {/* Ambient particles */}
      <pointLight position={[10, 3, 10]} intensity={0.3} color="#ff2244" />
      <pointLight position={[-10, 3, -10]} intensity={0.3} color="#00ff88" />
      <pointLight position={[10, 3, -10]} intensity={0.2} color="#aa00ff" />
      <pointLight position={[-10, 3, 10]} intensity={0.2} color="#ffee00" />
    </group>
  )
}
