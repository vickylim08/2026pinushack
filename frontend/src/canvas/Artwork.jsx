import { useRef, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useStore } from '../store/useStore'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'

export default function Artwork({ position, rotation, url, id, title, description, audio, ...props }) {
  const texture = useTexture(url)
  const [hovered, setHover] = useState(false)
  const setCurrentArtwork = useStore((state) => state.setCurrentArtwork)
  const mesh = useRef()

  useCursor(hovered)

  // Calculate dynamic dimensions based on image aspect ratio
  // Target Height: 3.5m (Slightly smaller than 4 to fit better)
  const canvasHeight = 3.5
  const aspect = texture.image ? (texture.image.width / texture.image.height) : 1.5
  const canvasWidth = canvasHeight * aspect

  // Frame Sizing
  // Canvas = Base
  // Inner Frame: Immediately around canvas. Thin, high.
  // Outer Frame: Around inner. Wide, lower.

  return (
    <group position={position} rotation={rotation}>

      {/* Individual Spotlight for Drama */}
      <spotLight
        position={[0, 5, 5]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.4}
        intensity={4}
        castShadow
      />

      {/* ORNATE FRAME CONSTRUCTION */}
      <group position={[0, 0, -0.05]}>
        {/* Helper to create a rectangular border */}
        {(() => {
          const CreateBorder = ({ w, h, thickness, depth, offsetZ }) => (
            <group position={[0, 0, offsetZ]}>
              {/* Top */}
              <mesh position={[0, h / 2 + thickness / 2, 0]} castShadow>
                <boxGeometry args={[w + thickness * 2, thickness, depth]} />
                <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Bottom */}
              <mesh position={[0, -(h / 2 + thickness / 2), 0]} castShadow>
                <boxGeometry args={[w + thickness * 2, thickness, depth]} />
                <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Left */}
              <mesh position={[-(w / 2 + thickness / 2), 0, 0]} castShadow>
                <boxGeometry args={[thickness, h, depth]} />
                <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Right */}
              <mesh position={[w / 2 + thickness / 2, 0, 0]} castShadow>
                <boxGeometry args={[thickness, h, depth]} />
                <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
              </mesh>
            </group>
          )

          return (
            <>
              {/* Layer 1: Inner Lip (Closest to Art) - Thin, protrudes forward */}
              <CreateBorder w={canvasWidth} h={canvasHeight} thickness={0.1} depth={0.15} offsetZ={0.05} />

              {/* Layer 2: Main Body - Mid width, Mid depth */}
              <CreateBorder w={canvasWidth + 0.2} h={canvasHeight + 0.2} thickness={0.2} depth={0.1} offsetZ={0} />

              {/* Layer 3: Outer Edge - Wide, recessed */}
              <CreateBorder w={canvasWidth + 0.6} h={canvasHeight + 0.6} thickness={0.1} depth={0.05} offsetZ={-0.05} />

              {/* Backing Plate to close gaps */}
              <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[canvasWidth + 1, canvasHeight + 1]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            </>
          )
        })()}
      </group>

      {/* Canvas - Sits inside the Inner Lip */}
      <mesh
        ref={mesh}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          console.log('Clicked artwork:', id)
          e.stopPropagation()
          setCurrentArtwork({ id, title, description, audio, url, ...props })
        }}
        position={[0, 0, 0.02]} // Slightly forward
      >
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>

      {/* Interactive Highlight */}
      <mesh visible={hovered} position={[0, 0, 0.03]} raycast={() => null}>
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>

      {/* Modern Plaque: Frosted Glass Style */}
      <group position={[3.5, -1.5, 0]} rotation={[0, 0, 0]}>
        {/* Glass Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.02]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.6}
            opacity={1}
            roughness={0.2}
            thickness={0.1}
          />
        </mesh>

        {/* Metal Standoffs */}
        <mesh position={[-0.35, 0.15, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03]} />
          <meshStandardMaterial color="#888" metalness={1} />
        </mesh>
        <mesh position={[0.35, 0.15, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03]} />
          <meshStandardMaterial color="#888" metalness={1} />
        </mesh>
        <mesh position={[-0.35, -0.15, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03]} />
          <meshStandardMaterial color="#888" metalness={1} />
        </mesh>
        <mesh position={[0.35, -0.15, 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03]} />
          <meshStandardMaterial color="#888" metalness={1} />
        </mesh>

        {/* Info Lines */}
        <mesh position={[-0.1, 0.05, 0.02]}>
          <planeGeometry args={[0.4, 0.03]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[-0.05, -0.05, 0.02]}>
          <planeGeometry args={[0.5, 0.02]} />
          <meshBasicMaterial color="#555" />
        </mesh>
      </group>
    </group>
  )
}
