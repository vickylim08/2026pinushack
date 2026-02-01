import { useRef, useEffect } from 'react'
import { PointerLockControls, Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Artwork from './Artwork'
import { useStore } from '../store/useStore'
import { useFrame, useThree } from '@react-three/fiber'

function FPSControls({ artworks }) {
  const { camera } = useThree()
  const currentArtwork = useStore((state) => state.currentArtwork)
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const isDragging = useRef(false)
  const rotation = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    // Reset camera to standard orientation
    camera.up.set(0, 1, 0)
    camera.rotation.set(0, 0, 0)
    rotation.current.set(0, 0, 0)

    const onKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true
          break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false
          break
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false
          break
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false
          break
      }
    }

    const onMouseDown = () => { isDragging.current = true }
    const onMouseUp = () => { isDragging.current = false }
    const onMouseMove = (e) => {
      if (isDragging.current && !currentArtwork) {
        rotation.current.y -= e.movementX * 0.003
        rotation.current.x -= e.movementY * 0.003
        rotation.current.x = Math.max(-0.4, Math.min(0.4, rotation.current.x))
        rotation.current.z = 0 // Absolute level
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [camera, currentArtwork])

  useFrame((state, delta) => {
    if (currentArtwork) return

    // Apply rotation
    camera.quaternion.setFromEuler(rotation.current)

    // Friction
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta

    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
    direction.current.normalize()

    const speed = 60.0
    if (moveForward.current || moveBackward.current) velocity.current.z -= direction.current.z * speed * delta
    if (moveLeft.current || moveRight.current) velocity.current.x += direction.current.x * speed * delta

    // Move camera relative to WORLD axes (Parallel movement)
    camera.position.z += velocity.current.z * delta
    camera.position.x += velocity.current.x * delta

    // Constrain Height (Walk on floor)
    camera.position.y = 4.5

    // -- COLLISION DETECTION --
    const pos = camera.position
    const wallLimit = 13.5 // Reduced for 30x30 room (Walls at 15, face at 14.5)

    // Wall Collisions
    if (pos.x < -wallLimit) pos.x = -wallLimit
    if (pos.x > wallLimit) pos.x = wallLimit
    if (pos.z < -wallLimit) pos.z = -wallLimit
    if (pos.z > wallLimit) pos.z = wallLimit

    // Obstacles: Just Columns if any (none now) or furniture
    const obstacles = []

    // Collision Resolution
    obstacles.forEach(obs => {
      const dx = pos.x - obs.x
      const dz = pos.z - obs.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < obs.r + 0.5) {
        const angle = Math.atan2(dz, dx)
        pos.x = obs.x + Math.cos(angle) * (obs.r + 0.5)
        pos.z = obs.z + Math.sin(angle) * (obs.r + 0.5)
      }
    })
  })

  return null
}

// Victorian Wall Sconce
function WallSconce({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Decorative Backplate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#98843E" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Curved Arm (Simplified as angled boxes) */}
      <group position={[0, 0.1, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial color="#98843E" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Light Holder Cup */}
      <mesh position={[0, -0.05, 0.3]}>
        <cylinderGeometry args={[0.1, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#98843E" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glowing Glass Shade */}
      <mesh position={[0, 0.15, 0.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffddaa" emissive="#ffddaa" emissiveIntensity={0.8} transparent opacity={0.9} roughness={0.1} />
        <pointLight intensity={0.8} distance={8} color="#ffddaa" decay={2} castShadow />
      </mesh>
    </group>
  )
}

function WallPanel({ position, rotation, args }) {
  const thickness = 0.08
  const depth = 0.05
  const color = "#98843E"

  return (
    <group position={position} rotation={rotation}>
      {/* Top */}
      <mesh position={[0, args[1] / 2, 0]}>
        <boxGeometry args={[args[0], thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -args[1] / 2, 0]}>
        <boxGeometry args={[args[0], thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left */}
      <mesh position={[-args[0] / 2, 0, 0]}>
        <boxGeometry args={[thickness, args[1], depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Right */}
      <mesh position={[args[0] / 2, 0, 0]}>
        <boxGeometry args={[thickness, args[1], depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Inner Detail Line (Double Border Effect) */}
      <group scale={[0.95, 0.95, 1]}>
        {/* Top Inner */}
        <mesh position={[0, args[1] / 2 - 0.2, 0]}>
          <boxGeometry args={[args[0] - 0.4, 0.02, 0.01]} />
          <meshStandardMaterial color={color} metalness={0.8} />
        </mesh>
        {/* Bottom Inner */}
        <mesh position={[0, -args[1] / 2 + 0.2, 0]}>
          <boxGeometry args={[args[0] - 0.4, 0.02, 0.01]} />
          <meshStandardMaterial color={color} metalness={0.8} />
        </mesh>
        {/* Left Inner */}
        <mesh position={[-args[0] / 2 + 0.2, 0, 0]}>
          <boxGeometry args={[0.02, args[1] - 0.4, 0.01]} />
          <meshStandardMaterial color={color} metalness={0.8} />
        </mesh>
        {/* Right Inner */}
        <mesh position={[args[0] / 2 - 0.2, 0, 0]}>
          <boxGeometry args={[0.02, args[1] - 0.4, 0.01]} />
          <meshStandardMaterial color={color} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
// Procedural Coffered Ceiling Components
function CeilingRosette() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} scale={2}>
      {/* Central Dome */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#98843E" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <mesh key={deg} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0.12, 0, 0]}>
          <coneGeometry args={[0.04, 0.25, 8]} />
          <meshStandardMaterial color="#98843E" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function CofferTile({ position, size = 3.75 }) {
  const beamHeight = 0.2
  const recessDepth = 0.4
  const wallThickness = 0.15 // Half of the beam width effectively

  // Colors
  const beamColor = "#FFFBF0" // Ivory to match walls
  const recessColor = "#EFE9D0" // Soft Parchment
  const gold = "#98843E"

  return (
    <group position={position}>
      {/* 1. Recessed Panel (Top) */}
      <mesh position={[0, recessDepth, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size - 0.2, size - 0.2]} />
        <meshStandardMaterial color={recessColor} side={THREE.DoubleSide} metalness={0.4} roughness={0.2} />
      </mesh>

      {/* 2. Beam Forms (The "Grid") */}
      {/* We form the grid by placing thick borders around each tile */}
      <group position={[0, beamHeight / 2, 0]}>
        {/* North */}
        <mesh position={[0, 0, -size / 2 + wallThickness / 2]}>
          <boxGeometry args={[size, beamHeight, wallThickness]} />
          <meshStandardMaterial color={beamColor} roughness={0.5} />
        </mesh>
        {/* South */}
        <mesh position={[0, 0, size / 2 - wallThickness / 2]}>
          <boxGeometry args={[size, beamHeight, wallThickness]} />
          <meshStandardMaterial color={beamColor} roughness={0.5} />
        </mesh>
        {/* East */}
        <mesh position={[size / 2 - wallThickness / 2, 0, 0]}>
          <boxGeometry args={[wallThickness, beamHeight, size - wallThickness * 2]} />
          <meshStandardMaterial color={beamColor} roughness={0.5} />
        </mesh>
        {/* West */}
        <mesh position={[-size / 2 + wallThickness / 2, 0, 0]}>
          <boxGeometry args={[wallThickness, beamHeight, size - wallThickness * 2]} />
          <meshStandardMaterial color={beamColor} roughness={0.5} />
        </mesh>
      </group>

      {/* 3. Inner Walls (Connecting Beams to Recess) */}
      <group position={[0, recessDepth / 2, 0]}>
        <mesh position={[0, 0, -size / 2 + wallThickness]} rotation={[0, 0, 0]}>
          <boxGeometry args={[size - wallThickness * 2, recessDepth, 0.05]} />
          <meshStandardMaterial color={beamColor} />
        </mesh>
        <mesh position={[0, 0, size / 2 - wallThickness]} rotation={[0, 0, 0]}>
          <boxGeometry args={[size - wallThickness * 2, recessDepth, 0.05]} />
          <meshStandardMaterial color={beamColor} />
        </mesh>
        <mesh position={[-size / 2 + wallThickness, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[size - wallThickness * 2, recessDepth, 0.05]} />
          <meshStandardMaterial color={beamColor} />
        </mesh>
        <mesh position={[size / 2 - wallThickness, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[size - wallThickness * 2, recessDepth, 0.05]} />
          <meshStandardMaterial color={beamColor} />
        </mesh>
      </group>

      {/* 4. Gold Inner Trim Square */}
      <group position={[0, recessDepth - 0.02, 0]}>
        <mesh position={[0, 0, -1]}> <boxGeometry args={[2, 0.02, 0.05]} /> <meshStandardMaterial color={gold} metalness={0.9} /> </mesh>
        <mesh position={[0, 0, 1]}> <boxGeometry args={[2, 0.02, 0.05]} /> <meshStandardMaterial color={gold} metalness={0.9} /> </mesh>
        <mesh position={[-1, 0, 0]}> <boxGeometry args={[0.05, 0.02, 2]} /> <meshStandardMaterial color={gold} metalness={0.9} /> </mesh>
        <mesh position={[1, 0, 0]}> <boxGeometry args={[0.05, 0.02, 2]} /> <meshStandardMaterial color={gold} metalness={0.9} /> </mesh>
      </group>

      {/* 5. Center Rosette */}
      <group position={[0, recessDepth - 0.05, 0]}>
        <CeilingRosette />
      </group>
    </group>
  )
}

function CofferedCeiling() {
  // Room is 30x30. 
  // 8x8 grid -> 3.75m per tile.
  const tiles = 8
  const roomSize = 30
  const tileSize = roomSize / tiles

  const positions = []
  for (let x = 0; x < tiles; x++) {
    for (let z = 0; z < tiles; z++) {
      const px = (x * tileSize) - (roomSize / 2) + (tileSize / 2)
      const pz = (z * tileSize) - (roomSize / 2) + (tileSize / 2)
      positions.push([px, 12, pz])
    }
  }

  return (
    <group>
      {positions.map((pos, i) => (
        <CofferTile key={i} position={pos} size={tileSize} />
      ))}
    </group>
  )
}

export default function GalleryScene() {
  const allArtworks = useStore((state) => state.artworks)
  const preferences = useStore((state) => state.preferences)

  const graniteTexture = useTexture('/src/assets/textures/granite.png')
  graniteTexture.wrapS = graniteTexture.wrapT = THREE.RepeatWrapping
  graniteTexture.repeat.set(6, 6)

  const damaskTexture = useTexture('/src/assets/textures/wall_damask.png')
  damaskTexture.wrapS = damaskTexture.wrapT = THREE.RepeatWrapping
  damaskTexture.repeat.set(4, 2) // Repeating across the 30x12m surface

  // Filter and sort based on preferences
  const userTags = (preferences.tags || []).map(t => t.toLowerCase())

  const artworks = [...allArtworks]
    .sort((a, b) => {
      // Calculate match score
      const aMatch = a.tags ? a.tags.filter(tag => userTags.includes(tag.toLowerCase())).length : 0
      const bMatch = b.tags ? b.tags.filter(tag => userTags.includes(tag.toLowerCase())).length : 0

      // Sort desc by match
      if (bMatch !== aMatch) return bMatch - aMatch

      // If tie, prioritize user uploaded
      if (b.isUserUploaded && !a.isUserUploaded) return 1
      if (a.isUserUploaded && !b.isUserUploaded) return -1

      return 0
    })
    .slice(0, 4)

  return (
    <>
      {/* Neutral Lighting - Brighter for Light Palette */}
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} color="#ffffff" />
      <Environment preset="apartment" />

      {/* Floor: Polished Granite */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={graniteTexture}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>

      {/* Ceiling: Coffered Grid */}
      <CofferedCeiling />

      {/* Walls: Warm Ivory with Roman Damask Texture */}
      <group>
        {/* Back Wall (Z = -15) */}
        <mesh position={[0, 6, -15]} receiveShadow>
          <boxGeometry args={[31, 12, 1]} />
          <meshStandardMaterial map={damaskTexture} color="#FFFBF0" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Front Wall (Z = 15) */}
        <mesh position={[0, 6, 15]} receiveShadow>
          <boxGeometry args={[31, 12, 1]} />
          <meshStandardMaterial map={damaskTexture} color="#FFFBF0" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Left Wall (X = -15) */}
        <mesh position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[31, 12, 1]} />
          <meshStandardMaterial map={damaskTexture} color="#FFFBF0" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Right Wall (X = 15) */}
        <mesh position={[15, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[31, 12, 1]} />
          <meshStandardMaterial map={damaskTexture} color="#FFFBF0" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Wainscoting / Chair Rail (Gold Strip at Y=2.5) */}
      <group position={[0, 2.5, 0]}>
        {/* Back */}
        <mesh position={[0, 0, -14.49]}>
          <boxGeometry args={[31, 0.2, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Front */}
        <mesh position={[0, 0, 14.49]}>
          <boxGeometry args={[31, 0.2, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Left */}
        <mesh position={[-14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 0.2, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Right */}
        <mesh position={[14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 0.2, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* Crown Molding (Gold Strip at Y=12) */}
      <group position={[0, 11.9, 0]}>
        {/* Back */}
        <mesh position={[0, 0, -14.49]}>
          <boxGeometry args={[31, 0.4, 0.3]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Front */}
        <mesh position={[0, 0, 14.49]}>
          <boxGeometry args={[31, 0.4, 0.3]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Left */}
        <mesh position={[-14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 0.4, 0.3]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
        {/* Right */}
        <mesh position={[14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 0.4, 0.3]} />
          <meshStandardMaterial color="#98843E" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* Decoration: Gold Wall Panels (Frames for Art) */}
      {/* Back Wall Frame */}
      <WallPanel position={[0, 6, -14.49]} rotation={[0, 0, 0]} args={[12, 6]} />
      {/* Front Wall Frame */}
      <WallPanel position={[0, 6, 14.49]} rotation={[0, 0, 0]} args={[12, 6]} />
      {/* Left Wall Frame */}
      <WallPanel position={[-14.49, 6, 0]} rotation={[0, Math.PI / 2, 0]} args={[12, 6]} />
      {/* Right Wall Frame */}
      <WallPanel position={[14.49, 6, 0]} rotation={[0, -Math.PI / 2, 0]} args={[12, 6]} />

      {/* Decoration: Wall Sconces (Lights) */}
      {/* Back Wall (Z=-14.49) */}
      <WallSconce position={[-9, 7, -14.49]} rotation={[0, 0, 0]} />
      <WallSconce position={[9, 7, -14.49]} rotation={[0, 0, 0]} />
      {/* Front Wall (Z=14.49) */}
      <WallSconce position={[-9, 7, 14.49]} rotation={[0, Math.PI, 0]} />
      <WallSconce position={[9, 7, 14.49]} rotation={[0, Math.PI, 0]} />
      {/* Left Wall (X=-14.49) */}
      <WallSconce position={[-14.49, 7, -9]} rotation={[0, Math.PI / 2, 0]} />
      <WallSconce position={[-14.49, 7, 9]} rotation={[0, Math.PI / 2, 0]} />
      {/* Right Wall (X=14.49) */}
      <WallSconce position={[14.49, 7, -9]} rotation={[0, -Math.PI / 2, 0]} />
      <WallSconce position={[14.49, 7, 9]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Baseboards (Gold strip at bottom) */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, 0, -14.49]}>
          <boxGeometry args={[31, 1, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 14.49]}>
          <boxGeometry args={[31, 1, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={0.6} />
        </mesh>
        <mesh position={[-14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 1, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={0.6} />
        </mesh>
        <mesh position={[14.49, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[31, 1, 0.1]} />
          <meshStandardMaterial color="#98843E" metalness={0.6} />
        </mesh>
      </group>

      {/* Artworks: Snapped to Walls */}
      {artworks.map((art, index) => {
        // Define Wall Slots
        const wallOffset = 14.4 // In front of WallPanel at 14.49
        const slots = [
          { pos: [0, 6, -wallOffset], rot: [0, 0, 0] },          // Back
          { pos: [wallOffset, 6, 0], rot: [0, -Math.PI / 2, 0] }, // Right
          { pos: [0, 6, wallOffset], rot: [0, Math.PI, 0] },      // Front
          { pos: [-wallOffset, 6, 0], rot: [0, Math.PI / 2, 0] }  // Left
        ]
        const slot = slots[index % 4]

        return (
          <group key={art.id}>
            <Artwork
              {...art}
              position={slot.pos}
              rotation={slot.rot}
            />
          </group>
        )
      })}

      <FPSControls artworks={artworks} />
    </>
  )
}
