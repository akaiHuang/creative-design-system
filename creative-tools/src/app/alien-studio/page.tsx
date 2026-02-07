'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Home, Settings, Play, Pause, RotateCcw, Download, Copy, Check, Layers } from 'lucide-react';
import * as THREE from 'three';

// 外星人像素矩陣定義 - 5種外星人
const ALIEN_MATRICES: Record<string, { frame1: number[][]; frame2: number[][] }> = {
  commander: {
    // COMMANDER (Crab) - 紫色
    frame1: [
      [0,0,1,0,0,0,0,0,1,0,0],
      [0,0,0,1,0,0,0,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [0,0,0,1,1,0,1,1,0,0,0],
    ],
    frame2: [
      [0,0,0,1,0,0,0,1,0,0,0],
      [0,0,1,0,0,0,0,0,1,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,0,0,0,0,0,1,0,0],
      [0,1,0,1,1,0,1,1,0,1,0],
    ],
  },
  invader: {
    // INVADER (Squid) - 青色
    frame1: [
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,0,1,1,0,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [1,1,0,0,0,1,0,0,0,1,1],
    ],
    frame2: [
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,0,1,1,0,0],
      [0,0,1,1,0,1,0,1,1,0,0],
      [0,0,0,1,1,0,1,1,0,0,0],
    ],
  },
  droid: {
    // DROID (Octopus) - 黃色
    frame1: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,0,0,1,1,0,0,0],
      [0,0,1,1,0,1,1,0,1,1,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,1],
    ],
    frame2: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,0,0,1,1,0,0],
      [0,1,0,0,1,1,1,1,0,0,1,0],
      [0,0,1,1,0,0,0,0,1,1,0,0],
    ],
  },
  mothership: {
    // MOTHERSHIP (UFO) - 紅色
    frame1: [
      [0,0,0,0,0,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,0,1,0,1,0,1,0,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    frame2: [
      [0,0,0,0,0,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,0,1,0,1,0,1,0,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,1,0,0,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ],
  },
  scout: {
    // SCOUT - 綠色
    frame1: [
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,0,1,1,1,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,1,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,1,0],
    ],
    frame2: [
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,0,1,1,1,1,0,1,0],
      [0,1,1,1,1,1,1,1,1,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,1,1,0,0,1,1,0,0],
    ],
  },
};

const ALIEN_COLORS: Record<string, string> = {
  commander: '#a855f7',  // 紫色
  invader: '#22d3ee',    // 青色
  droid: '#facc15',      // 黃色
  mothership: '#ef4444', // 紅色
  scout: '#22c55e',      // 綠色
};

const ALIEN_NAMES: Record<string, string> = {
  commander: 'COMMANDER',
  invader: 'INVADER',
  droid: 'DROID',
  mothership: 'MOTHERSHIP',
  scout: 'SCOUT',
};

// 2D 像素預覽組件（靜態）
function PixelPreview({ matrix, color, size = 44 }: { matrix: number[][]; color: string; size?: number }) {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const pixelSize = size / Math.max(rows, cols);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      {matrix.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: cell ? color : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// 2D 像素預覽組件（動畫版本）
function AnimatedPixelPreview({ 
  frames, 
  color, 
  size = 44,
  interval = 500 
}: { 
  frames: { frame1: number[][]; frame2: number[][] }; 
  color: string; 
  size?: number;
  interval?: number;
}) {
  const [currentFrame, setCurrentFrame] = useState<1 | 2>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((f) => (f === 1 ? 2 : 1));
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const matrix = currentFrame === 1 ? frames.frame1 : frames.frame2;
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const pixelSize = size / Math.max(rows, cols);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      {matrix.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: cell ? color : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface Config3D {
  depth: number;
  gap: number;
  rotationSpeed: number;
  floatAmplitude: number;
  floatSpeed: number;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
}

const DEFAULT_CONFIG: Config3D = {
  depth: 0.8,
  gap: 0.1,
  rotationSpeed: 0.5,
  floatAmplitude: 0.3,
  floatSpeed: 1.5,
  metalness: 0.3,
  roughness: 0.4,
  emissiveIntensity: 0.5,
};

// 3D 像素立方體外星人
function Pixel3DAlien({
  matrix,
  color,
  config,
  autoRotate,
  isAnimating,
}: {
  matrix: number[][];
  color: string;
  config: Config3D;
  autoRotate: boolean;
  isAnimating: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const cubeSize = 1;
  const gap = config.gap;
  const depth = config.depth;

  // 計算中心偏移
  const offsetX = (cols * (cubeSize + gap)) / 2 - (cubeSize + gap) / 2;
  const offsetY = (rows * (cubeSize + gap)) / 2 - (cubeSize + gap) / 2;

  useFrame((state) => {
    if (!groupRef.current) return;

    // 自動旋轉
    if (autoRotate) {
      groupRef.current.rotation.y += config.rotationSpeed * 0.01;
    }

    // 浮動動畫
    if (isAnimating) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * config.floatSpeed) * config.floatAmplitude;
    }
  });

  const colorObj = new THREE.Color(color);

  return (
    <group ref={groupRef}>
      {matrix.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;
          return (
            <mesh
              key={`${y}-${x}`}
              position={[
                x * (cubeSize + gap) - offsetX,
                -(y * (cubeSize + gap) - offsetY),
                0,
              ]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[cubeSize, cubeSize, depth]} />
              <meshStandardMaterial
                color={color}
                metalness={config.metalness}
                roughness={config.roughness}
                emissive={colorObj}
                emissiveIntensity={config.emissiveIntensity}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// 3D 場景
function Scene({
  matrix,
  color,
  config,
  autoRotate,
  isAnimating,
}: {
  matrix: number[][];
  color: string;
  config: Config3D;
  autoRotate: boolean;
  isAnimating: boolean;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* 環境光 */}
      <ambientLight intensity={0.4} />
      
      {/* 主光源 */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* 補光 */}
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#ff4488" />
      
      {/* 外星人 */}
      <Pixel3DAlien
        matrix={matrix}
        color={color}
        config={config}
        autoRotate={autoRotate}
        isAnimating={isAnimating}
      />
    </>
  );
}

export default function AlienStudioPage() {
  const [selectedAlien, setSelectedAlien] = useState('commander');
  const [config, setConfig] = useState<Config3D>(DEFAULT_CONFIG);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentFrame, setCurrentFrame] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  // 動畫幀切換
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setCurrentFrame((f) => (f === 1 ? 2 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const matrix = currentFrame === 1 
    ? ALIEN_MATRICES[selectedAlien].frame1 
    : ALIEN_MATRICES[selectedAlien].frame2;
  const color = ALIEN_COLORS[selectedAlien];

  const updateConfig = (key: keyof Config3D, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleCopy = async () => {
    const exportData = {
      alienId: selectedAlien,
      config,
      matrix: ALIEN_MATRICES[selectedAlien],
      color: ALIEN_COLORS[selectedAlien],
    };
    await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const exportData = {
      alienId: selectedAlien,
      config,
      matrix: ALIEN_MATRICES[selectedAlien],
      color: ALIEN_COLORS[selectedAlien],
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAlien}-3d-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400">3D ALIEN</span>
              <span className="text-white">STUDIO</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 border text-sm flex items-center gap-2 transition-colors ${
                copied 
                  ? 'border-green-500 text-green-400 bg-green-500/10' 
                  : 'border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              EXPORT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左側：外星人選擇 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              SELECT ALIEN
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(ALIEN_MATRICES).map((alienId) => (
                <button
                  key={alienId}
                  onClick={() => setSelectedAlien(alienId)}
                  className={`p-3 border rounded-lg transition-all ${
                    selectedAlien === alienId
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <AnimatedPixelPreview
                      frames={ALIEN_MATRICES[alienId]}
                      color={ALIEN_COLORS[alienId]}
                      size={44}
                      interval={500}
                    />
                    <span className="text-xs">{ALIEN_NAMES[alienId]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 動畫控制 */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-4">ANIMATION</h2>
            <div className="space-y-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`w-full py-2 border rounded flex items-center justify-center gap-2 ${
                  autoRotate ? 'border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-400'
                }`}
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {autoRotate ? 'STOP ROTATE' : 'AUTO ROTATE'}
              </button>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`w-full py-2 border rounded flex items-center justify-center gap-2 ${
                  isAnimating ? 'border-green-500 text-green-400' : 'border-gray-700 text-gray-400'
                }`}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? 'STOP ANIMATE' : 'ANIMATE'}
              </button>
              <button
                onClick={handleReset}
                className="w-full py-2 border border-gray-700 text-gray-400 hover:border-gray-500 rounded flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* 中間：3D 預覽 */}
        <div className="lg:col-span-2">
          <div className="border border-gray-800 bg-gray-900/50 rounded-lg overflow-hidden aspect-square">
            <Canvas shadows>
              <Suspense fallback={null}>
                <Scene
                  matrix={matrix}
                  color={color}
                  config={config}
                  autoRotate={autoRotate}
                  isAnimating={isAnimating}
                />
              </Suspense>
            </Canvas>
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            🖱️ 拖曳旋轉 | 滾輪縮放 | 右鍵平移
          </div>
        </div>

        {/* 右側：參數控制 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-4">3D PARAMETERS</h2>
            
            {/* Depth */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">CUBE DEPTH</span>
                <span className="text-cyan-400">{config.depth.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={config.depth}
                onChange={(e) => updateConfig('depth', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Gap */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">PIXEL GAP</span>
                <span className="text-cyan-400">{config.gap.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.02"
                value={config.gap}
                onChange={(e) => updateConfig('gap', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Rotation Speed */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">ROTATION SPEED</span>
                <span className="text-cyan-400">{config.rotationSpeed.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.rotationSpeed}
                onChange={(e) => updateConfig('rotationSpeed', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Float Amplitude */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">FLOAT AMPLITUDE</span>
                <span className="text-cyan-400">{config.floatAmplitude.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.floatAmplitude}
                onChange={(e) => updateConfig('floatAmplitude', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Metalness */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">METALNESS</span>
                <span className="text-cyan-400">{config.metalness.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.metalness}
                onChange={(e) => updateConfig('metalness', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Roughness */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">ROUGHNESS</span>
                <span className="text-cyan-400">{config.roughness.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.roughness}
                onChange={(e) => updateConfig('roughness', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Emissive */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">GLOW INTENSITY</span>
                <span className="text-cyan-400">{config.emissiveIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.emissiveIntensity}
                onChange={(e) => updateConfig('emissiveIntensity', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* 預設樣式 */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-4">PRESETS</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  updateConfig('depth', 0.3);
                  updateConfig('gap', 0.05);
                }}
                className="py-2 text-xs border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 rounded"
              >
                FLAT
              </button>
              <button
                onClick={() => {
                  updateConfig('depth', 1.5);
                  updateConfig('gap', 0.15);
                }}
                className="py-2 text-xs border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 rounded"
              >
                THICK
              </button>
              <button
                onClick={() => {
                  updateConfig('metalness', 0.8);
                  updateConfig('roughness', 0.2);
                  updateConfig('emissiveIntensity', 0.3);
                }}
                className="py-2 text-xs border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 rounded"
              >
                METALLIC
              </button>
              <button
                onClick={() => {
                  updateConfig('metalness', 0);
                  updateConfig('roughness', 1);
                  updateConfig('emissiveIntensity', 0.8);
                }}
                className="py-2 text-xs border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 rounded"
              >
                NEON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-600">
          Creative Tools - 3D Alien Studio | 每個像素都是 3D 立方體
        </div>
      </footer>
    </div>
  );
}
