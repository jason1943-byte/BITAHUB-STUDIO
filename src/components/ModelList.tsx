import React, { useState } from 'react';
import { Search, Terminal, Zap, Info, ArrowLeft, Code, FileText, CheckCircle2 } from 'lucide-react';

const mockModels = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    context: '128K',
    inputPrice: '¥0.014 / 1K tokens',
    outputPrice: '¥0.028 / 1K tokens',
    status: 'available',
    tags: ['Reasoning', 'Coding', 'Math'],
    description: 'DeepSeek-R1 是一款强大的推理模型，在数学、代码和复杂逻辑推理任务上表现卓越。它经过了大量的强化学习训练，能够进行深度的思考和自我验证。',
    features: [
      '强大的逻辑推理能力',
      '卓越的代码生成与理解',
      '支持高达 128K 的上下文窗口',
      '多语言支持'
    ],
    apiExample: `curl https://api.bitahub.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $BITAHUB_API_KEY" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    context: '64K',
    inputPrice: '¥0.002 / 1K tokens',
    outputPrice: '¥0.004 / 1K tokens',
    status: 'available',
    tags: ['General', 'Fast'],
    description: 'DeepSeek-V3 是一款通用大语言模型，在保持高性能的同时，提供了极高的性价比和响应速度，适合日常对话、文本生成和信息提取。',
    features: [
      '极高的性价比',
      '快速的响应速度',
      '优秀的通用对话能力',
      '支持 64K 上下文'
    ],
    apiExample: `curl https://api.bitahub.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $BITAHUB_API_KEY" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`
  },
  {
    id: 'llama-3-70b',
    name: 'Llama-3-70B-Instruct',
    provider: 'Meta',
    context: '8K',
    inputPrice: '¥0.005 / 1K tokens',
    outputPrice: '¥0.010 / 1K tokens',
    status: 'available',
    tags: ['Open Source', 'General'],
    description: 'Llama 3 70B 是 Meta 开源的最新一代大语言模型，在各项基准测试中均有优异表现，是目前最强大的开源模型之一。',
    features: [
      '顶级的开源模型性能',
      '优秀的指令遵循能力',
      '广泛的知识覆盖',
      '适合各种通用任务'
    ],
    apiExample: `curl https://api.bitahub.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $BITAHUB_API_KEY" \\
  -d '{
    "model": "llama-3-70b",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen-2.5-72B-Instruct',
    provider: 'Alibaba',
    context: '32K',
    inputPrice: '¥0.004 / 1K tokens',
    outputPrice: '¥0.008 / 1K tokens',
    status: 'available',
    tags: ['Multilingual', 'Coding'],
    description: 'Qwen 2.5 72B 是阿里云开源的大语言模型，在多语言能力、数学和代码方面有显著提升，特别是在中文处理上表现优异。',
    features: [
      '卓越的中文处理能力',
      '强大的多语言支持',
      '优秀的数学和代码能力',
      '支持 32K 上下文'
    ],
    apiExample: `curl https://api.bitahub.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $BITAHUB_API_KEY" \\
  -d '{
    "model": "qwen-2.5-72b",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`
  }
];

export default function ModelList({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const filteredModels = mockModels.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedModel = mockModels.find(m => m.id === selectedModelId);

  if (selectedModel) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedModelId(null)} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight">{selectedModel.name}</h1>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                <Zap className="w-3 h-3" /> 可用
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm">{selectedModel.provider}</p>
          </div>
          <button 
            onClick={() => setActiveTab('playground')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
          >
            <Terminal className="w-4 h-4" /> 去调试
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-medium text-white flex items-center gap-2">
                <FileText className="w-4 h-4" /> 模型介绍
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedModel.description}
              </p>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-400 mb-3">核心特性</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedModel.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-start)] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Code className="w-4 h-4" /> API 调用示例
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                BitaHub 提供了与 OpenAI 兼容的 API 接口，您可以轻松地将现有应用迁移过来。
              </p>
              <div className="bg-black/50 border border-white/10 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono">
                  {selectedModel.apiExample}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Info className="w-4 h-4" /> 规格与计费
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">模型 ID</span>
                  <code className="text-xs text-[var(--color-accent-start)] bg-white/5 px-2 py-1 rounded">
                    {selectedModel.id}
                  </code>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">上下文窗口</span>
                  <span className="text-sm text-white font-medium">{selectedModel.context}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">输入价格</span>
                  <span className="text-sm text-white">{selectedModel.inputPrice}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">输出价格</span>
                  <span className="text-sm text-white">{selectedModel.outputPrice}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                      {tag}
                    </span>
                  ))}
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
          <h1 className="text-2xl font-semibold tracking-tight mb-1">模型列表</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">查看支持的 API 模型及计费标准。</p>
        </div>
      </header>

      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索模型名称或提供商..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModels.map(model => (
            <div 
              key={model.id} 
              onClick={() => setSelectedModelId(model.id)}
              className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col gap-4 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white text-lg flex items-center gap-2 group-hover:text-[var(--color-accent-start)] transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{model.provider}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                  <Zap className="w-3 h-3" /> 可用
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {model.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 my-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">上下文窗口</p>
                  <p className="text-sm text-gray-300">{model.context}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">输入价格</p>
                  <p className="text-sm text-gray-300">{model.inputPrice}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">输出价格</p>
                  <p className="text-sm text-gray-300">{model.outputPrice}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Info className="w-3.5 h-3.5" /> 查看详情
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('playground');
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--color-accent-start)]/10 hover:bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)] transition-colors text-sm font-medium"
                >
                  <Terminal className="w-4 h-4" /> 去调试
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
