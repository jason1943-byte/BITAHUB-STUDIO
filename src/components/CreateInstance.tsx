import React, { useState } from 'react';
import { 
  Server, Cpu, HardDrive, CheckCircle2, ChevronRight, 
  AlertTriangle, ArrowLeft, Zap, RefreshCw
} from 'lucide-react';

const mockGpus = [
  { id: 'rtx-4090', name: 'RTX 4090', vram: '24GB', price: 1.5, available: 12, status: 'available' },
  { id: 'a10', name: 'A10', vram: '24GB', price: 2.0, available: 5, status: 'available' },
  { id: 'a100', name: 'A100', vram: '80GB', price: 8.5, available: 0, status: 'unavailable' },
  { id: 'h100', name: 'H100', vram: '80GB', price: 15.0, available: 2, status: 'available' },
];

const mockImages = [
  { id: 'img-1', name: 'PyTorch 2.2.0', desc: 'Ubuntu 22.04, Python 3.10, CUDA 12.1', type: 'official' },
  { id: 'img-2', name: 'vLLM 0.4.0', desc: 'Optimized for LLM inference', type: 'official' },
  { id: 'img-3', name: 'Stable Diffusion WebUI', desc: 'Pre-installed with popular extensions', type: 'community' },
];

export default function CreateInstance({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState('my-instance');
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const balance = 12.50; // Mock balance

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setCreated(true);
    }, 2000);
  };

  const selectedGpuDetails = mockGpus.find(g => g.id === selectedGpu);
  const estimatedRuntime = selectedGpuDetails ? (balance / selectedGpuDetails.price).toFixed(1) : 0;

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">实例创建成功</h2>
          <p className="text-gray-400">您的实例 "{instanceName}" 正在启动，通常需要 1-2 分钟。</p>
        </div>
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => { setStep(1); setCreated(false); setSelectedImage(null); setSelectedGpu(null); }}
            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
          >
            继续创建
          </button>
          <button 
            onClick={() => setActiveTab('instances')}
            className="px-6 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
          >
            查看实例列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 shrink-0">
        {step > 1 && (
          <button onClick={handleBack} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0 self-start sm:self-auto">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">创建实例</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">配置并启动您的 GPU 计算环境。</p>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--color-accent-start)] z-0 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }} />
        
        {[
          { num: 1, label: '选择镜像' },
          { num: 2, label: '选择算力' },
          { num: 3, label: '确认配置' }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
              step >= s.num ? 'bg-[var(--color-accent-start)] text-white' : 'bg-[#1a1a1a] text-gray-500 border border-white/10'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-medium text-white">选择基础镜像</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockImages.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedImage === img.id 
                      ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{img.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase">{img.type}</span>
                  </div>
                  <p className="text-xs text-gray-400">{img.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-medium text-white">选择 GPU 规格</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGpus.map((gpu) => (
                  <div 
                    key={gpu.id}
                    onClick={() => gpu.status === 'available' && setSelectedGpu(gpu.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      gpu.status === 'unavailable' 
                        ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        : selectedGpu === gpu.id 
                          ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)] cursor-pointer' 
                          : 'bg-white/5 border-white/10 hover:border-white/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-gray-300" />
                        <h3 className="font-medium text-white">{gpu.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[var(--color-accent-start)]">¥{gpu.price}/小时</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>显存: {gpu.vram}</span>
                      {gpu.status === 'available' ? (
                        <span className="text-emerald-400">可用: {gpu.available} 台</span>
                      ) : (
                        <span className="text-red-400">资源售罄</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
              <h2 className="text-lg font-medium text-white">实例配置</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">实例名称</label>
                <input 
                  type="text" 
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  className="w-full max-w-md bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-medium text-white">确认配置</h2>
            
            <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-400">实例名称</div>
                <div className="text-white font-medium text-right">{instanceName}</div>
                
                <div className="text-gray-400">基础镜像</div>
                <div className="text-white font-medium text-right">{mockImages.find(i => i.id === selectedImage)?.name}</div>
                
                <div className="text-gray-400">GPU 规格</div>
                <div className="text-white font-medium text-right">{selectedGpuDetails?.name} ({selectedGpuDetails?.vram})</div>
                
                <div className="text-gray-400">计费方式</div>
                <div className="text-white font-medium text-right">按量计费</div>
                
                <div className="text-gray-400">单价</div>
                <div className="text-[var(--color-accent-start)] font-medium text-right">¥{selectedGpuDetails?.price.toFixed(2)} / 小时</div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-medium text-amber-500">余额预估</h4>
                <p className="text-xs text-amber-400/80">
                  当前账户余额 <strong>¥{balance.toFixed(2)}</strong>，按照当前配置，预计可运行 <strong>{estimatedRuntime} 小时</strong>。
                  当余额不足时，实例将被自动停止。
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-6 border-t border-white/10 mt-4">
          {step === 1 && (
            <button 
              onClick={handleNext}
              disabled={!selectedImage}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步 <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 2 && (
            <button 
              onClick={handleNext}
              disabled={!selectedGpu || !instanceName}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步 <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 3 && (
            <button 
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> 创建中...</>
              ) : (
                <><Zap className="w-4 h-4" /> 确认创建</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
