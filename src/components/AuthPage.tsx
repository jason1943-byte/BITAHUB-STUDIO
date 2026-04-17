import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mail, Lock, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export default function AuthPage({ onBack }: AuthPageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sysTime, setSysTime] = useState('00:00:00');
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setSysTime(now.toISOString().substr(11, 8));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 3.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const vertexShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normalize(normalMatrix * normal);
                float noise = snoise(vec3(position.x * 2.0 + time * 0.2, position.y * 2.0, position.z * 2.0));
                vec3 newPosition = position + normal * (noise * 0.2);
                vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
                return a + b*cos( 6.28318*(c*t+d) );
            }
            void main() {
                vec3 viewDirection = normalize(-vPosition);
                float fresnel = dot(viewDirection, vNormal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 3.0);
                float colorFactor = vNormal.x * 0.5 + vNormal.y * 0.5 + 0.5;
                // Maintained original color palette from reference
                vec3 baseColor = palette(colorFactor + fresnel, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.263, 0.416, 0.557));
                vec3 finalColor = mix(vec3(0.02), baseColor, fresnel * 1.5);
                gl_FragColor = vec4(finalColor, 0.9);
            }
        `;

        const geometry = new THREE.SphereGeometry(1.6, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader, fragmentShader, 
            uniforms: { time: { value: 0 } },
            transparent: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.y = 0.2;
        scene.add(mesh);

        const clock = new THREE.Clock();
        let animationFrameId: number;
        
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            material.uniforms.time.value = clock.getElapsedTime();
            mesh.rotation.y += 0.003;
            mesh.rotation.x += 0.001;
            renderer.render(scene, camera);
        }
        animate();

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div className="w-full h-screen flex font-sans antialiased selection:bg-terminal selection:text-bg bg-bg text-fg overflow-hidden relative">
            <button 
                onClick={onBack}
                className="absolute top-8 left-8 z-50 font-mono text-[10px] text-muted hover:text-terminal transition-colors tracking-widest uppercase flex items-center gap-2"
            >
                &lt; RETURN_TO_NEXUS
            </button>

            <div className="relative w-1/2 h-full border-r border-border flex flex-col justify-between p-12 overflow-hidden bg-bg">
                <div ref={containerRef} className="absolute inset-0 z-0"></div>
                
                <div className="relative z-10 pointer-events-none flex justify-between items-start w-full">
                    <div className="font-mono text-[10px] text-muted tracking-widest uppercase flex flex-col gap-1">
                        <span>SECURE_NODE // ALPHA_QUADRANT</span>
                        <span>SYS_ID: 8X-99B</span>
                    </div>
                    <div className="w-8 h-8 border border-border flex items-center justify-center">
                        <div className="w-2 h-2 bg-terminal rounded-full animate-pulse shadow-[0_0_8px_#00ff41]"></div>
                    </div>
                </div>

                <div className="relative z-10 pointer-events-none pb-12">
                    <h1 className="text-[8vw] leading-[0.85] font-bold tracking-tighter uppercase mix-blend-difference text-fg">
                        Bita<br />Hub
                    </h1>
                    <div className="font-mono text-xs text-muted mt-6 flex items-center gap-4">
                        <div className="h-px w-12 bg-border"></div>
                        <span className="tracking-[0.2em] uppercase">Data Nexus / Authenticate</span>
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-full flex flex-col relative p-16 justify-center bg-[#0a080d]">
                <div className="max-w-md w-full mx-auto">
                    <div className="flex gap-8 mb-8 border-b border-white/10 pb-4 relative">
                        <button 
                            onClick={() => setActiveTab('login')}
                            className={`text-sm font-medium transition-colors relative z-10 ${activeTab === 'login' ? 'text-white' : 'text-gray-500'}`}
                        >
                            登录
                            {activeTab === 'login' && (
                                <motion.div layoutId="activeTab" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-amber-500" />
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('register')}
                            className={`text-sm font-medium transition-colors relative z-10 ${activeTab === 'register' ? 'text-white' : 'text-gray-500'}`}
                        >
                            注册账号
                            {activeTab === 'register' && (
                                <motion.div layoutId="activeTab" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-amber-500" />
                            )}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-2xl font-semibold mb-2">
                                {activeTab === 'login' ? '欢迎回来' : '开启旅程'}
                            </motion.h2>
                            <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-gray-400 text-sm mb-8">
                                {activeTab === 'login' ? '初始化您的会话以访问工作区。' : '创建一个新账号以开始使用 BitaHub。'}
                            </motion.p>

                            <motion.form 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6" 
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">邮箱地址</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <input type="email" placeholder="name@domain.com" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all focus:bg-black/40" />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">密码</label>
                                        {activeTab === 'login' && <span className="text-[10px] text-gray-500 cursor-pointer hover:text-white transition-colors">忘记密码？</span>}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                        <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all focus:bg-black/40" />
                                    </div>
                                </motion.div>

                                {activeTab === 'login' && (
                                    <motion.label variants={itemVariants} className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                                        <input type="checkbox" className="rounded border-white/10 bg-black/20 accent-amber-500 cursor-pointer" />
                                        记住我
                                    </motion.label>
                                )}

                                <motion.button 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/20 border-none text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                                >
                                    {activeTab === 'login' ? '验证并登录' : '立即注册'} 
                                    <motion.span 
                                        className="text-lg inline-block"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                    >→</motion.span>
                                </motion.button>
                            </motion.form>

                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="my-8 text-center text-[10px] uppercase tracking-widest text-gray-600 font-mono relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <span className="relative bg-[#0a080d] px-4">其他登录方式</span>
                            </motion.div>

                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="grid grid-cols-2 gap-4"
                            >
                                <motion.button 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium transition-all"
                                >
                                    <MessageCircle className="w-4 h-4 text-green-500" /> 微信
                                </motion.button>
                                <motion.button 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium transition-all"
                                >
                                    <Phone className="w-4 h-4 text-amber-500" /> 手机号
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 pt-6 border-t border-white/10 flex justify-between text-[10px] text-gray-600 font-mono"
                    >
                        <span>系统版本: 2.4.1</span>
                        <span className="flex items-center gap-1 text-green-500">
                            <motion.div 
                                animate={{ opacity: [1, 0.5, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }} 
                                className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" 
                            /> 
                            安全连接
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
