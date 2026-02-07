'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Home, Download, Copy, Check, Type, PenTool, ImageIcon } from 'lucide-react';

// Pixel font definition - each character is 5x7 pixels
const PIXEL_FONT: Record<string, number[][]> = {
  'A': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'B': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  'C': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'D': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  'E': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'F': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'G': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'H': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'I': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  'J': [
    [0,0,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [0,1,1,0,0],
  ],
  'K': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  'L': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'O': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  'Q': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,0],
    [0,1,1,0,1],
  ],
  'R': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  'S': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'U': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  'V': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
  ],
  'X': [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
  ],
  'Y': [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'Z': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  '0': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
  ],
  '2': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  '3': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  '4': [
    [0,0,0,1,0],
    [0,0,1,1,0],
    [0,1,0,1,0],
    [1,0,0,1,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0],
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  '6': [
    [0,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  '8': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  '9': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,1,1,1,0],
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  '!': [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
  ],
  '_': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1],
  ],
  '-': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  '.': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
  ],
};

// Pixel text style presets
const PIXEL_STYLES = {
  solid: { name: 'SOLID', outline: false, shadow: false },
  outline: { name: 'OUTLINE', outline: true, shadow: false },
  shadow: { name: 'SHADOW', outline: false, shadow: true },
  retro: { name: 'RETRO', outline: true, shadow: true },
};

// Big ASCII Banner Font (6 lines height, Unicode Box Drawing style)
const BIG_FONT: Record<string, string[]> = {
  'A': [
    ' █████╗ ',
    '██╔══██╗',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  'B': [
    '██████╗ ',
    '██╔══██╗',
    '██████╔╝',
    '██╔══██╗',
    '██████╔╝',
    '╚═════╝ ',
  ],
  'C': [
    ' ██████╗',
    '██╔════╝',
    '██║     ',
    '██║     ',
    '╚██████╗',
    ' ╚═════╝',
  ],
  'D': [
    '██████╗ ',
    '██╔══██╗',
    '██║  ██║',
    '██║  ██║',
    '██████╔╝',
    '╚═════╝ ',
  ],
  'E': [
    '███████╗',
    '██╔════╝',
    '█████╗  ',
    '██╔══╝  ',
    '███████╗',
    '╚══════╝',
  ],
  'F': [
    '███████╗',
    '██╔════╝',
    '█████╗  ',
    '██╔══╝  ',
    '██║     ',
    '╚═╝     ',
  ],
  'G': [
    ' ██████╗ ',
    '██╔════╝ ',
    '██║  ███╗',
    '██║   ██║',
    '╚██████╔╝',
    ' ╚═════╝ ',
  ],
  'H': [
    '██╗  ██╗',
    '██║  ██║',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  'I': [
    '██╗',
    '██║',
    '██║',
    '██║',
    '██║',
    '╚═╝',
  ],
  'J': [
    '     ██╗',
    '     ██║',
    '     ██║',
    '██   ██║',
    '╚█████╔╝',
    ' ╚════╝ ',
  ],
  'K': [
    '██╗  ██╗',
    '██║ ██╔╝',
    '█████╔╝ ',
    '██╔═██╗ ',
    '██║  ██╗',
    '╚═╝  ╚═╝',
  ],
  'L': [
    '██╗     ',
    '██║     ',
    '██║     ',
    '██║     ',
    '███████╗',
    '╚══════╝',
  ],
  'M': [
    '███╗   ███╗',
    '████╗ ████║',
    '██╔████╔██║',
    '██║╚██╔╝██║',
    '██║ ╚═╝ ██║',
    '╚═╝     ╚═╝',
  ],
  'N': [
    '███╗   ██╗',
    '████╗  ██║',
    '██╔██╗ ██║',
    '██║╚██╗██║',
    '██║ ╚████║',
    '╚═╝  ╚═══╝',
  ],
  'O': [
    ' ██████╗ ',
    '██╔═══██╗',
    '██║   ██║',
    '██║   ██║',
    '╚██████╔╝',
    ' ╚═════╝ ',
  ],
  'P': [
    '██████╗ ',
    '██╔══██╗',
    '██████╔╝',
    '██╔═══╝ ',
    '██║     ',
    '╚═╝     ',
  ],
  'Q': [
    ' ██████╗ ',
    '██╔═══██╗',
    '██║   ██║',
    '██║▄▄ ██║',
    '╚██████╔╝',
    ' ╚══▀▀═╝ ',
  ],
  'R': [
    '██████╗ ',
    '██╔══██╗',
    '██████╔╝',
    '██╔══██╗',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  'S': [
    '███████╗',
    '██╔════╝',
    '███████╗',
    '╚════██║',
    '███████║',
    '╚══════╝',
  ],
  'T': [
    '████████╗',
    '╚══██╔══╝',
    '   ██║   ',
    '   ██║   ',
    '   ██║   ',
    '   ╚═╝   ',
  ],
  'U': [
    '██╗   ██╗',
    '██║   ██║',
    '██║   ██║',
    '██║   ██║',
    '╚██████╔╝',
    ' ╚═════╝ ',
  ],
  'V': [
    '██╗   ██╗',
    '██║   ██║',
    '██║   ██║',
    '╚██╗ ██╔╝',
    ' ╚████╔╝ ',
    '  ╚═══╝  ',
  ],
  'W': [
    '██╗    ██╗',
    '██║    ██║',
    '██║ █╗ ██║',
    '██║███╗██║',
    '╚███╔███╔╝',
    ' ╚══╝╚══╝ ',
  ],
  'X': [
    '██╗  ██╗',
    '╚██╗██╔╝',
    ' ╚███╔╝ ',
    ' ██╔██╗ ',
    '██╔╝ ██╗',
    '╚═╝  ╚═╝',
  ],
  'Y': [
    '██╗   ██╗',
    '╚██╗ ██╔╝',
    ' ╚████╔╝ ',
    '  ╚██╔╝  ',
    '   ██║   ',
    '   ╚═╝   ',
  ],
  'Z': [
    '███████╗',
    '╚══███╔╝',
    '  ███╔╝ ',
    ' ███╔╝  ',
    '███████╗',
    '╚══════╝',
  ],
  '0': [
    ' ██████╗ ',
    '██╔═████╗',
    '██║██╔██║',
    '████╔╝██║',
    '╚██████╔╝',
    ' ╚═════╝ ',
  ],
  '1': [
    ' ██╗',
    '███║',
    '╚██║',
    ' ██║',
    ' ██║',
    ' ╚═╝',
  ],
  '2': [
    '██████╗ ',
    '╚════██╗',
    ' █████╔╝',
    '██╔═══╝ ',
    '███████╗',
    '╚══════╝',
  ],
  '3': [
    '██████╗ ',
    '╚════██╗',
    ' █████╔╝',
    ' ╚═══██╗',
    '██████╔╝',
    '╚═════╝ ',
  ],
  '4': [
    '██╗  ██╗',
    '██║  ██║',
    '███████║',
    '╚════██║',
    '     ██║',
    '     ╚═╝',
  ],
  '5': [
    '███████╗',
    '██╔════╝',
    '███████╗',
    '╚════██║',
    '███████║',
    '╚══════╝',
  ],
  '6': [
    ' ██████╗',
    '██╔════╝',
    '███████╗',
    '██╔═══██╗',
    '╚██████╔╝',
    ' ╚═════╝ ',
  ],
  '7': [
    '███████╗',
    '╚════██║',
    '    ██╔╝',
    '   ██╔╝ ',
    '   ██║  ',
    '   ╚═╝  ',
  ],
  '8': [
    ' █████╗ ',
    '██╔══██╗',
    '╚█████╔╝',
    '██╔══██╗',
    '╚█████╔╝',
    ' ╚════╝ ',
  ],
  '9': [
    ' █████╗ ',
    '██╔══██╗',
    '╚██████║',
    ' ╚═══██║',
    ' █████╔╝',
    ' ╚════╝ ',
  ],
  ' ': [
    '   ',
    '   ',
    '   ',
    '   ',
    '   ',
    '   ',
  ],
  '!': [
    '██╗',
    '██║',
    '██║',
    '╚═╝',
    '██╗',
    '╚═╝',
  ],
  '-': [
    '      ',
    '      ',
    '█████╗',
    '╚════╝',
    '      ',
    '      ',
  ],
  '_': [
    '        ',
    '        ',
    '        ',
    '        ',
    '███████╗',
    '╚══════╝',
  ],
  '.': [
    '   ',
    '   ',
    '   ',
    '   ',
    '██╗',
    '╚═╝',
  ],
};

const charSets = {
  standard: '@%#*+=-:. '.split('').reverse(),
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '.split('').reverse(),
  blocks: '█▓▒░ '.split('').reverse(),
  blocks_fine: '█▉▊▋▌▍▎▏ '.split('').reverse(),
  blocks_double: '██▓▓▒▒░░  '.split('').reverse(),
  pixel: '⣿⣷⣯⣟⡿⢿⣻⣽⣾⣶⣦⣤⣀ '.split('').reverse(),
  simple: '#. '.split('').reverse(),
};

export default function AsciiArtPage() {
  const [mode, setMode] = useState<'ascii' | 'pixeltext' | 'pixelimage' | 'banner'>('ascii');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('AWAITING_INPUT...');
  const [outputWidth, setOutputWidth] = useState(200);
  const [charSet, setCharSet] = useState<keyof typeof charSets>('standard');
  const [fontSize, setFontSize] = useState(6);
  const [asciiHtml, setAsciiHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [preciseMode, setPreciseMode] = useState(false); // 精確模式：1像素=1字元
  
  // JSON input states
  const [jsonData, setJsonData] = useState<{width: number; height: number; pixels: string[][]} | null>(null);
  const [inputType, setInputType] = useState<'image' | 'json'>('image');
  
  // Pixel text states
  const [pixelText, setPixelText] = useState('HELLO');
  const [pixelColor, setPixelColor] = useState('#4A63D9');
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [pixelScale, setPixelScale] = useState(8);
  const [pixelStyle, setPixelStyle] = useState<keyof typeof PIXEL_STYLES>('solid');
  
  // Pixel image states
  const [pixelImageFile, setPixelImageFile] = useState<HTMLImageElement | null>(null);
  const [pixelImageFileName, setPixelImageFileName] = useState('AWAITING_INPUT...');
  const [pixelImageSize, setPixelImageSize] = useState(64); // Output width in pixels
  const [pixelImageScale, setPixelImageScale] = useState(8); // Display scale
  const [pixelImageColors, setPixelImageColors] = useState(16); // Color palette size
  const [pixelImageBg, setPixelImageBg] = useState('#1a1a2e');
  
  // ASCII Banner states
  const [bannerText, setBannerText] = useState('HELLO');
  const [bannerColor, setBannerColor] = useState('#1c4bb4');
  const [bannerBright, setBannerBright] = useState(true);
  const [bannerOutput, setBannerOutput] = useState('');
  const [bannerImage, setBannerImage] = useState<HTMLImageElement | null>(null);
  const [bannerImageName, setBannerImageName] = useState('');
  const [bannerImageWidth, setBannerImageWidth] = useState(40);
  const [bannerLayout, setBannerLayout] = useState<'text-only' | 'image-left' | 'image-right' | 'image-top' | 'image-bottom'>('text-only');
  const [showOutline, setShowOutline] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const bannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setInputType('image');
    setJsonData(null); // Clear JSON when using image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.type === '8bit-pixel-data' && data.pixels) {
          setJsonData({
            width: data.width,
            height: data.height,
            pixels: data.pixels
          });
          setInputType('json');
          setImage(null); // Clear image when using JSON
        } else {
          alert('Invalid JSON format. Please use JSON exported from 8bit converter.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePixelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPixelImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setPixelImageFile(img);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Convert JSON data to ASCII
  const convertJsonToAscii = useCallback(() => {
    if (!jsonData) return;
    
    const chars = charSets[charSet];
    const { width, height, pixels } = jsonData;
    
    // Calculate scaling to match outputWidth
    const scale = Math.max(1, Math.floor(outputWidth / width));
    
    let html = '';
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const hexColor = pixels[y]?.[x] || '#000000';
        // Parse hex color
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const charIndex = Math.floor(brightness * (chars.length - 1));
        const char = chars[charIndex] === ' ' ? '&nbsp;' : chars[charIndex];
        
        // Repeat character for scale
        for (let s = 0; s < scale; s++) {
          html += `<span style="color: ${hexColor}">${char}</span>`;
        }
      }
      html += '<br>';
    }
    
    setAsciiHtml(html);
  }, [jsonData, outputWidth, charSet]);

  const convertToAscii = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const chars = charSets[charSet];

    // 精確模式：使用原圖尺寸，否則使用 outputWidth 縮放
    const width = preciseMode ? image.width : outputWidth;
    const aspectRatio = image.height / image.width;
    const height = preciseMode 
      ? Math.floor(image.height * 0.5) // 字元高度是寬度的 2 倍，所以要除以 2
      : Math.floor(width * aspectRatio * 0.5);

    canvas.width = width;
    canvas.height = preciseMode ? image.height : height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let html = '';
    
    // 精確模式下，每 2 行像素合併為 1 行字元（因為字元是高的）
    const stepY = preciseMode ? 2 : 1;
    const outputHeight = preciseMode ? Math.floor(canvas.height / stepY) : height;

    for (let y = 0; y < outputHeight; y++) {
      for (let x = 0; x < width; x++) {
        const srcY = preciseMode ? y * stepY : y;
        const i = (srcY * canvas.width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const charIndex = Math.floor(brightness * (chars.length - 1));
        const char = chars[charIndex] === ' ' ? '&nbsp;' : chars[charIndex];

        if (a < 128) {
          html += '<span>&nbsp;</span>';
        } else {
          html += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
        }
      }
      html += '<br>';
    }

    setAsciiHtml(html);
  }, [image, outputWidth, charSet, preciseMode]);

  // Render pixel text
  const renderPixelText = useCallback(() => {
    if (!pixelCanvasRef.current) return;
    
    const canvas = pixelCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const text = pixelText.toUpperCase();
    const style = PIXEL_STYLES[pixelStyle];
    
    // Calculate dimensions
    const charWidth = 5;
    const charHeight = 7;
    const spacing = 1;
    const padding = 2;
    
    const totalWidth = text.length * (charWidth + spacing) - spacing + padding * 2;
    const totalHeight = charHeight + padding * 2;
    
    canvas.width = totalWidth * pixelScale;
    canvas.height = totalHeight * pixelScale;
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Helper to draw a pixel
    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        (x + padding) * pixelScale,
        (y + padding) * pixelScale,
        pixelScale - 1,
        pixelScale - 1
      );
    };
    
    // Helper to darken color for shadow
    const darkenColor = (hex: string, amount: number = 0.5) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgb(${Math.floor(r * amount)}, ${Math.floor(g * amount)}, ${Math.floor(b * amount)})`;
    };
    
    // Draw shadow layer first
    if (style.shadow) {
      let xOffset = 0;
      for (const char of text) {
        const charData = PIXEL_FONT[char] || PIXEL_FONT[' '];
        for (let y = 0; y < charHeight; y++) {
          for (let x = 0; x < charWidth; x++) {
            if (charData[y][x] === 1) {
              drawPixel(xOffset + x + 1, y + 1, darkenColor(pixelColor, 0.3));
            }
          }
        }
        xOffset += charWidth + spacing;
      }
    }
    
    // Draw outline layer
    if (style.outline) {
      let xOffset = 0;
      for (const char of text) {
        const charData = PIXEL_FONT[char] || PIXEL_FONT[' '];
        for (let y = 0; y < charHeight; y++) {
          for (let x = 0; x < charWidth; x++) {
            if (charData[y][x] === 1) {
              // Draw outline pixels around
              const outlineColor = darkenColor(pixelColor, 0.4);
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (dx !== 0 || dy !== 0) {
                    drawPixel(xOffset + x + dx, y + dy, outlineColor);
                  }
                }
              }
            }
          }
        }
        xOffset += charWidth + spacing;
      }
    }
    
    // Draw main text
    let xOffset = 0;
    for (const char of text) {
      const charData = PIXEL_FONT[char] || PIXEL_FONT[' '];
      for (let y = 0; y < charHeight; y++) {
        for (let x = 0; x < charWidth; x++) {
          if (charData[y][x] === 1) {
            drawPixel(xOffset + x, y, pixelColor);
          }
        }
      }
      xOffset += charWidth + spacing;
    }
  }, [pixelText, pixelColor, bgColor, pixelScale, pixelStyle]);

  // Render pixel image - convert image to pixel art style
  const renderPixelImage = useCallback(() => {
    if (!pixelImageFile || !pixelImageCanvasRef.current) return;
    
    const canvas = pixelImageCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Calculate dimensions maintaining aspect ratio
    const aspectRatio = pixelImageFile.height / pixelImageFile.width;
    const width = pixelImageSize;
    const height = Math.round(width * aspectRatio);
    
    // Create temp canvas for downscaling
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Draw downscaled image
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(pixelImageFile, 0, 0, width, height);
    
    // Get pixel data
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    // Extract color palette using k-means like approach
    const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
    for (let i = 0; i < pixels.length; i += 4) {
      const r = Math.round(pixels[i] / 16) * 16;
      const g = Math.round(pixels[i + 1] / 16) * 16;
      const b = Math.round(pixels[i + 2] / 16) * 16;
      const a = pixels[i + 3];
      if (a < 128) continue; // Skip transparent
      const key = `${r},${g},${b}`;
      if (colorMap.has(key)) {
        colorMap.get(key)!.count++;
      } else {
        colorMap.set(key, { r, g, b, count: 1 });
      }
    }
    
    // Get top colors for palette
    const palette = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, pixelImageColors)
      .map(c => [c.r, c.g, c.b]);
    
    // Find closest palette color
    const findClosest = (r: number, g: number, b: number): number[] => {
      let minDist = Infinity;
      let closest = palette[0] || [0, 0, 0];
      for (const color of palette) {
        const dist = Math.pow(r - color[0], 2) + Math.pow(g - color[1], 2) + Math.pow(b - color[2], 2);
        if (dist < minDist) {
          minDist = dist;
          closest = color;
        }
      }
      return closest;
    };
    
    // Set canvas size with scale and padding
    const padding = 2;
    canvas.width = (width + padding * 2) * pixelImageScale;
    canvas.height = (height + padding * 2) * pixelImageScale;
    
    // Fill background
    ctx.fillStyle = pixelImageBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each pixel as a block
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        if (a < 128) continue; // Skip transparent pixels
        
        const [pr, pg, pb] = findClosest(r, g, b);
        
        // Draw outline (darker version) first if enabled
        if (showOutline) {
          ctx.fillStyle = `rgb(${Math.floor(pr * 0.4)}, ${Math.floor(pg * 0.4)}, ${Math.floor(pb * 0.4)})`;
          ctx.fillRect(
            (x + padding) * pixelImageScale,
            (y + padding) * pixelImageScale,
            pixelImageScale,
            pixelImageScale
          );
        }
        
        // Draw main pixel (slightly smaller if outline)
        ctx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
        const offset = showOutline ? 1 : 0;
        ctx.fillRect(
          (x + padding) * pixelImageScale + offset,
          (y + padding) * pixelImageScale + offset,
          pixelImageScale - offset * 2 - (showOutline ? 1 : 0),
          pixelImageScale - offset * 2 - (showOutline ? 1 : 0)
        );
      }
    }
  }, [pixelImageFile, pixelImageSize, pixelImageScale, pixelImageColors, pixelImageBg, showOutline]);

  // Handle banner image upload
  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => setBannerImage(img);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Convert image to ASCII art for banner
  const imageToAscii = useCallback((img: HTMLImageElement, targetWidth: number): string[] => {
    if (!bannerCanvasRef.current) return [];
    
    const canvas = bannerCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const chars = '█▓▒░ '.split('').reverse();
    
    const aspectRatio = img.height / img.width;
    const width = targetWidth;
    const height = Math.floor(width * aspectRatio * 0.5);
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    const lines: string[] = [];
    
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        if (a < 128) {
          line += ' ';
        } else {
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIndex = Math.floor(brightness * (chars.length - 1));
          line += chars[charIndex];
        }
      }
      lines.push(line);
    }
    
    return lines;
  }, []);

  // Render ASCII Banner with optional image
  const renderBanner = useCallback(() => {
    const text = bannerText.toUpperCase();
    const textLines: string[] = ['', '', '', '', '', ''];
    
    for (const char of text) {
      const charLines = BIG_FONT[char] || BIG_FONT[' '];
      for (let i = 0; i < 6; i++) {
        textLines[i] += charLines[i];
      }
    }
    
    // If no image or text-only mode
    if (!bannerImage || bannerLayout === 'text-only') {
      setBannerOutput(textLines.join('\n'));
      return;
    }
    
    // Convert image to ASCII
    const imageLines = imageToAscii(bannerImage, bannerImageWidth);
    
    let result: string[] = [];
    
    if (bannerLayout === 'image-top') {
      result = [...imageLines, '', ...textLines];
    } else if (bannerLayout === 'image-bottom') {
      result = [...textLines, '', ...imageLines];
    } else if (bannerLayout === 'image-left' || bannerLayout === 'image-right') {
      // Need to combine side by side
      const textWidth = textLines[0]?.length || 0;
      const imageWidth = imageLines[0]?.length || 0;
      const maxHeight = Math.max(textLines.length, imageLines.length);
      
      // Pad arrays to same height
      const paddedText = [...textLines];
      const paddedImage = [...imageLines];
      
      while (paddedText.length < maxHeight) {
        paddedText.push(' '.repeat(textWidth));
      }
      while (paddedImage.length < maxHeight) {
        paddedImage.push(' '.repeat(imageWidth));
      }
      
      // Center the shorter one vertically
      const textStart = Math.floor((maxHeight - textLines.length) / 2);
      const imageStart = Math.floor((maxHeight - imageLines.length) / 2);
      
      for (let i = 0; i < maxHeight; i++) {
        const textLine = (i >= textStart && i < textStart + textLines.length) 
          ? textLines[i - textStart] 
          : ' '.repeat(textWidth);
        const imageLine = (i >= imageStart && i < imageStart + imageLines.length)
          ? imageLines[i - imageStart]
          : ' '.repeat(imageWidth);
        
        if (bannerLayout === 'image-left') {
          result.push(imageLine + '  ' + textLine);
        } else {
          result.push(textLine + '  ' + imageLine);
        }
      }
    }
    
    setBannerOutput(result.join('\n'));
  }, [bannerText, bannerImage, bannerLayout, bannerImageWidth, imageToAscii]);

  useEffect(() => {
    if (mode === 'banner') {
      const frameId = requestAnimationFrame(() => {
        renderBanner();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [mode, bannerText, bannerImage, bannerLayout, bannerImageWidth, renderBanner]);

  useEffect(() => {
    if (mode === 'pixeltext') {
      renderPixelText();
    }
  }, [mode, renderPixelText]);

  useEffect(() => {
    if (mode === 'pixelimage' && pixelImageFile) {
      const frameId = requestAnimationFrame(() => {
        renderPixelImage();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [mode, pixelImageFile, renderPixelImage]);

  useEffect(() => {
    if (!image) return;
    const frameId = requestAnimationFrame(() => {
      convertToAscii();
    });
    return () => cancelAnimationFrame(frameId);
  }, [image, convertToAscii]);

  // Convert JSON to ASCII when JSON data changes
  useEffect(() => {
    if (!jsonData || inputType !== 'json') return;
    const frameId = requestAnimationFrame(() => {
      convertJsonToAscii();
    });
    return () => cancelAnimationFrame(frameId);
  }, [jsonData, inputType, convertJsonToAscii]);

  const handleCopyText = async () => {
    if (!outputRef.current) return;
    const text = outputRef.current.innerText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBanner = async () => {
    await navigator.clipboard.writeText(bannerOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPixelImage = () => {
    if (!pixelImageCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = pixelImageCanvasRef.current.toDataURL();
    link.click();
  };

  const handleDownloadPixelText = () => {
    if (!pixelCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'pixel-text.png';
    link.href = pixelCanvasRef.current.toDataURL();
    link.click();
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ASCII Art</title>
    <style>
        body {
            background: #000;
            display: flex;
            justify-content: center;
            padding: 20px;
        }
        #ascii {
            font-family: "Courier New", monospace;
            font-size: ${fontSize}px;
            line-height: ${fontSize}px;
            letter-spacing: 0px;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div id="ascii">${asciiHtml}</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.html';
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-[#00FF99] transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl tracking-wider flex items-center gap-2">
                <Type className="w-5 h-5 text-[#a855f7]" />
                <span className="text-[#a855f7]">ASCII</span>
                <span className="text-white">ART</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span className="animate-pulse text-[#00FF99]">●</span>
              <span>STATUS:</span>
              <span className="text-[#00FF99]">READY</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Mode Tabs */}
        <div className="flex mb-4 border border-[#222] bg-[#0A0A0A]">
          <button
            onClick={() => setMode('ascii')}
            className={`flex-1 px-6 py-3 text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${
              mode === 'ascii'
                ? 'bg-[#a855f7] text-black'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            ASCII_CONVERTER
          </button>
          <button
            onClick={() => setMode('pixeltext')}
            className={`flex-1 px-6 py-3 text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${
              mode === 'pixeltext'
                ? 'bg-[#22d3ee] text-black'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            PIXEL_TEXT
          </button>
          <button
            onClick={() => setMode('pixelimage')}
            className={`flex-1 px-6 py-3 text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${
              mode === 'pixelimage'
                ? 'bg-[#22c55e] text-black'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            PIXEL_IMAGE
          </button>
          <button
            onClick={() => setMode('banner')}
            className={`flex-1 px-6 py-3 text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${
              mode === 'banner'
                ? 'bg-[#1c4bb4] text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            ASCII_BANNER
          </button>
        </div>

        {/* ASCII Mode Controls */}
        {mode === 'ascii' && (
          <div className="border border-[#222] bg-[#0A0A0A] p-4 mb-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <div className="flex flex-wrap gap-6 items-start">
              {/* Upload Image */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ IMAGE ]</span>
                <label className={`border px-4 py-2 cursor-pointer transition-colors text-xs ${
                  inputType === 'image' && (image || fileName !== 'AWAITING_INPUT...')
                    ? 'border-[#00FF99] text-[#00FF99]'
                    : 'border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-black'
                }`}>
                  SELECT_IMAGE
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload JSON */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ 8BIT_JSON ]</span>
                <label className={`border px-4 py-2 cursor-pointer transition-colors text-xs ${
                  inputType === 'json' && jsonData
                    ? 'border-[#00FF99] text-[#00FF99]'
                    : 'border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black'
                }`}>
                  SELECT_JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* File Name Display */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ FILE ]</span>
                <span className="text-gray-400 text-xs max-w-[150px] truncate py-2">
                  {fileName}
                  {inputType === 'json' && jsonData && (
                    <span className="text-[#22d3ee] ml-1">({jsonData.width}x{jsonData.height})</span>
                  )}
                </span>
              </div>

              {/* Width Selection - 只在非精確模式下顯示 */}
              {!preciseMode && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#FF004D] text-xs tracking-widest">[ WIDTH ]</span>
                  <div className="flex border border-[#333]">
                    {[80, 100, 200, 300].map((w) => (
                      <button
                        key={w}
                        onClick={() => setOutputWidth(w)}
                        className={`px-4 py-2 text-xs transition-colors ${
                          outputWidth === w
                            ? 'bg-[#00FF99] text-black'
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Precise Mode Toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ MODE ]</span>
                <label className={`flex items-center gap-2 cursor-pointer border px-4 py-2 transition-colors ${
                  preciseMode 
                    ? 'border-[#facc15] text-[#facc15]' 
                    : 'border-[#333] text-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={preciseMode}
                    onChange={(e) => setPreciseMode(e.target.checked)}
                    className="accent-[#facc15]"
                  />
                  <span className="text-xs">PRECISE_1:1</span>
                </label>
                {preciseMode && image && (
                  <span className="text-[#facc15] text-xs">{image.width}x{image.height}</span>
                )}
              </div>

              {/* Char Set */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ CHARSET ]</span>
                <select
                  value={charSet}
                  onChange={(e) => setCharSet(e.target.value as keyof typeof charSets)}
                  className="bg-[#111] border border-[#333] text-white px-3 py-2 text-xs focus:border-[#00FF99] outline-none"
                >
                  <option value="standard">STANDARD (@%#)</option>
                  <option value="detailed">DETAILED (多層次)</option>
                  <option value="blocks">BLOCKS (█▓▒░)</option>
                  <option value="blocks_fine">BLOCKS_FINE (█▉▊▋)</option>
                  <option value="blocks_double">BLOCKS_2X (██▓▓)</option>
                  <option value="pixel">PIXEL (⣿⣷⣯)</option>
                  <option value="simple">SIMPLE (#.)</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ FONT_SIZE ]</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24 accent-[#22d3ee]"
                  />
                  <span className="text-[#22d3ee] text-xs">{fontSize}px</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-auto">
                <span className="text-[#FF004D] text-xs tracking-widest">[ EXPORT ]</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyText}
                    disabled={!asciiHtml}
                    className={`px-4 py-2 text-xs flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                      copied
                        ? 'bg-[#00FF99] text-black'
                        : 'border border-[#333] hover:border-[#00FF99] hover:text-[#00FF99]'
                    }`}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'COPIED!' : 'COPY_TEXT'}
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    disabled={!asciiHtml}
                    className="px-4 py-2 border border-[#00FF99] text-[#00FF99] text-xs flex items-center gap-2 hover:bg-[#00FF99] hover:text-black transition-colors disabled:opacity-30 disabled:border-[#333] disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3 h-3" />
                    DOWNLOAD_HTML
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pixel Text Mode Controls */}
        {mode === 'pixeltext' && (
          <div className="border border-[#222] bg-[#0A0A0A] p-4 mb-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <div className="flex flex-wrap gap-6 items-start">
              {/* Text Input */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ TEXT_INPUT ]</span>
                <input
                  type="text"
                  value={pixelText}
                  onChange={(e) => setPixelText(e.target.value)}
                  placeholder="ENTER TEXT..."
                  maxLength={20}
                  className="bg-[#111] border border-[#333] text-[#22d3ee] px-3 py-2 text-xs focus:border-[#22d3ee] outline-none w-48 uppercase"
                />
                <span className="text-gray-600 text-[10px]">A-Z, 0-9, SPACE, !_-.</span>
              </div>

              {/* Pixel Scale */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ PIXEL_SIZE ]</span>
                <div className="flex border border-[#333]">
                  {[4, 6, 8, 12, 16].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPixelScale(s)}
                      className={`px-3 py-2 text-xs transition-colors ${
                        pixelScale === s
                          ? 'bg-[#22d3ee] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ STYLE ]</span>
                <div className="flex border border-[#333]">
                  {(Object.keys(PIXEL_STYLES) as Array<keyof typeof PIXEL_STYLES>).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPixelStyle(s)}
                      className={`px-3 py-2 text-xs transition-colors ${
                        pixelStyle === s
                          ? 'bg-[#a855f7] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {PIXEL_STYLES[s].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ COLORS ]</span>
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">TEXT:</span>
                    <input
                      type="color"
                      value={pixelColor}
                      onChange={(e) => setPixelColor(e.target.value)}
                      className="w-8 h-8 border border-[#333] bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">BG:</span>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 border border-[#333] bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Export */}
              <div className="flex flex-col gap-2 ml-auto">
                <span className="text-[#FF004D] text-xs tracking-widest">[ EXPORT ]</span>
                <button
                  onClick={handleDownloadPixelText}
                  disabled={!pixelText}
                  className="px-4 py-2 border border-[#22d3ee] text-[#22d3ee] text-xs flex items-center gap-2 hover:bg-[#22d3ee] hover:text-black transition-colors disabled:opacity-30 disabled:border-[#333] disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <Download className="w-3 h-3" />
                  DOWNLOAD_PNG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pixel Image Mode Controls */}
        {mode === 'pixelimage' && (
          <div className="border border-[#222] bg-[#0A0A0A] p-4 mb-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <div className="flex flex-wrap gap-6 items-start">
              {/* Upload */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ INPUT ]</span>
                <label className="border border-[#22c55e] text-[#22c55e] px-4 py-2 cursor-pointer hover:bg-[#22c55e] hover:text-black transition-colors text-xs">
                  SELECT_IMAGE
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePixelImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-600 text-xs max-w-[150px] truncate">{pixelImageFileName}</span>
              </div>

              {/* Resolution */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ RESOLUTION ]</span>
                <div className="flex border border-[#333]">
                  {[32, 48, 64, 96, 128].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPixelImageSize(s)}
                      className={`px-3 py-2 text-xs transition-colors ${
                        pixelImageSize === s
                          ? 'bg-[#22c55e] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pixel Scale */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ PIXEL_SCALE ]</span>
                <div className="flex border border-[#333]">
                  {[4, 6, 8, 12].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPixelImageScale(s)}
                      className={`px-3 py-2 text-xs transition-colors ${
                        pixelImageScale === s
                          ? 'bg-[#a855f7] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ PALETTE ]</span>
                <div className="flex border border-[#333]">
                  {[4, 8, 16, 32, 64].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPixelImageColors(c)}
                      className={`px-3 py-2 text-xs transition-colors ${
                        pixelImageColors === c
                          ? 'bg-[#facc15] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ OPTIONS ]</span>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOutline}
                      onChange={(e) => setShowOutline(e.target.checked)}
                      className="accent-[#22c55e]"
                    />
                    <span className="text-gray-400 text-xs">OUTLINE</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">BG:</span>
                    <input
                      type="color"
                      value={pixelImageBg}
                      onChange={(e) => setPixelImageBg(e.target.value)}
                      className="w-8 h-8 border border-[#333] bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Export */}
              <div className="flex flex-col gap-2 ml-auto">
                <span className="text-[#FF004D] text-xs tracking-widest">[ EXPORT ]</span>
                <button
                  onClick={handleDownloadPixelImage}
                  disabled={!pixelImageFile}
                  className="px-4 py-2 border border-[#22c55e] text-[#22c55e] text-xs flex items-center gap-2 hover:bg-[#22c55e] hover:text-black transition-colors disabled:opacity-30 disabled:border-[#333] disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <Download className="w-3 h-3" />
                  DOWNLOAD_PNG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASCII Banner Mode Controls */}
        {mode === 'banner' && (
          <div className="border border-[#222] bg-[#0A0A0A] p-4 mb-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <div className="flex flex-wrap gap-6 items-start">
              {/* Text Input */}
              <div className="flex flex-col gap-2 min-w-[180px]">
                <span className="text-[#FF004D] text-xs tracking-widest">[ INPUT_TEXT ]</span>
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="ENTER TEXT..."
                  className="bg-[#111] border border-[#1c4bb4] px-4 py-2 text-white focus:outline-none focus:border-[#3b6fd4] text-sm tracking-wider"
                  maxLength={20}
                />
                <span className="text-gray-600 text-xs">MAX 20 CHARACTERS</span>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ IMAGE ]</span>
                <label className="border border-[#1c4bb4] text-[#1c4bb4] px-4 py-2 cursor-pointer hover:bg-[#1c4bb4] hover:text-white transition-colors text-xs">
                  SELECT_IMAGE
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-600 text-xs max-w-[120px] truncate">
                  {bannerImageName || 'NO_IMAGE'}
                </span>
              </div>

              {/* Layout */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ LAYOUT ]</span>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {[
                    { value: 'text-only', label: 'TEXT' },
                    { value: 'image-left', label: '◀IMG' },
                    { value: 'image-right', label: 'IMG▶' },
                    { value: 'image-top', label: '▲IMG' },
                    { value: 'image-bottom', label: '▼IMG' },
                  ].map((layout) => (
                    <button
                      key={layout.value}
                      onClick={() => setBannerLayout(layout.value as typeof bannerLayout)}
                      disabled={!bannerImage && layout.value !== 'text-only'}
                      className={`px-2 py-1 text-xs transition-colors ${
                        bannerLayout === layout.value
                          ? 'bg-[#1c4bb4] text-white'
                          : 'border border-[#333] text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Width */}
              {bannerImage && bannerLayout !== 'text-only' && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#FF004D] text-xs tracking-widest">[ IMG_WIDTH ]</span>
                  <div className="flex border border-[#333]">
                    {[20, 30, 40, 50, 60, 80].map((w) => (
                      <button
                        key={w}
                        onClick={() => setBannerImageWidth(w)}
                        className={`px-2 py-1 text-xs transition-colors ${
                          bannerImageWidth === w
                            ? 'bg-[#a855f7] text-black'
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ COLOR ]</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value)}
                    className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-500 text-xs uppercase">{bannerColor}</span>
                </div>
              </div>

              {/* Brightness Effect */}
              <div className="flex flex-col gap-2">
                <span className="text-[#FF004D] text-xs tracking-widest">[ EFFECT ]</span>
                <label className="flex items-center gap-2 cursor-pointer border border-[#333] px-4 py-2">
                  <input
                    type="checkbox"
                    checked={bannerBright}
                    onChange={(e) => setBannerBright(e.target.checked)}
                    className="accent-[#1c4bb4]"
                  />
                  <span className="text-gray-400 text-xs">BRIGHT_GLOW</span>
                </label>
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-2 ml-auto">
                <span className="text-[#FF004D] text-xs tracking-widest">[ EXPORT ]</span>
                <button
                  onClick={handleCopyBanner}
                  disabled={!bannerOutput}
                  className="px-4 py-2 border border-[#1c4bb4] text-[#1c4bb4] text-xs flex items-center gap-2 hover:bg-[#1c4bb4] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'COPIED!' : 'COPY_TEXT'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        <div className="border border-[#222] bg-[#0A0A0A] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

          {/* Output Header */}
          <div className="border-b border-[#222] p-3 flex justify-between items-center">
            <span className="text-[#FF004D] text-xs tracking-widest">[ OUTPUT_PREVIEW ]</span>
            <span className="text-xs text-gray-500">
              {mode === 'ascii' 
                ? (asciiHtml 
                    ? (preciseMode 
                        ? `PRECISE: ${image?.width}x${image?.height} | CHARSET: ${charSet.toUpperCase()}`
                        : `WIDTH: ${outputWidth} | CHARSET: ${charSet.toUpperCase()}`)
                    : 'NO_DATA')
                : mode === 'pixeltext'
                ? `SCALE: ${pixelScale}px | STYLE: ${PIXEL_STYLES[pixelStyle].name}`
                : mode === 'banner'
                ? `LAYOUT: ${bannerLayout.toUpperCase()} | CHARS: ${bannerText.length}${bannerImage ? ' | +IMAGE' : ''}`
                : `RES: ${pixelImageSize}px | COLORS: ${pixelImageColors}`
              }
            </span>
          </div>

          {/* Output Area */}
          <div className="p-4 overflow-auto max-h-[65vh] bg-[#050505] flex items-center justify-center">
            {mode === 'ascii' ? (
              <div
                ref={outputRef}
                className="font-mono whitespace-pre inline-block"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ 
                  __html: asciiHtml || '<div class="text-center text-gray-600 py-12">AWAITING_IMAGE_INPUT...</div>' 
                }}
              />
            ) : mode === 'pixeltext' ? (
              <canvas
                ref={pixelCanvasRef}
                className="max-w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : mode === 'banner' ? (
              <pre
                className="font-mono whitespace-pre text-sm leading-tight"
                style={{ 
                  color: bannerColor,
                  textShadow: bannerBright ? `0 0 10px ${bannerColor}, 0 0 20px ${bannerColor}40` : 'none',
                }}
              >
                {bannerOutput || 'ENTER_TEXT_ABOVE...'}
              </pre>
            ) : (
              pixelImageFile ? (
                <canvas
                  ref={pixelImageCanvasRef}
                  className="max-w-full"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="text-center text-gray-600 py-12">AWAITING_IMAGE_INPUT...</div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={bannerCanvasRef} className="hidden" />

      {/* Footer */}
      <footer className="border-t border-[#222] mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[10px] text-gray-600">
          <span>ASCII_ART_MODULE</span>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-[#00FF99]">●</span>
            <span>SYSTEM_OPTIMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
