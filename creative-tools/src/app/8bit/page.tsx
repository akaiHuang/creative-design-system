'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Home, Download, Code, RotateCcw, Copy, Check, X, Grid3X3, Settings, Zap } from 'lucide-react';

// WebGL Shader - Vertex Shader
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// WebGL Shader - Fragment Shader for pixelation and color quantization
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_pixelSize;
  uniform float u_contrast;
  uniform sampler2D u_palette;
  uniform float u_paletteSize;
  varying vec2 v_texCoord;

  vec3 findClosestColor(vec3 color) {
    float minDist = 999999.0;
    vec3 closest = vec3(0.0);
    
    for (float i = 0.0; i < 64.0; i++) {
      if (i >= u_paletteSize) break;
      vec3 palColor = texture2D(u_palette, vec2((i + 0.5) / 64.0, 0.5)).rgb;
      float dist = distance(color, palColor);
      if (dist < minDist) {
        minDist = dist;
        closest = palColor;
      }
    }
    return closest;
  }

  void main() {
    // Calculate pixelated coordinates
    vec2 pixelCoord = floor(v_texCoord * u_resolution / u_pixelSize) * u_pixelSize / u_resolution;
    
    // Sample block average for better quality
    vec3 avgColor = vec3(0.0);
    float samples = 0.0;
    vec2 pixelStep = u_pixelSize / u_resolution;
    
    for (float y = 0.0; y < 1.0; y += 0.25) {
      for (float x = 0.0; x < 1.0; x += 0.25) {
        vec2 sampleCoord = pixelCoord + vec2(x, y) * pixelStep;
        avgColor += texture2D(u_image, sampleCoord).rgb;
        samples += 1.0;
      }
    }
    avgColor /= samples;
    
    // Apply contrast
    float contrastFactor = (259.0 * (u_contrast + 255.0)) / (255.0 * (259.0 - u_contrast));
    avgColor = clamp((avgColor - 0.5) * contrastFactor + 0.5, 0.0, 1.0);
    
    // Find closest palette color
    vec3 finalColor = findClosestColor(avgColor);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// WebGL Helper Class
class WebGLPixelizer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionBuffer: WebGLBuffer;
  private texCoordBuffer: WebGLBuffer;
  private imageTexture: WebGLTexture | null = null;
  private paletteTexture: WebGLTexture;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { 
      preserveDrawingBuffer: true,
      antialias: false 
    });
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;

    // Create shader program
    const vertexShader = this.createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    this.program = this.createProgram(vertexShader, fragmentShader);

    // Setup position buffer (full screen quad)
    this.positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    // Setup texture coordinate buffer
    this.texCoordBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1, 1, 1, 0, 0,
      0, 0, 1, 1, 1, 0,
    ]), gl.STATIC_DRAW);

    // Create palette texture
    this.paletteTexture = gl.createTexture()!;
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('Shader compile error: ' + info);
    }
    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      throw new Error('Program link error: ' + info);
    }
    return program;
  }

  setImage(image: HTMLImageElement, rotation: number) {
    const gl = this.gl;
    
    // Create temporary canvas for rotation
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    const isRotated = rotation % 180 !== 0;
    tempCanvas.width = isRotated ? image.height : image.width;
    tempCanvas.height = isRotated ? image.width : image.height;
    
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.drawImage(image, -image.width / 2, -image.height / 2);
    tempCtx.restore();

    if (this.imageTexture) {
      gl.deleteTexture(this.imageTexture);
    }
    
    this.imageTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return { width: tempCanvas.width, height: tempCanvas.height };
  }

  setPalette(palette: number[][]) {
    const gl = this.gl;
    const paletteData = new Uint8Array(64 * 4); // Max 64 colors
    
    for (let i = 0; i < palette.length && i < 64; i++) {
      paletteData[i * 4] = palette[i][0];
      paletteData[i * 4 + 1] = palette[i][1];
      paletteData[i * 4 + 2] = palette[i][2];
      paletteData[i * 4 + 3] = 255;
    }

    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, paletteData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  render(width: number, height: number, pixelSize: number, contrast: number, paletteSize: number) {
    const gl = this.gl;
    
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    
    gl.useProgram(this.program);

    // Set position attribute
    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set texCoord attribute
    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    gl.uniform2f(gl.getUniformLocation(this.program, 'u_resolution'), width, height);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_pixelSize'), pixelSize);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_contrast'), contrast);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_paletteSize'), paletteSize);

    // Bind image texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, 'u_image'), 0);

    // Bind palette texture
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, 'u_palette'), 1);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  getPixelData(width: number, height: number, pixelSize: number): number[][] {
    const gl = this.gl;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const gridWidth = Math.ceil(width / pixelSize);
    const gridHeight = Math.ceil(height / pixelSize);
    const pixelData: number[][] = [];

    for (let y = gridHeight - 1; y >= 0; y--) {
      const row: number[] = [];
      for (let x = 0; x < gridWidth; x++) {
        const px = Math.floor(x * pixelSize + pixelSize / 2);
        const py = Math.floor(y * pixelSize + pixelSize / 2);
        const idx = (py * width + px) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        row.push((r << 16) | (g << 8) | b);
      }
      pixelData.push(row);
    }

    return pixelData;
  }

  destroy() {
    const gl = this.gl;
    if (this.imageTexture) gl.deleteTexture(this.imageTexture);
    gl.deleteTexture(this.paletteTexture);
    gl.deleteBuffer(this.positionBuffer);
    gl.deleteBuffer(this.texCoordBuffer);
    gl.deleteProgram(this.program);
  }
}

// 中位數切割色彩量化演算法 (CPU fallback for palette extraction)
function medianCutQuantize(pixels: Uint8ClampedArray, numColors: number): number[][] {
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
  
  // Sample every 4th pixel for faster palette extraction
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Quantize to reduce unique colors
    const qr = Math.floor(r / 8) * 8;
    const qg = Math.floor(g / 8) * 8;
    const qb = Math.floor(b / 8) * 8;
    const key = `${qr},${qg},${qb}`;
    
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, { r: qr, g: qg, b: qb, count: 1 });
    }
  }

  let colors = Array.from(colorMap.values());
  colors.sort((a, b) => b.count - a.count);
  colors = colors.slice(0, numColors);

  if (colors.length < numColors) {
    const baseColors = [
      [0, 0, 0], [255, 255, 255], [255, 0, 0], [0, 255, 0],
      [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255],
    ];
    for (let i = colors.length; i < numColors && i < baseColors.length; i++) {
      colors.push({ r: baseColors[i][0], g: baseColors[i][1], b: baseColors[i][2], count: 0 });
    }
  }

  return colors.map(c => [c.r, c.g, c.b]);
}

// CPU fallback helper functions
function findClosestColorCPU(r: number, g: number, b: number, palette: number[][]): number[] {
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
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export default function EightBitPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('AWAITING_INPUT...');
  const [pixelSize, setPixelSize] = useState(8);
  const [paletteSize, setPaletteSize] = useState(16);
  const [contrast, setContrast] = useState(10);
  const [rotation, setRotation] = useState(0);
  const [processedData, setProcessedData] = useState<{ width: number; height: number; pixels: number[][] } | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeFormat, setCodeFormat] = useState<'js' | 'css' | 'json'>('js');
  const [copied, setCopied] = useState(false);
  const [renderTime, setRenderTime] = useState(0);
  const [renderMode, setRenderMode] = useState<'webgl' | 'canvas2d'>('canvas2d');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webglRef = useRef<WebGLPixelizer | null>(null);
  const paletteRef = useRef<number[][]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setRotation(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Extract palette from image
  const extractPalette = useCallback((img: HTMLImageElement, rot: number) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    const isRotated = rot % 180 !== 0;
    const w = isRotated ? img.height : img.width;
    const h = isRotated ? img.width : img.height;
    
    // Use smaller size for palette extraction
    const scale = Math.min(1, 200 / Math.max(w, h));
    tempCanvas.width = Math.ceil(w * scale);
    tempCanvas.height = Math.ceil(h * scale);
    
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((rot * Math.PI) / 180);
    tempCtx.drawImage(img, -img.width * scale / 2, -img.height * scale / 2, img.width * scale, img.height * scale);
    tempCtx.restore();
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    return medianCutQuantize(imageData.data, paletteSize);
  }, [paletteSize]);

  const processImageWebGL = useCallback(() => {
    if (!image || !canvasRef.current || !webglRef.current) return;

    const startTime = performance.now();
    
    const isRotated = rotation % 180 !== 0;
    const srcWidth = isRotated ? image.height : image.width;
    const srcHeight = isRotated ? image.width : image.height;
    
    const gridWidth = Math.ceil(srcWidth / pixelSize);
    const gridHeight = Math.ceil(srcHeight / pixelSize);
    const canvasWidth = gridWidth * pixelSize;
    const canvasHeight = gridHeight * pixelSize;

    // Extract palette
    paletteRef.current = extractPalette(image, rotation);
    
    // Setup WebGL
    webglRef.current.setImage(image, rotation);
    webglRef.current.setPalette(paletteRef.current);
    webglRef.current.render(canvasWidth, canvasHeight, pixelSize, contrast, paletteSize);
    
    // Get pixel data for export
    const pixelData = webglRef.current.getPixelData(canvasWidth, canvasHeight, pixelSize);
    
    const endTime = performance.now();
    setRenderTime(Math.round(endTime - startTime));
    setProcessedData({ width: gridWidth, height: gridHeight, pixels: pixelData });
  }, [image, pixelSize, paletteSize, contrast, rotation, extractPalette]);

  const processImageCanvas2D = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const startTime = performance.now();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const isRotated = rotation % 180 !== 0;
    const srcWidth = isRotated ? image.height : image.width;
    const srcHeight = isRotated ? image.width : image.height;

    const gridWidth = Math.ceil(srcWidth / pixelSize);
    const gridHeight = Math.ceil(srcHeight / pixelSize);

    canvas.width = gridWidth * pixelSize;
    canvas.height = gridHeight * pixelSize;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    if (isRotated) {
      ctx.drawImage(image, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
    } else {
      ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    }
    ctx.restore();

    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, contrastFactor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, contrastFactor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, contrastFactor * (data[i + 2] - 128) + 128));
    }

    const palette = medianCutQuantize(data, paletteSize);
    paletteRef.current = palette;
    const pixelData: number[][] = [];
    
    for (let y = 0; y < gridHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < gridWidth; x++) {
        const startX = x * pixelSize;
        const startY = y * pixelSize;

        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        
        for (let py = 0; py < pixelSize; py++) {
          for (let px = 0; px < pixelSize; px++) {
            const idx = ((startY + py) * canvas.width + (startX + px)) * 4;
            if (idx < data.length) {
              totalR += data[idx];
              totalG += data[idx + 1];
              totalB += data[idx + 2];
              count++;
            }
          }
        }

        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);

        const [r, g, b] = findClosestColorCPU(avgR, avgG, avgB, palette);
        
        ctx.fillStyle = rgbToHex(r, g, b);
        ctx.fillRect(startX, startY, pixelSize, pixelSize);
        
        row.push((r << 16) | (g << 8) | b);
      }
      pixelData.push(row);
    }

    const endTime = performance.now();
    setRenderTime(Math.round(endTime - startTime));
    setProcessedData({ width: gridWidth, height: gridHeight, pixels: pixelData });
  }, [image, pixelSize, paletteSize, contrast, rotation]);

  // Process image when parameters change - initialization happens synchronously within RAF
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const frameId = requestAnimationFrame(() => {
      // Try to initialize WebGL if not yet done
      if (!webglRef.current) {
        try {
          webglRef.current = new WebGLPixelizer(canvasRef.current!);
          setRenderMode('webgl');
        } catch {
          setRenderMode('canvas2d');
        }
      }
      
      // Process with available renderer
      if (webglRef.current) {
        processImageWebGL();
      } else {
        processImageCanvas2D();
      }
    });
    
    return () => cancelAnimationFrame(frameId);
  }, [image, processImageWebGL, processImageCanvas2D]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = '8bit-pixel-art.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleDownloadJSON = () => {
    if (!processedData) return;
    
    const jsonData = {
      type: '8bit-pixel-data',
      version: '1.0',
      width: processedData.width,
      height: processedData.height,
      pixelSize,
      paletteSize,
      pixels: processedData.pixels.map(row => 
        row.map(c => '#' + c.toString(16).padStart(6, '0'))
      )
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = '8bit-pixel-data.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateCode = (): string => {
    if (!processedData) return '';

    const { width, height, pixels } = processedData;

    if (codeFormat === 'js') {
      const hexArray = pixels.map(row => 
        row.map(c => `0x${c.toString(16).padStart(6, '0')}`).join(', ')
      );
      return `// 8-bit Pixel Art Data
// Size: ${width} x ${height}
const pixelData = [
${hexArray.map(row => `  [${row}]`).join(',\n')}
];`;
    }

    if (codeFormat === 'css') {
      const shadows: string[] = [];
      pixels.forEach((row, y) => {
        row.forEach((color, x) => {
          const hex = '#' + color.toString(16).padStart(6, '0');
          shadows.push(`${x + 1}px ${y + 1}px 0 ${hex}`);
        });
      });
      return `/* CSS Box-Shadow Pixel Art */
/* Size: ${width} x ${height} */
.pixel-art {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: ${shadows.join(',\n    ')};
  transform: scale(${pixelSize});
  transform-origin: top left;
}`;
    }

    return JSON.stringify({
      width,
      height,
      pixelSize,
      palette: paletteSize,
      data: pixels.map(row => row.map(c => '#' + c.toString(16).padStart(6, '0')))
    }, null, 2);
  };

  const handleCopyCode = async () => {
    const code = generateCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <Grid3X3 className="w-5 h-5 text-[#22c55e]" />
                <span className="text-[#22c55e]">8-BIT</span>
                <span className="text-white">CONVERTER</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Zap className={`w-3 h-3 ${renderMode === 'webgl' ? 'text-[#22d3ee]' : 'text-gray-600'}`} />
                <span>{renderMode === 'webgl' ? 'WebGL' : renderMode === 'canvas2d' ? 'Canvas2D' : '...'}</span>
              </div>
              {renderTime > 0 && (
                <div className="flex items-center gap-2">
                  <span>RENDER:</span>
                  <span className="text-[#a855f7]">{renderTime}ms</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-[#00FF99]">●</span>
                <span>STATUS:</span>
                <span className="text-[#00FF99]">READY</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Upload Section */}
          <div className="border border-[#222] bg-[#0A0A0A] p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />
            
            <h2 className="text-[#FF004D] text-xs tracking-widest mb-4">[ INPUT_IMAGE ]</h2>
            
            <div className="relative group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border border-dashed border-[#333] p-4 text-center group-hover:border-[#00FF99] transition-colors bg-[#111]">
                <span className="text-xs text-gray-500">{fileName}</span>
              </div>
            </div>
            
            <button
              onClick={handleRotate}
              disabled={!image}
              className="mt-3 w-full py-2 border border-[#333] text-xs text-gray-400 hover:border-[#00FF99] hover:text-[#00FF99] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              ROTATE_90
            </button>
          </div>

          {/* Parameters */}
          <div className="border border-[#222] bg-[#0A0A0A] p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <h2 className="text-[#FF004D] text-xs tracking-widest mb-4 flex items-center gap-2">
              <Settings className="w-3 h-3" />
              [ PARAMETERS ]
            </h2>

            {/* Pixel Size */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">PIXEL_SIZE</span>
                <span className="text-[#00FF99]">{pixelSize}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="32"
                value={pixelSize}
                onChange={(e) => setPixelSize(Number(e.target.value))}
                className="w-full accent-[#22c55e]"
              />
            </div>

            {/* Palette Size */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">COLOR_DEPTH</span>
                <span className="text-[#a855f7]">{paletteSize}</span>
              </div>
              <input
                type="range"
                min="2"
                max="64"
                step="2"
                value={paletteSize}
                onChange={(e) => setPaletteSize(Number(e.target.value))}
                className="w-full accent-[#a855f7]"
              />
            </div>

            {/* Contrast */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">CONTRAST</span>
                <span className="text-[#22d3ee]">{contrast}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-[#22d3ee]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border border-[#222] bg-[#0A0A0A] p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            <h2 className="text-[#FF004D] text-xs tracking-widest mb-4">[ EXPORT ]</h2>

            <div className="space-y-2">
              <button
                onClick={handleDownload}
                disabled={!image}
                className="w-full py-2 border border-[#333] text-xs hover:border-[#00FF99] hover:text-[#00FF99] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD_PNG
              </button>
              <button
                onClick={handleDownloadJSON}
                disabled={!processedData}
                className="w-full py-2 border border-[#22d3ee] text-[#22d3ee] text-xs hover:bg-[#22d3ee] hover:text-black disabled:opacity-30 disabled:border-[#333] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4" />
                EXPORT_JSON
              </button>
              <button
                onClick={() => setShowCodeModal(true)}
                disabled={!processedData}
                className="w-full py-2 border border-[#00FF99] text-[#00FF99] text-xs hover:bg-[#00FF99] hover:text-black disabled:opacity-30 disabled:border-[#333] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4" />
                EXPORT_CODE
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-3">
          <div className="border border-[#222] bg-[#0A0A0A] relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#333]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#333]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#333]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#333]" />

            {/* Preview Header */}
            <div className="border-b border-[#222] p-3 flex justify-between items-center">
              <span className="text-[#FF004D] text-xs tracking-widest">[ OUTPUT_PREVIEW ]</span>
              <span className="text-xs text-gray-500">
                {processedData ? `${processedData.width * pixelSize} x ${processedData.height * pixelSize}` : 'NO_DATA'}
              </span>
            </div>

            {/* Preview Area */}
            <div className="flex items-center justify-center p-8 min-h-[500px] bg-[#050505]">
              {!image ? (
                <div className="text-center">
                  <Grid3X3 className="w-16 h-16 text-[#222] mx-auto mb-4" />
                  <p className="text-gray-600 text-sm">AWAITING_IMAGE_INPUT...</p>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[60vh] shadow-lg"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
            </div>

            {/* Preview Footer */}
            <div className="border-t border-[#222] p-3 flex justify-between items-center text-xs text-gray-500">
              <span>GRID: {processedData ? `${processedData.width} x ${processedData.height}` : '0 x 0'}</span>
              <span>COLORS: {paletteSize}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] w-full max-w-5xl h-[90vh] flex flex-col border border-[#222] relative">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#00FF99]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00FF99]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#00FF99]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#00FF99]" />

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#222]">
              <div className="flex items-center gap-4">
                <h3 className="text-[#00FF99] text-sm tracking-widest flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  CODE_EXPORT
                </h3>
                <div className="flex border border-[#333]">
                  {(['js', 'css', 'json'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setCodeFormat(format)}
                      className={`px-3 py-1 text-xs transition-colors ${
                        codeFormat === format
                          ? 'bg-[#00FF99] text-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-500 hover:text-[#FF004D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Code Area */}
            <div className="flex-grow overflow-auto bg-[#050505] p-4">
              <pre className="text-[#00FF99] font-mono text-xs whitespace-pre-wrap">
                {generateCode()}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#222] flex justify-end">
              <button
                onClick={handleCopyCode}
                className={`px-6 py-2 text-xs flex items-center gap-2 transition-colors ${
                  copied
                    ? 'bg-[#00FF99] text-black'
                    : 'border border-[#00FF99] text-[#00FF99] hover:bg-[#00FF99] hover:text-black'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'COPIED!' : 'COPY_CODE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#222] mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[10px] text-gray-600">
          <span>8-BIT_CONVERTER_MODULE</span>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-[#00FF99]">●</span>
            <span>SYSTEM_OPTIMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
