import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Check, ChevronDown, Box, Sparkles, X, Server, Cpu, HardDrive, Database, Terminal, Monitor, CreditCard, Download, Copy, ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { ImageCarousel } from './ImageCarousel';

const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return;

    let width: number, height: number;
    let animationFrameId: number;
    let startTime = Date.now();
    let progress = 0;
    let targetProgress = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      gl!.viewport(0, 0, width, height);
    }
    window.addEventListener('resize', resize);
    resize();

    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 vUv;
        void main() {
            vUv = (a_position + 1.0) / 2.0;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        varying vec2 vUv;
        uniform float u_time;
        uniform float u_progress;
        uniform vec2 u_resolution;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            for (int i = 0; i < 5; i++) {
                value += amplitude * snoise(p * frequency);
                p *= mat2(1.6, -1.2, 1.2, 1.6);
                amplitude *= 0.5;
                frequency *= 2.0;
            }
            return value;
        }

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 p = vUv;
            p.x *= u_resolution.x / u_resolution.y;
            vec2 center = vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
            
            vec2 q = vec2(0.);
            q.x = fbm( p + vec2(u_time * 0.05, u_time * 0.08) );
            q.y = fbm( p + vec2(1.0) );

            vec2 r = vec2(0.);
            r.x = fbm( p + 1.0*q + vec2(u_time * 0.1, u_time * 0.1) );
            r.y = fbm( p + 1.0*q + vec2(8.326, 2.825) );

            float noiseVal = fbm(p + 3.0 * r);
            float dist = length(p - center);
            float threshold = (u_progress * 2.5) - 0.2; 
            float inkMask = noiseVal + threshold - dist;
            float edge = smoothstep(-0.1, 0.1, inkMask);

            vec3 deepInk = vec3(0.02, 0.02, 0.02);
            vec3 texturedInk = vec3(0.07, 0.07, 0.07);
            vec3 finalInkColor = mix(deepInk, texturedInk, r.x);
            float grain = random(vUv * u_time) * 0.05;
            finalInkColor -= grain;

            gl_FragColor = vec4(finalInkColor, edge);
        }
    `;

    function compileShader(type: number, source: string) {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
            gl!.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const progressLocation = gl.getUniformLocation(program, "u_progress");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    const sequence = [
        { time: 500,  target: 0.1 },
        { time: 1500, target: 0.15 },
        { time: 2500, target: 0.4 },
        { time: 3500, target: 0.45 },
        { time: 4500, target: 0.8 },
        { time: 5500, target: 1.0 }
    ];

    const timeouts = sequence.map(step => 
        setTimeout(() => {
            targetProgress = step.target;
        }, step.time)
    );

    function render() {
        const time = (Date.now() - startTime) * 0.001;
        progress += (targetProgress - progress) * 0.02;

        const counterEl = document.getElementById('fluid-counter');
        if (counterEl) {
            let percentage = (progress * 100).toFixed(3);
            if(progress > 0.99) percentage = "100.000";
            counterEl.innerText = percentage;
        }

        gl!.uniform1f(timeLocation, time);
        gl!.uniform1f(progressLocation, progress);
        gl!.uniform2f(resolutionLocation, width, height);

        gl!.drawArrays(gl!.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
        timeouts.forEach(clearTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

interface LandingPageProps {
  onEnter: (tab?: string, modelId?: string) => void;
  onAuth: () => void;
}

const IMAGES = [
  { id: 'llama3', name: 'Llama 3 70B Instruct', shortName: ['Llama 3 70B', 'Instruct'], type: 'LLM', icon: Box, desc: '强大的开源大语言模型，适用于复杂推理和对话任务。' },
  { id: 'sdxl', name: 'Stable Diffusion XL', shortName: ['Stable', 'Diffusion XL'], type: 'Vision', icon: Sparkles, desc: '新一代高质量图像生成模型，支持极高分辨率和细节。' },
  { id: 'whisper', name: 'Whisper v3 Large', shortName: ['Whisper v3', 'Large'], type: 'Audio', icon: Box, desc: 'OpenAI开源的多语言语音识别模型，具有极高的准确率。' },
];

const COMMUNITY_IMAGES = [
  { name: 'Ubuntu 22.04 + CUDA 12.1', desc: '官方基础镜像，预装最新 CUDA 驱动与常用系统工具。', downloads: '12k', tags: ['Linux', 'CUDA', 'Base'], size: '4.2GB', updated: '2天前', command: 'docker pull bitahub/ubuntu-cuda:12.1', recommendedGpu: '通用 (Any)', images: ['https://picsum.photos/seed/ubuntu1/800/400', 'https://picsum.photos/seed/ubuntu2/800/400', 'https://picsum.photos/seed/ubuntu3/800/400'] },
  { name: 'PyTorch 2.1.0', desc: '深度学习框架，包含常用视觉和 NLP 库，开箱即用。', downloads: '8.5k', tags: ['PyTorch', 'Python 3.10', 'AI'], size: '6.8GB', updated: '1周前', command: 'docker pull bitahub/pytorch:2.1.0', recommendedGpu: 'RTX 4090 / L40S', images: ['https://picsum.photos/seed/pytorch1/800/400', 'https://picsum.photos/seed/pytorch2/800/400', 'https://picsum.photos/seed/pytorch3/800/400'] },
  { name: 'Stable Diffusion WebUI', desc: '预装 AUTOMATIC1111 WebUI 的 AI 绘画环境。', downloads: '45k', tags: ['AIGC', 'Gradio', 'WebUI'], size: '12.5GB', updated: '3天前', command: 'docker pull bitahub/sd-webui:latest', recommendedGpu: 'RTX 4090 / L40S', images: ['https://picsum.photos/seed/sd1/800/400', 'https://picsum.photos/seed/sd2/800/400', 'https://picsum.photos/seed/sd3/800/400'] },
  { name: 'vLLM Inference', desc: '高吞吐量大语言模型推理引擎，支持 PagedAttention。', downloads: '3.2k', tags: ['LLM', 'Inference', 'vLLM'], size: '3.1GB', updated: '5小时前', command: 'docker pull bitahub/vllm:latest', recommendedGpu: 'A100 / H100', images: ['https://picsum.photos/seed/vllm1/800/400', 'https://picsum.photos/seed/vllm2/800/400', 'https://picsum.photos/seed/vllm3/800/400'] },
  { name: 'TensorFlow 2.15', desc: 'Google 开源机器学习框架，包含 TensorBoard。', downloads: '5.1k', tags: ['TensorFlow', 'Keras', 'Google'], size: '7.0GB', updated: '2周前', command: 'docker pull bitahub/tensorflow:2.15', recommendedGpu: 'RTX 4090 / A100', images: ['https://picsum.photos/seed/tf1/800/400', 'https://picsum.photos/seed/tf2/800/400', 'https://picsum.photos/seed/tf3/800/400'] },
  { name: 'JupyterLab Data Science', desc: '包含 Pandas, NumPy, Scikit-learn 等数据科学工具。', downloads: '9.8k', tags: ['Jupyter', 'Data Science', 'Python'], size: '5.5GB', updated: '1个月前', command: 'docker pull bitahub/jupyterlab:data-science', recommendedGpu: '通用 (Any)', images: ['https://picsum.photos/seed/jupyter1/800/400', 'https://picsum.photos/seed/jupyter2/800/400', 'https://picsum.photos/seed/jupyter3/800/400'] },
  { name: 'ComfyUI', desc: '最强大的节点式 Stable Diffusion 界面，支持 SDXL 和各类工作流。', downloads: '28k', tags: ['AIGC', 'ComfyUI', 'Node-based'], size: '15.2GB', updated: '1天前', command: 'docker pull bitahub/comfyui:latest', recommendedGpu: 'RTX 4090 / L40S', images: ['https://picsum.photos/seed/comfy1/800/400', 'https://picsum.photos/seed/comfy2/800/400', 'https://picsum.photos/seed/comfy3/800/400'] },
  { name: 'Ollama', desc: '本地运行 Llama 3, Mistral, Gemma 等开源大语言模型。', downloads: '18k', tags: ['LLM', 'Ollama', 'Local AI'], size: '2.8GB', updated: '4小时前', command: 'docker pull bitahub/ollama:latest', recommendedGpu: 'RTX 4090 / L40S', images: ['https://picsum.photos/seed/ollama1/800/400', 'https://picsum.photos/seed/ollama2/800/400', 'https://picsum.photos/seed/ollama3/800/400'] },
  { name: 'Qwen 1.5 72B Chat', desc: '通义千问 72B 聊天模型，预置 vLLM 推理环境。', downloads: '6.4k', tags: ['LLM', 'Qwen', 'vLLM'], size: '38.5GB', updated: '3天前', command: 'docker pull bitahub/qwen-72b-chat:latest', recommendedGpu: 'A100 (80GB) / H100', images: ['https://picsum.photos/seed/qwen1/800/400', 'https://picsum.photos/seed/qwen2/800/400', 'https://picsum.photos/seed/qwen3/800/400'] },
];

export default function LandingPage({ onEnter, onAuth }: LandingPageProps) {
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);
  const [selectedImageDetail, setSelectedImageDetail] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [sidebarImageSearch, setSidebarImageSearch] = useState('');
  const [sidebarImageCategory, setSidebarImageCategory] = useState('全部');
  const [activeView, setActiveView] = useState('home');
  const [imageSearch, setImageSearch] = useState('');
  const [imageCategory, setImageCategory] = useState('全部');
  const [helpSection, setHelpSection] = useState('faq');

  // Form State
  const [gpuType, setGpuType] = useState('NVIDIA A100');
  const [gpuCount, setGpuCount] = useState(1);
  const [diskSize, setDiskSize] = useState(100);
  const [accessSSH, setAccessSSH] = useState(true);
  const [accessVNC, setAccessVNC] = useState(false);
  const [billing, setBilling] = useState('按量付费');

  // Deployment State
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Calculate Price
  const basePrice = gpuType === 'NVIDIA A100' ? 3.5 : 4.8;
  const price = basePrice * gpuCount * (billing === '包月' ? 730 * 0.8 : 1);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      setTimeout(() => {
        onEnter('instances');
      }, 1500);
    }, 1500);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden relative font-sans transition-colors duration-1000 ${
      activeView === 'home' ? 'bg-[#dcdcd9] text-white' : 'bg-[#0F0C09] text-white selection:bg-amber-500/30'
    }`}>
      {/* Ambient Background Glows (Only for non-home views) */}
      {activeView !== 'home' && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-900/10 blur-[150px] rounded-full pointer-events-none" />
        </>
      )}

      {/* Top Navigation */}
      <nav className={`fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2.5 rounded-full border backdrop-blur-md z-50 shadow-2xl transition-colors duration-500 ${
        activeView === 'home' 
          ? 'border-white/20 bg-white/5 text-white mix-blend-difference' 
          : 'border-white/5 bg-[#1A1512]/80 text-white'
      }`}>
        <button onClick={() => setActiveView('home')} className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${activeView === 'home' ? 'text-white' : 'text-amber-500'}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8.5L15.5 10.5V13.5L12 15.5L8.5 13.5V10.5L12 8.5Z" fill="currentColor"/>
          </svg>
          <span className="font-sans font-bold text-xl tracking-tight">BitaHub</span>
        </button>
        <div className={`w-px h-4 ${activeView === 'home' ? 'bg-white/20' : 'bg-white/10'}`} />
        <button onClick={() => setActiveView('images')} className={`text-sm transition-colors ${activeView === 'images' ? 'text-white' : (activeView === 'home' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-white')}`}>镜像社区</button>
        <button onClick={() => setActiveView('deploy')} className={`text-sm transition-colors ${activeView === 'deploy' ? 'text-white' : (activeView === 'home' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-white')}`}>部署GPU实例</button>
        <button onClick={() => setActiveView('help')} className={`text-sm transition-colors ${activeView === 'help' ? 'text-white' : (activeView === 'home' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-white')}`}>帮助中心</button>
        <div className={`w-px h-4 ${activeView === 'home' ? 'bg-white/20' : 'bg-white/10'}`} />
        <button onClick={onAuth} className={`text-sm transition-colors ${activeView === 'home' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-white'}`}>登录/注册</button>
        <button onClick={() => onEnter('dashboard')} className={`text-sm font-medium transition-colors ${activeView === 'home' ? 'text-white hover:opacity-70' : 'text-amber-500 hover:text-amber-400'}`}>控制台</button>
      </nav>

      {/* Main Content */}
      {activeView === 'home' && (
        <div className="relative z-10 w-full font-['Space_Mono']">
          <div className="relative w-full h-screen overflow-hidden">
            <FluidBackground />
            
            {/* UI Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 mix-blend-difference">
              {/* Grid Lines */}
              <div className="absolute w-[1px] h-screen top-0 left-16 bg-white opacity-15" />
              <div className="absolute w-[1px] h-screen top-0 right-16 bg-white opacity-15" />
              <div className="absolute h-[1px] w-screen left-0 top-16 bg-white opacity-15" />
              <div className="absolute h-[1px] w-screen left-0 bottom-16 bg-white opacity-15" />

              {/* Film Strip */}
              <div className="absolute top-0 bottom-0 left-16 -translate-x-1/2 w-32 overflow-hidden z-20 pointer-events-auto mask-image-vertical hidden md:block">
                <style>{`
                  @keyframes scrollY {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                  }
                  .animate-scroll-y {
                    animation: scrollY 30s linear infinite;
                  }
                  .animate-scroll-y:hover {
                    animation-play-state: paused;
                  }
                  .mask-image-vertical {
                    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                  }
                `}</style>
                <div className="flex flex-col gap-8 animate-scroll-y pb-8 pt-8">
                  {[...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES].map((image, idx) => {
                    const Icon = image.icon;
                    return (
                      <div 
                        key={idx}
                        className="relative w-full h-48 shrink-0 border border-white/10 hover:border-white/80 transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center p-4 bg-black/20 backdrop-blur-sm group"
                        onClick={() => {
                          setSelectedImage(image);
                          setIsSidebarOpen(true);
                        }}
                      >
                        {/* Sprocket holes left */}
                        <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-3">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-white/10 rounded-sm group-hover:bg-white/30 transition-colors" />
                          ))}
                        </div>
                        {/* Sprocket holes right */}
                        <div className="absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-3">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-white/10 rounded-sm group-hover:bg-white/30 transition-colors" />
                          ))}
                        </div>

                        <div className="absolute inset-0 p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-[10px] text-gray-300 text-center leading-relaxed font-sans">{image.desc}</p>
                        </div>
                        
                        <div className="flex flex-col items-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                          <Icon className="w-8 h-8 text-white/60 mb-4" />
                          <div className="text-[10px] text-center font-mono text-white/60 leading-relaxed">
                            {image.shortName.map((line: string, i: number) => <div key={i}>{line}</div>)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reg Marks */}
              <div className="absolute top-8 left-8 w-[15px] h-[15px] before:content-[''] before:absolute before:bg-white before:top-[7px] before:left-0 before:w-[15px] before:h-[1px] after:content-[''] after:absolute after:bg-white after:left-[7px] after:top-0 after:w-[1px] after:h-[15px]" />
              <div className="absolute top-8 right-8 w-[15px] h-[15px] before:content-[''] before:absolute before:bg-white before:top-[7px] before:left-0 before:w-[15px] before:h-[1px] after:content-[''] after:absolute after:bg-white after:left-[7px] after:top-0 after:w-[1px] after:h-[15px]" />
              <div className="absolute bottom-8 left-8 w-[15px] h-[15px] before:content-[''] before:absolute before:bg-white before:top-[7px] before:left-0 before:w-[15px] before:h-[1px] after:content-[''] after:absolute after:bg-white after:left-[7px] after:top-0 after:w-[1px] after:h-[15px]" />
              <div className="absolute bottom-8 right-8 w-[15px] h-[15px] before:content-[''] before:absolute before:bg-white before:top-[7px] before:left-0 before:w-[15px] before:h-[1px] after:content-[''] after:absolute after:bg-white after:left-[7px] after:top-0 after:w-[1px] after:h-[15px]" />

              {/* Top Metadata */}
              <div className="flex justify-between px-8 pt-8 text-[0.65rem] tracking-[0.15em] uppercase leading-relaxed mix-blend-normal mt-12">
                <div className="flex flex-col gap-1">
                  <span className="opacity-50">SYSTEM_ID</span>
                  <span>BITAHUB.CORE // 001.992</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="opacity-50">COORDINATES</span>
                  <span>43° 0' 0" N / 81° 0' 0" W</span>
                </div>
              </div>

              {/* Main Title */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center flex flex-col items-center gap-4">
                <div className="text-[0.75rem] tracking-[0.4em] uppercase ml-4">[ INTELLIGENT INFERENCE ENGINE ]</div>
                <h1 className="font-['Cormorant_Garamond'] text-[clamp(6rem,15vw,18rem)] font-light leading-[0.8] tracking-[-0.02em] whitespace-nowrap">
                  B I T A<span className="italic font-medium pr-[1vw]">H U B</span>
                </h1>
                
                {/* Interactive Elements */}
                <div className="pointer-events-auto mt-12 flex justify-center mix-blend-normal">
                  {/* Deploy Button */}
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="relative w-32 h-32 rounded-full border border-white/30 bg-black/20 backdrop-blur-md flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all duration-500 hover:bg-white neon-breathe-amber"
                  >
                    <ArrowUp className="w-8 h-8 rotate-45 group-hover:rotate-90 transition-transform duration-500 text-white group-hover:text-amber-500" />
                    <span className="font-['Space_Mono'] font-bold tracking-widest uppercase text-sm text-white group-hover:text-amber-500 transition-colors duration-500">配置部署</span>
                  </button>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="flex justify-between items-end px-8 pb-8 text-[0.65rem] tracking-[0.15em] uppercase leading-relaxed">
                <div className="max-w-[250px] text-left flex flex-col gap-1">
                  <span className="opacity-50">PROCESS LOG</span>
                  <span>Converting raw compute into structured neural networks. Fluid dynamics uncontrolled. Awaiting total systemic saturation.</span>
                </div>
                
                <div className="flex items-end gap-2 font-['Cormorant_Garamond'] text-[3rem] font-light leading-none tracking-[-0.05em]">
                  <div id="fluid-counter">0.000</div>
                  <span className="font-['Space_Mono'] text-[0.75rem] tracking-[0.1em] pb-[0.6rem]">% SATURATED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-[#0F0C09] text-white relative z-20">
            
            {/* Image Carousel */}
            <ImageCarousel 
              items={COMMUNITY_IMAGES} 
              onItemClick={(item) => {
                setSelectedImage(item);
                setActiveView('deploy');
                setIsSidebarOpen(true);
              }} 
            />

            {/* Section 1: 核心场景 (What it can do) */}
            <div className="px-8 py-32 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#f4f4f5]">释放 AI 生产力</h2>
                  <p className="text-gray-400 font-mono text-sm max-w-2xl leading-relaxed">
                    专为 AI 开发者打造的高性能 GPU 云平台。无论是训练千亿参数大模型，还是部署高并发推理服务，BitaHub 都能提供稳定、弹性的算力支持。
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: '大语言模型 (LLM)', desc: '支持 Llama 3, Qwen 等主流开源模型的全量微调 (SFT) 与高效推理 (vLLM)。提供多机多卡高速互联网络。', icon: Database },
                    { title: 'AIGC 图像与视频', desc: '预装 Stable Diffusion WebUI, ComfyUI 等开箱即用的创作环境。秒级启动，释放无限创意。', icon: Sparkles },
                    { title: '科学计算与深度学习', desc: '内置 PyTorch, TensorFlow 等深度学习框架，集成 JupyterLab，适合科研人员与数据科学家。', icon: Terminal }
                  ].map((scenario, i) => (
                    <div key={i} className="p-8 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] hover:border-amber-500/30 transition-all group">
                      <scenario.icon className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-3">{scenario.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{scenario.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: 透明计费 (How it charges) */}
            <div className="px-8 py-32 border-t border-white/10 bg-[#120E0B]">
              <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#f4f4f5]">透明、灵活的计费</h2>
                    <p className="text-gray-400 font-mono text-sm max-w-2xl leading-relaxed">
                      按秒计费，用多少付多少。关机仅收取极低的存储费用。无隐藏账单，让您的每一分钱都花在刀刃上。
                    </p>
                  </div>
                  <button onClick={() => setActiveView('deploy')} className="text-amber-500 hover:text-amber-400 font-mono text-sm flex items-center gap-2 transition-colors">
                    查看完整报价单 <ArrowUp className="w-4 h-4 rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { name: 'RTX 4090', mem: '24GB', price: '0.80', desc: '高性价比微调与推理' },
                    { name: 'L40S', mem: '48GB', price: '1.20', desc: '通用 AI 与图形加速' },
                    { name: 'A100 PCIe', mem: '80GB', price: '3.50', desc: '主流大模型训练首选' },
                    { name: 'H100 SXM5', mem: '80GB', price: '4.80', desc: '极致性能，突破算力瓶颈', highlight: true }
                  ].map((gpu, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${gpu.highlight ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-[#1A1512]/50'} relative overflow-hidden`}>
                      {gpu.highlight && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">推荐</div>}
                      <h3 className="text-lg font-bold text-white mb-1">{gpu.name}</h3>
                      <div className="text-xs text-amber-500/80 font-mono mb-6">{gpu.mem} VRAM</div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-light text-amber-500">${gpu.price}</span>
                        <span className="text-xs text-gray-500">/小时</span>
                      </div>
                      <p className="text-gray-400 text-xs">{gpu.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: 极速上手 (How to start) */}
            <div className="px-8 py-32 border-t border-white/10">
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#f4f4f5]">30秒开启您的 AI 之旅</h2>
                <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto leading-relaxed mb-16">
                  告别繁琐的环境配置，三步即可进入开发状态。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Connecting Line */}
                  <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent -translate-y-1/2 z-0" />
                  
                  {[
                    { step: '01', title: '注册账号', desc: '使用邮箱或 GitHub 快速注册，新用户即赠送 $10 体验金。' },
                    { step: '02', title: '选择算力与镜像', desc: '在控制台选择适合的 GPU 型号，并挑选预装好环境的社区镜像。' },
                    { step: '03', title: '一键部署', desc: '点击部署，秒级分配资源。通过 SSH 或 JupyterLab 立即开始编写代码。' }
                  ].map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#0F0C09] border border-amber-500/30 flex items-center justify-center text-amber-500 font-mono text-xl font-bold mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xs text-center">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-20">
                  <button onClick={onAuth} className="relative p-[2px] group inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-[#1A1512] text-white px-10 py-4 rounded-lg font-mono text-sm font-medium tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-3">
                      立即免费注册 <ArrowUp className="w-4 h-4 rotate-45 text-amber-500" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-12 border-t border-white/10 bg-black text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="font-semibold tracking-wide text-white">BitaHub</span>
              </div>
              <p className="text-gray-500 text-xs font-mono">© 2026 BitaHub Cloud. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Images View */}
      {activeView === 'images' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-light mb-2 text-gray-100">镜像社区</h2>
              <p className="text-gray-400">探索并使用预配置的深度学习环境和基础模型镜像。</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex bg-[#1A1512]/80 border border-white/10 rounded-lg p-1 w-full md:w-auto overflow-x-auto">
                {['全部', '大语言模型', '图像生成', '基础框架'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setImageCategory(cat)}
                    className={`px-4 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${imageCategory === cat ? 'bg-amber-500/20 text-amber-500' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="搜索镜像..." 
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  className="w-full bg-[#1A1512]/80 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-colors" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_IMAGES.filter(img => {
              const matchesSearch = img.name.toLowerCase().includes(imageSearch.toLowerCase()) || img.desc.toLowerCase().includes(imageSearch.toLowerCase());
              const matchesCategory = imageCategory === '全部' || 
                (imageCategory === '大语言模型' && img.tags.some(t => ['LLM', 'vLLM', 'Ollama', 'Qwen'].includes(t))) ||
                (imageCategory === '图像生成' && img.tags.some(t => ['AIGC', 'Gradio', 'WebUI', 'ComfyUI'].includes(t))) ||
                (imageCategory === '基础框架' && img.tags.some(t => ['Linux', 'CUDA', 'PyTorch', 'TensorFlow', 'Jupyter'].includes(t)));
              return matchesSearch && matchesCategory;
            }).map((img, i) => (
              <div key={i} onClick={() => { setSelectedImageDetail(img); setCurrentImageIndex(0); }} className="p-6 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] hover:border-amber-500/30 transition-all cursor-pointer group hover:neon-breathe-amber flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-5 group-hover:bg-amber-500/20 transition-colors">
                  <Box className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">{img.name}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">{img.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                    <Download className="w-3.5 h-3.5" /> {img.downloads} 次下载
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full transition-colors">
                    使用此镜像
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Deploy View */}
      {activeView === 'deploy' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700">
          <h2 className="text-4xl font-light mb-2 text-gray-100">部署 GPU 实例</h2>
          <p className="text-gray-400 mb-10">按需选择高性能算力，秒级启动您的 AI 工作站。</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'NVIDIA A100 80GB', price: '$3.50', mem: '80GB VRAM', perf: '极致性能，适合大模型训练与推理' },
                  { name: 'NVIDIA H100 80GB', price: '$4.80', mem: '80GB HBM3', perf: '新一代架构，Transformer 性能翻倍' },
                  { name: 'NVIDIA RTX 4090', price: '$0.80', mem: '24GB VRAM', perf: '高性价比，适合中小型模型微调' },
                  { name: 'NVIDIA L40S', price: '$1.20', mem: '48GB VRAM', perf: '通用图形与 AI 加速' },
                ].map((gpu, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:border-amber-500/30 transition-colors cursor-pointer group hover:neon-breathe-amber">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                        <Cpu className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-gray-200 font-medium text-lg">{gpu.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{gpu.perf} · <span className="text-amber-500/80 font-mono">{gpu.mem}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-amber-500">{gpu.price}<span className="text-sm text-gray-500">/小时</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#1A1512]/80 border border-white/10 rounded-3xl p-8 sticky top-32">
                <h3 className="text-xl font-medium text-gray-200 mb-4">快速启动</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">选择您需要的配置，立即在云端启动您的专属 AI 工作站。支持 SSH 和 VNC 远程访问。</p>
                <button onClick={() => setIsSidebarOpen(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
                  打开部署面板
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & API View */}
      {activeView === 'help' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700 flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">帮助中心</h3>
                <div className="space-y-1">
                  <button onClick={() => setHelpSection('faq')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'faq' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>常见问题 (FAQ)</button>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">API 文档</h3>
                <div className="space-y-1">
                  <button onClick={() => setHelpSection('intro')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'intro' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>基础 URL 与规范</button>
                  <button onClick={() => setHelpSection('auth')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'auth' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>认证 (Authentication)</button>
                  <button onClick={() => setHelpSection('instances')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'instances' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>实例 (Instances)</button>
                  <button onClick={() => setHelpSection('images')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'images' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>镜像 (Images)</button>
                  <button onClick={() => setHelpSection('storage')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${helpSection === 'storage' ? 'bg-amber-500/10 text-amber-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>存储 (Storage)</button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-4xl">
            {helpSection === 'faq' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-light mb-2 text-gray-100">常见问题</h2>
                <p className="text-gray-400 mb-10">查找常见问题解答或联系我们的技术支持团队。</p>
                
                <div className="relative mb-12">
                  <input type="text" placeholder="搜索帮助文档..." className="w-full bg-[#1A1512]/80 border border-white/10 rounded-2xl px-6 py-4 text-gray-200 focus:outline-none focus:border-amber-500/50 transition-colors shadow-xl" />
                </div>

                <div className="space-y-4">
                  {[
                    { q: '如何连接到我的 GPU 实例？', a: '实例启动后，您可以通过控制台提供的 SSH 命令直接连接，或者点击 VNC 按钮在浏览器中打开图形界面。SSH 密钥可以在控制台的"设置"中进行管理。' },
                    { q: '计费方式是怎样的？', a: '我们采用按秒计费的模式。当实例处于"运行中"状态时将收取 GPU 和磁盘费用；当实例处于"已停止"状态时，仅收取磁盘存储费用。包月套餐可享受约 20% 的折扣。' },
                    { q: '如何上传我的数据和模型？', a: '您可以使用 SCP/SFTP 通过 SSH 隧道上传数据，或者挂载 BitaHub NFS / S3 兼容存储，在多个实例间共享数据。大文件推荐使用 S3 兼容存储。' },
                    { q: '支持哪些深度学习框架？', a: '我们的镜像社区提供了预装 PyTorch, TensorFlow, JAX 等主流框架的镜像。您也可以使用基础 Ubuntu 镜像自行安装所需环境。所有官方镜像均已配置好对应的 CUDA 和 cuDNN。' },
                    { q: '实例关机后数据会丢失吗？', a: '不会。只要您不主动"销毁"实例，系统盘和挂载的数据盘数据都会永久保留。但请注意，关机状态下仍会收取少量的磁盘存储费用。' },
                  ].map((faq, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] transition-colors hover:neon-breathe-amber">
                      <h3 className="text-lg font-medium text-gray-200 mb-3">{faq.q}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {helpSection === 'auth' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-light text-white mb-4">认证 (Authentication)</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    BitaHub API 使用 Bearer Token 进行身份验证。您需要在控制台的"API 密钥"页面生成您的个人访问令牌 (Personal Access Token)。
                  </p>
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                      <span className="text-xs font-mono text-gray-400">cURL</span>
                      <button className="text-gray-500 hover:text-white transition-colors"><Copy className="w-4 h-4" /></button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300">
                        <span className="text-pink-400">curl</span> -X GET https://api.bitahub.com/v1/users/me \
                        <br/>{'  '}-H <span className="text-green-400">"Authorization: Bearer YOUR_API_TOKEN"</span>
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-500/90 leading-relaxed">
                    请妥善保管您的 API 密钥。不要将其硬编码在客户端代码或公开的代码仓库中。如果密钥泄露，请立即在控制台撤销并重新生成。
                  </p>
                </div>
              </div>
            )}

            {helpSection === 'instances' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-light text-white mb-4">实例 (Instances)</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    实例 API 允许您以编程方式创建、查询、启动、停止和销毁 GPU 实例。这对于构建自动化的 CI/CD 流程或弹性伸缩的推理集群非常有用。
                  </p>
                </div>

                {/* Endpoint 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">GET</span>
                    <h3 className="text-lg font-medium text-gray-200 font-mono">/v1/instances</h3>
                  </div>
                  <p className="text-sm text-gray-400">获取当前账号下的所有实例列表。</p>
                  
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                      <span className="text-xs font-mono text-gray-400">Response (200 OK)</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300">
{`{
  "data": [
    {
      "id": "inst_8f92a1b",
      "name": "llama3-finetune",
      "status": "running",
      "gpu_type": "NVIDIA A100",
      "gpu_count": 8,
      "created_at": "2026-03-26T10:00:00Z"
    }
  ],
  "total": 1
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Endpoint 2 */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-mono text-xs font-bold">POST</span>
                    <h3 className="text-lg font-medium text-gray-200 font-mono">/v1/instances</h3>
                  </div>
                  <p className="text-sm text-gray-400">创建一个新的 GPU 实例。</p>
                  
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                      <span className="text-xs font-mono text-gray-400">cURL</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300">
<span className="text-pink-400">curl</span> -X POST https://api.bitahub.com/v1/instances \
<br/>{'  '}-H <span className="text-green-400">"Authorization: Bearer YOUR_API_TOKEN"</span> \
<br/>{'  '}-H <span className="text-green-400">"Content-Type: application/json"</span> \
<br/>{'  '}-d <span className="text-yellow-400">'{`{
    "name": "sd-webui-server",
    "gpu_type": "NVIDIA RTX 4090",
    "gpu_count": 1,
    "image_id": "img_sd_webui_latest",
    "disk_size_gb": 100
  }`}'</span>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {helpSection === 'intro' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-light text-white mb-4">基础 URL 与规范</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    BitaHub API 遵循 RESTful 架构风格，使用 JSON 作为数据交换格式。所有的 API 请求都必须通过 HTTPS 进行。
                  </p>
                  
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-mono text-gray-300 mb-2">Base URL</h3>
                      <code className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-amber-500 font-mono text-sm block">
                        https://api.bitahub.com/v1
                      </code>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-mono text-gray-300 mb-2">Content-Type</h3>
                      <p className="text-sm text-gray-400 mb-2">所有的 POST、PUT、PATCH 请求都必须包含以下请求头：</p>
                      <code className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-green-400 font-mono text-sm block">
                        Content-Type: application/json
                      </code>
                    </div>

                    <div>
                      <h3 className="text-sm font-mono text-gray-300 mb-2">速率限制 (Rate Limiting)</h3>
                      <p className="text-sm text-gray-400">
                        API 请求限制为每分钟 100 次。超出限制将返回 <code className="text-amber-500">429 Too Many Requests</code> 状态码。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {helpSection === 'images' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-light text-white mb-4">镜像 (Images)</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    镜像 API 允许您查询平台提供的官方镜像和社区镜像，以便在创建实例时使用。
                  </p>
                </div>

                {/* Endpoint 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">GET</span>
                    <h3 className="text-lg font-medium text-gray-200 font-mono">/v1/images</h3>
                  </div>
                  <p className="text-sm text-gray-400">获取可用的镜像列表。支持通过查询参数进行过滤。</p>
                  
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                      <span className="text-xs font-mono text-gray-400">Response (200 OK)</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300">
{`{
  "data": [
    {
      "id": "img_ubuntu_cuda12",
      "name": "Ubuntu 22.04 + CUDA 12.1",
      "type": "official",
      "tags": ["Linux", "CUDA"],
      "size_gb": 4.2
    }
  ],
  "total": 45
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {helpSection === 'storage' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-light text-white mb-4">存储 (Storage)</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    存储 API 允许您管理云端数据卷。数据卷可以挂载到您的 GPU 实例中，用于持久化保存训练数据、模型权重和代码。
                  </p>
                </div>

                {/* Endpoint 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-mono text-xs font-bold">POST</span>
                    <h3 className="text-lg font-medium text-gray-200 font-mono">/v1/storage/volumes</h3>
                  </div>
                  <p className="text-sm text-gray-400">创建一个新的数据卷。</p>
                  
                  <div className="bg-[#1A1512] border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                      <span className="text-xs font-mono text-gray-400">cURL</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300">
<span className="text-pink-400">curl</span> -X POST https://api.bitahub.com/v1/storage/volumes \
<br/>{'  '}-H <span className="text-green-400">"Authorization: Bearer YOUR_API_TOKEN"</span> \
<br/>{'  '}-H <span className="text-green-400">"Content-Type: application/json"</span> \
<br/>{'  '}-d <span className="text-yellow-400">'{`{
    "name": "dataset-vol-01",
    "size_gb": 500,
    "type": "nvme"
  }`}'</span>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Right Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#120E0B]/95 backdrop-blur-2xl border-l border-white/10 z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1512]/50">
          <h2 className="text-lg font-medium text-gray-100">{isSelectingImage ? '选择镜像' : '配置实例'}</h2>
          <button onClick={() => {
            if (isSelectingImage) {
              setIsSelectingImage(false);
            } else {
              setIsSidebarOpen(false);
            }
          }} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            {isSelectingImage ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isSelectingImage ? (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="搜索镜像名称或描述..." 
                  value={sidebarImageSearch}
                  onChange={(e) => setSidebarImageSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['全部', '官方推荐', '社区镜像'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSidebarImageCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${sidebarImageCategory === cat ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Image List */}
              <div className="space-y-3">
                {/* Official Images */}
                {(sidebarImageCategory === '全部' || sidebarImageCategory === '官方推荐') && IMAGES.filter(img => 
                  img.name.toLowerCase().includes(sidebarImageSearch.toLowerCase()) || 
                  img.desc.toLowerCase().includes(sidebarImageSearch.toLowerCase())
                ).map((img, idx) => (
                  <div 
                    key={`official-${idx}`}
                    onClick={() => {
                      setSelectedImage(img);
                      setIsSelectingImage(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${selectedImage.name === img.name ? 'bg-amber-500/10 border-amber-500/50' : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedImage.name === img.name ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-gray-400'}`}>
                      <img.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-200">{img.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-500 border border-amber-500/20">官方</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{img.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Community Images */}
                {(sidebarImageCategory === '全部' || sidebarImageCategory === '社区镜像') && COMMUNITY_IMAGES.filter(img => 
                  img.name.toLowerCase().includes(sidebarImageSearch.toLowerCase()) || 
                  img.desc.toLowerCase().includes(sidebarImageSearch.toLowerCase())
                ).map((img, idx) => (
                  <div 
                    key={`community-${idx}`}
                    onClick={() => {
                      setSelectedImage(img);
                      setIsSelectingImage(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${selectedImage.name === img.name ? 'bg-amber-500/10 border-amber-500/50' : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedImage.name === img.name ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-gray-400'}`}>
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-200">{img.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/20">社区</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Image Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    {selectedImage.icon ? <selectedImage.icon className="w-6 h-6 text-amber-500" /> : <Box className="w-6 h-6 text-amber-500" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-amber-500/80 mb-1 uppercase tracking-wider">已选镜像</div>
                    <div className="text-base font-medium text-amber-500 line-clamp-1">{selectedImage.name}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSelectingImage(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-medium transition-colors border border-amber-500/20 shrink-0"
                >
                  更换
                </button>
              </div>

              {/* Cluster */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Server className="w-3 h-3"/> 集群区域</label>
            <div className="relative">
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 appearance-none transition-colors">
                <option>美东 (弗吉尼亚北部)</option>
                <option>美西 (俄勒冈)</option>
                <option>欧洲中部 (法兰克福)</option>
                <option>亚太东北 (东京)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* GPU Model */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Cpu className="w-3 h-3"/> GPU 加速器</label>
            <div className="grid grid-cols-2 gap-3">
              {['NVIDIA A100', 'NVIDIA H100'].map(gpu => (
                <button
                  key={gpu}
                  onClick={() => setGpuType(gpu)}
                  className={`p-3 rounded-xl border text-left transition-all ${gpuType === gpu ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
                >
                  <div className="text-sm font-medium">{gpu}</div>
                  <div className="text-[10px] font-mono mt-1 opacity-70">{gpu === 'NVIDIA A100' ? '80GB VRAM' : '80GB HBM3'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* GPU Count */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">GPU 数量</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              {[1, 2, 4, 8].map(num => (
                <button
                  key={num}
                  onClick={() => setGpuCount(num)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gpuCount === num ? 'bg-amber-500/20 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Disk & Storage */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><HardDrive className="w-3 h-3"/> 系统盘</label>
                <span className="text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded">{diskSize} GB</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Database className="w-3 h-3"/> 云存储</label>
              <div className="relative">
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 appearance-none transition-colors">
                  <option>无</option>
                  <option>BitaHub NFS (1TB) - $10/月</option>
                  <option>S3 兼容 (自动扩容)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Access Method */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">访问方式</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setAccessSSH(!accessSSH)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessSSH ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Terminal className="w-4 h-4" /> 
                <span className="text-sm font-medium">SSH</span>
              </button>
              <button onClick={() => setAccessVNC(!accessVNC)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessVNC ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Monitor className="w-4 h-4" /> 
                <span className="text-sm font-medium">VNC</span>
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><CreditCard className="w-3 h-3"/> 计费周期</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              {['按量付费', '包月'].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${billing === cycle ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSelectingImage && (
          <div className="p-6 border-t border-white/5 bg-[#1A1512]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">预估费用</span>
              <span className="text-2xl font-light text-amber-500">${price.toFixed(2)}<span className="text-sm text-gray-500">/{billing === '按量付费' ? '小时' : '月'}</span></span>
            </div>
            {isDeployed ? (
              <button 
                className="w-full py-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/30 font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Check className="w-5 h-5" />
                部署成功，正在跳转...
              </button>
            ) : (
              <button 
                onClick={handleDeploy} 
                disabled={isDeploying}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                  isDeploying 
                    ? 'bg-white/10 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] neon-breathe-amber'
                }`}
              >
                {isDeploying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    部署中...
                  </div>
                ) : (
                  '部署到控制台'
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImageDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedImageDetail(null)} />
          <div className="relative w-full max-w-2xl bg-[#1A1512] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Box className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-100">{selectedImageDetail.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><Download className="w-3 h-3" /> {selectedImageDetail.downloads}</span>
                    <span className="text-xs text-gray-500 font-mono">• {selectedImageDetail.size}</span>
                    <span className="text-xs text-gray-500 font-mono">• 更新于 {selectedImageDetail.updated}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedImageDetail(null)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Image Carousel */}
              {selectedImageDetail.images && selectedImageDetail.images.length > 0 && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                  <img 
                    src={selectedImageDetail.images[currentImageIndex]} 
                    alt={`${selectedImageDetail.name} preview`} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Carousel Controls */}
                  {selectedImageDetail.images.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === 0 ? selectedImageDetail.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === selectedImageDetail.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {selectedImageDetail.images.map((_: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-amber-500 w-4' : 'bg-white/50 hover:bg-white/80'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">镜像介绍</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedImageDetail.desc}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">推荐 GPU</h4>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-mono">
                  <Cpu className="w-4 h-4" />
                  {selectedImageDetail.recommendedGpu}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">环境标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedImageDetail.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">部署方式</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-300 font-medium">Docker CLI 拉取</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{selectedImageDetail.command}</div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedImageDetail(null)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setSelectedImage(selectedImageDetail);
                  setSelectedImageDetail(null);
                  setIsSidebarOpen(true);
                  setIsSelectingImage(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-medium hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4 rotate-45" />
                使用此镜像
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NodeCard({ x, y, label, delay }: { x: number, y: number, label: string, delay: string }) {
  return (
    <div 
      className="absolute w-56 h-32 rounded-2xl border border-white/10 bg-[#221C18]/90 backdrop-blur-xl p-5 flex flex-col justify-between shadow-2xl z-20 transition-transform duration-700 hover:-translate-y-2 animate-[float_6s_ease-in-out_infinite] hover:neon-breathe-amber"
      style={{ left: x, top: y, transform: 'translateZ(50px)', animationDelay: delay }}
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
          <div className="w-20 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="w-32 h-1.5 rounded-full bg-white/5 mt-3" />
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <span className="text-[11px] font-mono text-gray-500 tracking-wider">{label}</span>
        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-amber-500 border-b-[4px] border-b-transparent ml-0.5" />
        </div>
      </div>
    </div>
  );
}
