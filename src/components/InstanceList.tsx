import React, { useState } from 'react';
import { 
  Server, Play, Square, RefreshCw, Trash2, ExternalLink, 
  Search, Filter, MoreVertical, AlertTriangle, ArrowLeft,
  Cpu, HardDrive, Network, Clock, Activity, Terminal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const mockInstances = [
  { 
    id: 'inst-001', 
    name: 'Llama-3-70B-Server', 
    image: 'vLLM 0.4.0', 
    gpu: 'RTX 4090', 
    vram: '24GB',
    cpu: '16 vCPU',
    memory: '64GB',
    disk: '100GB NVMe',
    status: 'running', 
    runtime: '2d 4h', 
    cost: '¥ 45.20',
    createdAt: '2026-03-24 10:20:00',
    ip: '192.168.1.105',
    sshPort: '22022',
    jupyterPort: '8888'
  },
  { 
    id: 'inst-002', 
    name: 'SDXL-Trainer', 
    image: 'PyTorch 2.2.0', 
    gpu: 'A100', 
    vram: '80GB',
    cpu: '32 vCPU',
    memory: '128GB',
    disk: '500GB NVMe',
    status: 'stopped', 
    runtime: '-', 
    cost: '¥ 12.50',
    createdAt: '2026-03-25 14:30:00',
    ip: '-',
    sshPort: '-',
    jupyterPort: '-'
  },
  { 
    id: 'inst-003', 
    name: 'Dev-Environment', 
    image: 'Ubuntu 22.04', 
    gpu: 'A10', 
    vram: '24GB',
    cpu: '8 vCPU',
    memory: '32GB',
    disk: '50GB NVMe',
    status: 'creating', 
    runtime: '-', 
    cost: '¥ 0.00',
    createdAt: '2026-03-27 02:15:00',
    ip: '-',
    sshPort: '-',
    jupyterPort: '-'
  },
];

const mockMonitorData = [
  { time: '10:00', gpu: 45, cpu: 20, memory: 60 },
  { time: '10:05', gpu: 85, cpu: 35, memory: 62 },
  { time: '10:10', gpu: 92, cpu: 40, memory: 65 },
  { time: '10:15', gpu: 30, cpu: 15, memory: 60 },
  { time: '10:20', gpu: 15, cpu: 10, memory: 58 },
  { time: '10:25', gpu: 98, cpu: 45, memory: 70 },
  { time: '10:30', gpu: 95, cpu: 42, memory: 72 },
];

export default function InstanceList({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [instances, setInstances] = useState(mockInstances);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [monitorTab, setMonitorTab] = useState<'gpu' | 'cpu' | 'memory'>('gpu');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'stopped': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'creating': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '运行中';
      case 'stopped': return '已停止';
      case 'creating': return '创建中';
      case 'error': return '异常';
      default: return status;
    }
  };

  const handleDelete = (id: string) => {
    if (deleteInput === instances.find(i => i.id === id)?.name) {
      setInstances(instances.filter(i => i.id !== id));
      setDeleteConfirm(null);
      setDeleteInput('');
      if (selectedInstanceId === id) {
        setSelectedInstanceId(null);
      }
    }
  };

  const selectedInstance = instances.find(i => i.id === selectedInstanceId);

  if (selectedInstance) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedInstanceId(null)} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold tracking-tight">{selectedInstance.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStatusColor(selectedInstance.status)}`}>
                {getStatusText(selectedInstance.status)}
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm font-mono">{selectedInstance.id}</p>
          </div>
          <div className="flex gap-2">
            {selectedInstance.status === 'running' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10">
                  <ExternalLink className="w-4 h-4" /> JupyterLab
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10">
                  <RefreshCw className="w-4 h-4" /> 重启
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors text-sm font-medium">
                  <Square className="w-4 h-4" /> 停止
                </button>
              </>
            )}
            {selectedInstance.status === 'stopped' && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors text-sm font-medium">
                <Play className="w-4 h-4" /> 启动
              </button>
            )}
            <button 
              onClick={() => setDeleteConfirm(selectedInstance.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> 销毁
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Panel */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Server className="w-4 h-4" /> 基本信息
            </h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">镜像</span>
                <span className="text-white font-medium">{selectedInstance.image}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">创建时间</span>
                <span className="text-white">{selectedInstance.createdAt}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">运行时长</span>
                <span className="text-white">{selectedInstance.runtime}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">累计费用</span>
                <span className="text-[var(--color-accent-start)] font-medium">{selectedInstance.cost}</span>
              </div>
            </div>

            <h3 className="font-medium text-white flex items-center gap-2 mt-2">
              <HardDrive className="w-4 h-4" /> 硬件配置
            </h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">GPU</span>
                <span className="text-white font-medium">{selectedInstance.gpu} ({selectedInstance.vram})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">CPU</span>
                <span className="text-white">{selectedInstance.cpu}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">内存</span>
                <span className="text-white">{selectedInstance.memory}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">系统盘</span>
                <span className="text-white">{selectedInstance.disk}</span>
              </div>
            </div>
          </div>

          {/* Connection & Monitoring */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Network className="w-4 h-4" /> 连接信息
              </h3>
              {selectedInstance.status === 'running' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Terminal className="w-4 h-4" /> SSH 连接
                    </div>
                    <code className="text-xs text-[var(--color-accent-start)] bg-white/5 p-2 rounded break-all">
                      ssh root@{selectedInstance.ip} -p {selectedInstance.sshPort}
                    </code>
                    <p className="text-[10px] text-gray-500 mt-1">密码为您在个人设置中配置的 SSH 密码或密钥。</p>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <ExternalLink className="w-4 h-4" /> JupyterLab
                    </div>
                    <code className="text-xs text-[var(--color-accent-start)] bg-white/5 p-2 rounded break-all">
                      http://{selectedInstance.ip}:{selectedInstance.jupyterPort}
                    </code>
                    <button className="mt-2 w-full py-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors text-xs font-medium border border-white/10">
                      在浏览器中打开
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/5 rounded-xl p-6 text-center text-sm text-gray-400">
                  实例未运行，无法获取连接信息。请先启动实例。
                </div>
              )}
            </div>

            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 资源监控
                </h3>
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button 
                    onClick={() => setMonitorTab('gpu')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${monitorTab === 'gpu' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    GPU
                  </button>
                  <button 
                    onClick={() => setMonitorTab('cpu')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${monitorTab === 'cpu' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    CPU
                  </button>
                  <button 
                    onClick={() => setMonitorTab('memory')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${monitorTab === 'memory' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    内存
                  </button>
                </div>
              </div>

              {selectedInstance.status === 'running' ? (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMonitorData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMonitor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                        tickFormatter={(val) => `${val}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                        formatter={(value: number) => [`${value}%`, monitorTab.toUpperCase() + ' 使用率']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={monitorTab} 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorMonitor)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl text-sm text-gray-400 min-h-[200px]">
                  实例未运行，暂无监控数据。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">实例列表</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">管理您的 GPU 计算实例。</p>
        </div>
        <button 
          onClick={() => setActiveTab('create-instance')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium shrink-0 self-start sm:self-auto"
        >
          <Server className="w-4 h-4" />
          创建实例
        </button>
      </header>

      <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索实例名称..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm border border-white/10">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-medium">实例名称</th>
                <th className="pb-3 font-medium">镜像</th>
                <th className="pb-3 font-medium">GPU 规格</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">运行时长</th>
                <th className="pb-3 font-medium">累计费用</th>
                <th className="pb-3 font-medium">创建时间</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {instances.map((inst) => (
                <tr key={inst.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedInstanceId(inst.id)}>
                  <td className="py-4 font-medium text-white">{inst.name}</td>
                  <td className="py-4 text-gray-300">{inst.image}</td>
                  <td className="py-4 text-gray-300">{inst.gpu}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStatusColor(inst.status)}`}>
                      {getStatusText(inst.status)}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{inst.runtime}</td>
                  <td className="py-4 text-gray-300">{inst.cost}</td>
                  <td className="py-4 text-gray-400 text-xs">{inst.createdAt}</td>
                  <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {inst.status === 'running' && (
                        <>
                          <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors" title="打开 JupyterLab">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors" title="重启实例">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors" title="停止实例">
                            <Square className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {inst.status === 'stopped' && (
                        <button className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="启动实例">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => setDeleteConfirm(inst.id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" 
                        title="销毁实例"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {instances.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              暂无实例，点击右上角创建。
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl flex flex-col gap-4 border border-red-500/30">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-medium text-white">确认销毁实例</h3>
            </div>
            <p className="text-sm text-gray-300">
              此操作不可逆，实例上的所有数据将被永久删除。
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs text-gray-400">
                请输入实例名称 <span className="font-mono text-white bg-white/10 px-1 rounded">{instances.find(i => i.id === deleteConfirm)?.name}</span> 以确认：
              </label>
              <input 
                type="text" 
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => { setDeleteConfirm(null); setDeleteInput(''); }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteInput !== instances.find(i => i.id === deleteConfirm)?.name}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认销毁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
