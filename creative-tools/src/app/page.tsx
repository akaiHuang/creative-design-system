'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Grid3X3, Type, Box, Layers } from 'lucide-react';

// 外星人像素矩陣 - 用於動態 Logo (Commander/Crab 造型)
const LOGO_ALIEN = {
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
};

// 動畫像素 Logo
function AnimatedLogo() {
  const [frame, setFrame] = useState<1 | 2>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f === 1 ? 2 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const matrix = frame === 1 ? LOGO_ALIEN.frame1 : LOGO_ALIEN.frame2;
  const pixelSize = 4;

  return (
    <div className="flex flex-col">
      {matrix.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: cell ? '#00FF99' : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const tools = [
  {
    id: '8bit',
    name: '8-BIT_CONVERTER',
    nameZh: '8-BIT 像素轉換器',
    description: '將圖片轉換為復古 8-bit 像素風格',
    icon: Grid3X3,
    color: '#22c55e',
    status: 'ONLINE',
    href: '/8bit',
  },
  {
    id: '8bit-editor',
    name: '8-BIT_EDITOR',
    nameZh: '8-BIT 像素編輯器',
    description: '8-bit 風格像素精靈圖編輯器',
    icon: Layers,
    color: '#facc15',
    status: 'ONLINE',
    href: '/pixel-editor',
  },
  {
    id: 'alien',
    name: 'ALIEN_3D_STUDIO',
    nameZh: '3D 外星人工作室',
    description: '3D 立方體外星人模型編輯器',
    icon: Box,
    color: '#22d3ee',
    status: 'ONLINE',
    href: '/alien-studio',
  },
  {
    id: 'ascii',
    name: 'ASCII_ART',
    nameZh: 'ASCII 藝術轉換器',
    description: '將圖片轉換為彩色 ASCII 字元藝術',
    icon: Type,
    color: '#a855f7',
    status: 'ONLINE',
    href: '/ascii-art',
  },
];

export default function HomePage() {
  const [systemTime, setSystemTime] = useState('--:--:--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Scanline overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.5))',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Header */}
      <header className="border-b border-[#222] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <AnimatedLogo />
              <div>
                <h1 className="text-xl tracking-wider flex items-center gap-2">
                  <span className="text-[#00FF99]">FAW</span>
                  <span className="text-white">CREATIVE</span>
                  <span className="text-gray-500">STUDIO</span>
                </h1>
                <p className="text-[10px] text-gray-600 tracking-widest">
                  [ VISUAL_TOOLS_COLLECTION ]
                </p>
              </div>
            </div>

            {/* Status Bar */}
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                <span>SYS_TIME:</span>
                <span className="text-[#00FF99]">{systemTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-[#00FF99]">●</span>
                <span>STATUS:</span>
                <span className="text-[#00FF99]">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-[#FF004D] text-xs tracking-widest mb-2">
            [ SECTOR_A: TOOLS ]
          </h2>
          <p className="text-2xl text-white tracking-wide">
            SELECT_MODULE
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative bg-[#0A0A0A] border border-[#222] p-6 transition-all duration-200 hover:border-[#444] hover:bg-[#111]"
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333] group-hover:border-[#00FF99] transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333] group-hover:border-[#00FF99] transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333] group-hover:border-[#00FF99] transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333] group-hover:border-[#00FF99] transition-colors" />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="p-3 border border-[#333] bg-[#111] group-hover:border-[#444] transition-colors"
                    style={{ borderColor: tool.color + '30' }}
                  >
                    <IconComponent 
                      className="w-6 h-6 transition-colors" 
                      style={{ color: tool.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm text-white group-hover:text-[#00FF99] transition-colors tracking-wide">
                        {tool.name}
                      </h3>
                      <span 
                        className="text-[10px] px-1 bg-opacity-20"
                        style={{ 
                          backgroundColor: tool.color + '20',
                          color: tool.color,
                        }}
                      >
                        {tool.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {tool.nameZh}
                    </p>
                    <p className="text-xs text-gray-600">
                      {tool.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-600 group-hover:text-[#00FF99] transition-colors">
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-12 border border-[#222] bg-[#0A0A0A] p-6 relative">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

          <h3 className="text-[#FF004D] text-xs tracking-widest mb-4">
            [ SYSTEM_INFO ]
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="border-b border-[#222] pb-3 md:border-b-0 md:border-r md:pr-6 md:pb-0">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">MODULES_LOADED</span>
                <span className="text-[#00FF99]">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">STATUS</span>
                <span className="text-[#00FF99]">ALL_ONLINE</span>
              </div>
            </div>
            
            <div className="border-b border-[#222] pb-3 md:border-b-0 md:border-r md:pr-6 md:pb-0">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">FRAMEWORK</span>
                <span className="text-white">NEXT.JS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RENDER_ENGINE</span>
                <span className="text-white">THREE.JS</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">VERSION</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BUILD</span>
                <span className="text-gray-500">2026.01.30</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222] mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[10px] text-gray-600">
          <div className="flex items-center gap-4">
            <span>FAW_CREATIVE_STUDIO</span>
            <span className="text-[#333]">|</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-[#00FF99]">●</span>
            <span>SYSTEM_OPTIMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
