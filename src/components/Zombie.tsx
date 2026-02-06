import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ZombieProps {
  id: number
  initialPosition: THREE.Vector3
  targetPosition: THREE.Vector3
  speed: number
  swordRotation: number
  playerPosition: THREE.Vector3
  onHit: (id: number) => void
  onPlayerHit: () => void
}

const SWORD_REACH = 3.8
const ATTACK_RANGE = 1.5
const ATTACK_COOLDOWN = 1.5

export default function Zombie({
  id,
  initialPosition,
  targetPosition,
  speed,
  swordRotation,
  playerPosition,
  onHit,
  onPlayerHit,
}: ZombieProps) {
  const meshRef = useRef<THREE.Group>(null!)
  const [position, setPosition] = useState(initialPosition.clone())
  const [isHit, setIsHit] = useState(false)
  const lastHitTime = useRef(0)
  const lastAttackTime = useRef(0)
  const wobble = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    wobble.current += delta * 2

    // Move towards player
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, position)
      .normalize()

    const newPos = position.clone().add(direction.multiplyScalar(speed * delta))
    setPosition(newPos)
    meshRef.current.position.copy(newPos)

    // Zombie wobble animation
    meshRef.current.rotation.z = Math.sin(wobble.current) * 0.1
    meshRef.current.position.y = Math.abs(Math.sin(wobble.current * 2)) * 0.1

    // Face the player
    meshRef.current.lookAt(targetPosition.x, 0, targetPosition.z)

    // Check collision with sword
    const distToPlayer = position.distanceTo(playerPosition)

    if (distToPlayer < SWORD_REACH && time - lastHitTime.current > 0.5) {
      // Check if sword blade is hitting
      const zombieAngle = Math.atan2(
        position.x - playerPosition.x,
        position.z - playerPosition.z
      )
      const swordAngle1 = swordRotation % (Math.PI * 2)
      const swordAngle2 = (swordRotation + Math.PI) % (Math.PI * 2)

      const angleDiff1 = Math.abs(
        ((zombieAngle - swordAngle1 + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      )
      const angleDiff2 = Math.abs(
        ((zombieAngle - swordAngle2 + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      )

      if (angleDiff1 < 0.5 || angleDiff2 < 0.5) {
        lastHitTime.current = time
        setIsHit(true)
        setTimeout(() => setIsHit(false), 100)
        onHit(id)
      }
    }

    // Attack player if close enough
    if (distToPlayer < ATTACK_RANGE && time - lastAttackTime.current > ATTACK_COOLDOWN) {
      lastAttackTime.current = time
      onPlayerHit()
    }
  })

  return (
    <group ref={meshRef} position={initialPosition}>
      {/* Zombie body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={isHit ? '#ff4444' : '#3a5a3a'}
          emissive={isHit ? '#ff0000' : '#1a2a1a'}
          emissiveIntensity={isHit ? 1 : 0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Zombie head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial
          color={isHit ? '#ff4444' : '#4a6a4a'}
          emissive={isHit ? '#ff0000' : '#1a2a1a'}
          emissiveIntensity={isHit ? 1 : 0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Glowing eyes */}
      <mesh position={[0.08, 1.25, 0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color="#ff2244"
          emissive="#ff2244"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.08, 1.25, 0.22]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color="#ff2244"
          emissive="#ff2244"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.4, 0.7, 0.3]} rotation={[1.2, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 6, 8]} />
        <meshStandardMaterial
          color={isHit ? '#ff4444' : '#3a5a3a'}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[-0.4, 0.7, 0.3]} rotation={[1.2, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 6, 8]} />
        <meshStandardMaterial
          color={isHit ? '#ff4444' : '#3a5a3a'}
          roughness={0.8}
        />
      </mesh>

      {/* Danger indicator light */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={0.3}
        color="#ff2244"
        distance={3}
      />
    </group>
  )
}
