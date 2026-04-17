import React, { useState } from 'react';
import { 
  Search, Filter, Star, Download, Cpu, ArrowRight, Image as ImageIcon, ArrowLeft, Terminal, CheckCircle2, Clock
} from 'lucide-react';

const mockImages = [
  { 
    id: 'img-1', 
    name: 'PyTorch 2.2.0', 
    desc: '官方基础镜像，包含 Ubuntu 22.04, Python 3.10, CUDA 12.1 及常用数据科学包。', 
    tags: ['Official', 'PyTorch', 'CUDA 12.1'], 
    recommendedGpu: 'A10 / RTX 4090',
    usageCount: '12.5k',
    isHot: true,
    author: 'BitaHub Official',
    updatedAt: '2024-03-20',
    size: '8.5 GB',
    dockerCommand: 'docker pull bitahub.com/official/pytorch:2.2.0-cuda12.1',
    features: [
      '预装 PyTorch 2.2.0',
      '预装 CUDA 12.1 和 cuDNN 8',
      '包含 JupyterLab 交互式环境',
      '内置常用数据科学包 (NumPy, Pandas, Matplotlib)'
    ],
    readme: `## PyTorch 2.2.0 官方镜像

这是一个为深度学习开发者准备的开箱即用的 PyTorch 环境。

### 包含的软件版本：
* Ubuntu 22.04 LTS
* Python 3.10
* PyTorch 2.2.0
* CUDA 12.1
* cuDNN 8.9.2

### 快速开始
启动实例后，您可以通过 JupyterLab 或 SSH 连接到环境。默认工作目录为 \`/workspace\`。`
  },
  { 
    id: 'img-2', 
    name: 'vLLM 0.4.0', 
    desc: '专为大语言模型推理优化的镜像，支持 PagedAttention，开箱即用。', 
    tags: ['Official', 'LLM', 'Inference'], 
    recommendedGpu: 'A100 / H100',
    usageCount: '8.2k',
    isHot: true,
    author: 'BitaHub Official',
    updatedAt: '2024-03-25',
    size: '6.2 GB',
    dockerCommand: 'docker pull bitahub.com/official/vllm:0.4.0',
    features: [
      '预装 vLLM 0.4.0',
      '针对大模型推理进行了深度优化',
      '支持 PagedAttention 技术',
      '兼容 OpenAI API 格式'
    ],
    readme: `## vLLM 0.4.0 推理镜像

vLLM 是一个高吞吐量、低延迟的大语言模型推理和服务引擎。

### 主要特性：
* **高吞吐量**：使用 PagedAttention 有效管理注意力键值缓存。
* **连续批处理**：动态调度请求，最大化 GPU 利用率。
* **OpenAI 兼容**：提供与 OpenAI API 兼容的服务器接口。

### 启动服务示例：
\`\`\`bash
python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-2-7b-chat-hf
\`\`\``
  },
  { 
    id: 'img-3', 
    name: 'Stable Diffusion WebUI', 
    desc: '预装 AUTOMATIC1111 WebUI 及常用 ControlNet 模型和插件。', 
    tags: ['Community', 'AIGC', 'Stable Diffusion'], 
    recommendedGpu: 'RTX 4090',
    usageCount: '45.1k',
    isHot: true,
    author: 'AIGC_Master',
    updatedAt: '2024-03-22',
    size: '25.4 GB',
    dockerCommand: 'docker pull bitahub.com/community/sd-webui:latest',
    features: [
      '预装 AUTOMATIC1111 WebUI',
      '内置常用大模型 (SDXL, SD1.5)',
      '集成 ControlNet 及常用模型',
      '包含多种常用插件 (Roop, ADetailer 等)'
    ],
    readme: `## Stable Diffusion WebUI 懒人包

专为 AI 绘画爱好者打造的开箱即用环境。

### 预装内容：
* **基础模型**：SDXL 1.0 Base, SD 1.5, 麦橘写实等。
* **ControlNet**：Canny, Depth, OpenPose, Lineart 等。
* **插件**：
  * sd-webui-controlnet
  * adetailer
  * sd-webui-roop

### 使用说明：
实例启动后，请访问分配的 Web 端口 (通常是 7860) 即可打开 WebUI 界面。`
  },
  { 
    id: 'img-4', 
    name: 'TensorFlow 2.15', 
    desc: '官方基础镜像，包含 Ubuntu 22.04, Python 3.10, CUDA 12.2 及 TensorFlow。', 
    tags: ['Official', 'TensorFlow', 'CUDA 12.2'], 
    recommendedGpu: 'A10',
    usageCount: '5.4k',
    isHot: false,
    author: 'BitaHub Official',
    updatedAt: '2024-02-15',
    size: '9.1 GB',
    dockerCommand: 'docker pull bitahub.com/official/tensorflow:2.15-cuda12.2',
    features: [
      '预装 TensorFlow 2.15',
      '预装 CUDA 12.2',
      '包含 Jupyter 环境'
    ],
    readme: `## TensorFlow 2.15 官方镜像

标准的 TensorFlow 开发环境。`
  },
  { 
    id: 'img-5', 
    name: 'ComfyUI', 
    desc: '强大的节点式 AIGC 工作流工具，预装常用自定义节点。', 
    tags: ['Community', 'AIGC', 'ComfyUI'], 
    recommendedGpu: 'RTX 4090',
    usageCount: '18.3k',
    isHot: false,
    author: 'Workflow_Ninja',
    updatedAt: '2024-03-26',
    size: '15.8 GB',
    dockerCommand: 'docker pull bitahub.com/community/comfyui:latest',
    features: [
      '预装 ComfyUI 核心',
      '集成 ComfyUI-Manager',
      '内置常用自定义节点包'
    ],
    readme: `## ComfyUI 节点式工作流环境

提供高度可定制的 AI 绘画工作流体验。`
  },
];

export default function ImageMarket({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommend');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImages = mockImages.filter(img => {
    const matchesSearch = img.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          img.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          img.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'official') return matchesSearch && img.tags.includes('Official');
    if (activeCategory === 'community') return matchesSearch && img.tags.includes('Community');
    return matchesSearch;
  });

  const selectedImage = mockImages.find(img => img.id === selectedImageId);

  if (selectedImage) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedImageId(null)} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                <ImageIcon className="w-4 h-4 text-gray-300" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{selectedImage.name}</h1>
              {selectedImage.isHot && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">HOT</span>
              )}
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm flex items-center gap-4">
              <span>由 {selectedImage.author} 提供</span>
              <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {selectedImage.usageCount} 次使用</span>
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('create-instance')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" /> 使用此镜像
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-medium text-white">镜像描述</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedImage.desc}
              </p>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-400 mb-3">包含特性</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedImage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-start)] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-medium text-white">Readme</h3>
              <div className="prose prose-invert prose-sm max-w-none">
                {/* In a real app, use react-markdown here */}
                <pre className="whitespace-pre-wrap font-sans text-gray-300 bg-black/20 p-4 rounded-xl border border-white/5">
                  {selectedImage.readme}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="font-medium text-white">基本信息</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">推荐 GPU</span>
                  <span className="text-sm text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[var(--color-accent-start)]" />
                    {selectedImage.recommendedGpu}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">镜像大小</span>
                  <span className="text-sm text-white">{selectedImage.size}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">最后更新</span>
                  <span className="text-sm text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {selectedImage.updatedAt}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Docker 拉取命令
                </h4>
                <div className="bg-black/50 border border-white/10 rounded-lg p-3 relative group">
                  <code className="text-xs text-gray-300 break-all">
                    {selectedImage.dockerCommand}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">镜像市场</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">发现并使用预置的 AI 开发环境。</p>
        </div>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex flex-col gap-6">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            {['all', 'official', 'community'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[var(--color-accent-start)] text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat === 'all' ? '全部' : cat === 'official' ? '官方镜像' : '社区镜像'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white/5 rounded-lg p-1">
              {['recommend', 'newest', 'hottest'].map(sort => (
                <button 
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    sortBy === sort ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sort === 'recommend' ? '推荐' : sort === 'newest' ? '最新' : '最热'}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索镜像名称、标签..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map(img => (
            <div 
              key={img.id} 
              onClick={() => setSelectedImageId(img.id)}
              className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                    <ImageIcon className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-accent-start)] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2 group-hover:text-[var(--color-accent-start)] transition-colors">
                      {img.name}
                      {img.isHot && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">HOT</span>}
                    </h3>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {img.usageCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
                {img.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {img.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>推荐: {img.recommendedGpu}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('create-instance');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-accent-start)]/10 hover:bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)] transition-colors text-xs font-medium"
                >
                  使用 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
