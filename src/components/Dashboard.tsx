import React, { useState } from 'react';
import { 
  Activity, Server, Zap, CreditCard, PlusSquare, Key, 
  ArrowRight, Play, Square, RefreshCw, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const trendData = [
  { date: '03-20', total: 12.5, instance: 10.0, api: 2.5 },
  { date: '03-21', total: 15.2, instance: 12.0, api: 3.2 },
  { date: '03-22', total: 18.4, instance: 14.5, api: 3.9 },
  { date: '03-23', total: 14.1, instance: 11.0, api: 3.1 },
  { date: '03-24', total: 22.5, instance: 18.0, api: 4.5 },
  { date: '03-25', total: 25.8, instance: 20.0, api: 5.8 },
  { date: '03-26', total: 19.2, instance: 15.0, api: 4.2 },
];

const recentInstances = [
  { id: 'inst-001', name: 'Llama-3-70B-Server', status: 'running', gpu: 'RTX 4090', uptime: '2d 4h' },
  { id: 'inst-002', name: 'SDXL-Trainer', status: 'stopped', gpu: 'A100', uptime: '-' },
  { id: 'inst-003', name: 'Dev-Environment', status: 'running', gpu: 'A10', uptime: '5h 20m' },
];

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [showGuide, setShowGuide] = useState(true);
  const [trendFilter, setTrendFilter] = useState<'total' | 'instance' | 'api'>('total');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-10">
      <header className="px-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">欢迎回来，开发者</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">这里是您的 BitaHub 工作空间，快速开始您的 AI 之旅。</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('api-keys')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10"
          >
            <Key className="w-4 h-4" />
            创建 API Key
          </button>
          <button 
            onClick={() => setActiveTab('create-instance')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
          >
            <PlusSquare className="w-4 h-4" />
            创建实例
          </button>
        </div>
      </header>

      {/* Onboarding Guide */}
      {showGuide && (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-[var(--color-accent-start)]/30">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-white text-sm">
              关闭
            </button>
          </div>
          <h2 className="text-lg font-medium text-white mb-4">快速开始指南 (3 步)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)] flex items-center justify-center font-bold">1</div>
              <h3 className="font-medium text-white">选择镜像与配置</h3>
              <p className="text-sm text-gray-400">在镜像市场选择预置环境，或直接创建实例并选择 GPU 规格。</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold">2</div>
              <h3 className="font-medium text-white">启动实例</h3>
              <p className="text-sm text-gray-400">一键启动，系统将自动分配资源并配置环境，通常在 1 分钟内完成。</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold">3</div>
              <h3 className="font-medium text-white">连接与使用</h3>
              <p className="text-sm text-gray-400">通过 JupyterLab、SSH 或 API 接口连接到您的实例，开始工作。</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group border border-red-500/30">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)] font-medium">账户余额</span>
            <CreditCard className="w-5 h-5 text-red-400 opacity-80" />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-normal font-mono text-white">¥ 12.50</span>
          </div>
          <div className="text-xs text-red-400 relative z-10 flex items-center gap-1">
            <Activity className="w-3 h-3" /> 余额不足，预计可用 2 小时
          </div>
        </div>

        {[
          { label: '运行中实例', value: '2', icon: Server, color: 'text-emerald-500', subtext: '共 3 个实例' },
          { label: '今日消费', value: '¥ 45.2', icon: Zap, color: 'text-amber-500', subtext: '较昨日 +12%' },
          { label: '本月 API 调用', value: '124k', icon: Activity, color: 'text-purple-500', subtext: '¥ 12.4 产生费用' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)] font-medium">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <div className="text-4xl font-normal font-mono relative z-10">{stat.value}</div>
            <div className="text-xs text-gray-400 relative z-10">{stat.subtext}</div>
            <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
              <stat.icon className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">消费趋势 (近 7 天)</h2>
            <div className="flex bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => setTrendFilter('total')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === 'total' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                总计
              </button>
              <button 
                onClick={() => setTrendFilter('instance')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === 'instance' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                实例
              </button>
              <button 
                onClick={() => setTrendFilter('api')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === 'api' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                API
              </button>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                  tickFormatter={(val) => `¥${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                  formatter={(value: number) => [`¥${value.toFixed(2)}`, '消费']}
                />
                <Area 
                  type="monotone" 
                  dataKey={trendFilter} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Instances */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">最近实例</h2>
            <button 
              onClick={() => setActiveTab('instances')}
              className="text-xs text-[var(--color-accent-start)] hover:text-[var(--color-accent-end)] flex items-center"
            >
              查看全部 <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentInstances.map(inst => (
              <div key={inst.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm text-white">{inst.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{inst.gpu}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-medium ${
                    inst.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {inst.status === 'running' ? '运行中' : '已停止'}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className="text-xs text-gray-400">
                    {inst.status === 'running' ? `已运行 ${inst.uptime}` : '-'}
                  </div>
                  <div className="flex gap-2">
                    {inst.status === 'running' ? (
                      <>
                        <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors" title="打开 JupyterLab">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="停止实例">
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="启动实例">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

