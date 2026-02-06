import { forwardRef, useRef, useEffect, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlayerProps {
  onPositionChange: (pos: THREE.Vector3) => void
  onSwordRotationChange: (rotation: number) => void
  arenaSize: number
}

const Player = forwardRef<THREE.Group, PlayerProps>(
  ({ onPositionChange, onSwordRotationChange, arenaSize }, ref) => {
    const groupRef = useRef<THREE.Group>(null!)
    const swordRef = useRef<THREE.Group>(null!)
    const [keys, setKeys] = useState({
      w: false,
      a: false,
      s: false,
      d: false,
      up: false,
      down: false,
      left: false,
      right: false,
    })
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
    const [touchMove, setTouchMove] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const velocity = useRef(new THREE.Vector3())
    const swordRotation = useRef(0)

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') setKeys((k) => ({ ...k, w: true, up: true }))
      if (key === 'a' || key === 'arrowleft') setKeys((k) => ({ ...k, a: true, left: true }))
      if (key === 's' || key === 'arrowdown') setKeys((k) => ({ ...k, s: true, down: true }))
      if (key === 'd' || key === 'arrowright') setKeys((k) => ({ ...k, d: true, right: true }))
    }, [])

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') setKeys((k) => ({ ...k, w: false, up: false }))
      if (key === 'a' || key === 'arrowleft') setKeys((k) => ({ ...k, a: false, left: false }))
      if (key === 's' || key === 'arrowdown') setKeys((k) => ({ ...k, s: false, down: false }))
      if (key === 'd' || key === 'arrowright') setKeys((k) => ({ ...k, d: false, right: false }))
    }, [])

    const handleTouchStart = useCallback((e: TouchEvent) => {
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
    }, [])

    const handleTouchMove = useCallback((e: TouchEvent) => {
      if (!touchStart) return
      const touch = e.touches[0]
      const dx = (touch.clientX - touchStart.x) / 50
      const dy = (touch.clientY - touchStart.y) / 50
      setTouchMove({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) })
    }, [touchStart])

    const handleTouchEnd = useCallback(() => {
      setTouchStart(null)
      setTouchMove({ x: 0, y: 0 })
    }, [])

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      window.addEventListener('touchstart', handleTouchStart)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchMove, handleTouchEnd])

    useFrame((_, delta) => {
      if (!groupRef.current) return

      const speed = 8
      const direction = new THREE.Vector3()

      // Keyboard input
      if (keys.w || keys.up) direction.z -= 1
      if (keys.s || keys.down) direction.z += 1
      if (keys.a || keys.left) direction.x -= 1
      if (keys.d || keys.right) direction.x += 1

      // Touch input
      direction.x += touchMove.x
      direction.z += touchMove.y

      if (direction.length() > 0) {
        direction.normalize()
        velocity.current.lerp(direction.multiplyScalar(speed), 0.2)
      } else {
        velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.15)
      }

      // Update position
      const newPos = groupRef.current.position
        .clone()
        .add(velocity.current.clone().multiplyScalar(delta))

      // Clamp to arena bounds
      newPos.x = Math.max(-arenaSize + 1, Math.min(arenaSize - 1, newPos.x))
      newPos.z = Math.max(-arenaSize + 1, Math.min(arenaSize - 1, newPos.z))

      groupRef.current.position.copy(newPos)
      onPositionChange(newPos.clone())

      // Rotate sword - faster rotation
      swordRotation.current += delta * 6
      if (swordRef.current) {
        swordRef.current.rotation.y = swordRotation.current
      }
      onSwordRotationChange(swordRotation.current)
    })

    return (
      <group ref={groupRef}>
        <group ref={ref}>
          {/* Player body */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <capsuleGeometry args={[0.4, 0.7, 8, 16]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Player head */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>

          {/* Eyes - glowing */}
          <mesh position={[0.1, 1.55, 0.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[-0.1, 1.55, 0.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Rotating sword assembly */}
          <group ref={swordRef} position={[0, 1, 0]}>
            {/* Main blade */}
            <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <boxGeometry args={[0.1, 3.5, 0.3]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#00ff88"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Blade glow trail */}
            <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.15, 3.6, 0.4]} />
              <meshBasicMaterial
                color="#00ff88"
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Opposite blade */}
            <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <boxGeometry args={[0.1, 3.5, 0.3]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ff2244"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Blade glow trail 2 */}
            <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.15, 3.6, 0.4]} />
              <meshBasicMaterial
                color="#ff2244"
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Center hub */}
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.5, 0.15, 8, 16]} />
              <meshStandardMaterial
                color="#ffee00"
                emissive="#ffee00"
                emissiveIntensity={0.8}
                metalness={0.8}
              />
            </mesh>
          </group>

          {/* Point light on player */}
          <pointLight
            position={[0, 2, 0]}
            intensity={0.5}
            color="#00ff88"
            distance={5}
          />
        </group>
      </group>
    )
  }
)

Player.displayName = 'Player'

export default Player
