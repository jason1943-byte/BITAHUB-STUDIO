import React, { useState } from 'react';
import { 
  Key, Plus, Copy, Check, Trash2, Eye, EyeOff, AlertCircle, Activity
} from 'lucide-react';

const mockKeys = [
  { id: 'key-1', name: 'Production App', key: 'sk-bita-********************', created: '2026-03-20', lastUsed: '2026-03-27', calls: '124.5k', cost: '¥45.20', status: 'active' },
  { id: 'key-2', name: 'Dev Testing', key: 'sk-bita-********************', created: '2026-03-22', lastUsed: '2026-03-26', calls: '12.1k', cost: '¥4.50', status: 'active' },
  { id: 'key-3', name: 'Old Project', key: 'sk-bita-********************', created: '2026-02-15', lastUsed: '2026-02-28', calls: '0', cost: '¥0.00', status: 'disabled' },
];

export default function ApiKeyManager() {
  const [keys, setKeys] = useState(mockKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = () => {
    if (keys.length >= 10) return;
    
    const newKey = `sk-bita-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setNewlyCreatedKey(newKey);
    
    const newKeyObj = {
      id: `key-${Date.now()}`,
      name: newKeyName || 'Untitled Key',
      key: 'sk-bita-********************',
      created: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      calls: '0',
      cost: '¥0.00',
      status: 'active'
    };
    
    setKeys([newKeyObj, ...keys]);
    setNewKeyName('');
  };

  const toggleStatus = (id: string) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        return { ...k, status: k.status === 'active' ? 'disabled' : 'active' };
      }
      return k;
    }));
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">API Key 管理</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">管理用于调用 BitaHub 模型的 API 密钥。</p>
        </div>
        <button 
          onClick={() => setShowNewKeyModal(true)}
          disabled={keys.length >= 10}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4" />
          创建新 Key
        </button>
      </header>

      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
          <AlertCircle className="w-4 h-4 text-[var(--color-accent-start)] shrink-0" />
          <span>出于安全考虑，新创建的 API Key 仅会完整显示一次，请妥善保存。每个账户最多可创建 10 个 API Key ({keys.length}/10)。</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-medium">名称</th>
                <th className="pb-3 font-medium">API Key</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">本月调用量</th>
                <th className="pb-3 font-medium">本月费用</th>
                <th className="pb-3 font-medium">创建时间</th>
                <th className="pb-3 font-medium">最后使用</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 font-medium text-white">{k.name}</td>
                  <td className="py-4 font-mono text-gray-400 text-xs">{k.key}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      k.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {k.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{k.calls}</td>
                  <td className="py-4 text-gray-300">{k.cost}</td>
                  <td className="py-4 text-gray-400 text-xs">{k.created}</td>
                  <td className="py-4 text-gray-400 text-xs">{k.lastUsed}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(k.id)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors text-xs"
                      >
                        {k.status === 'active' ? '禁用' : '启用'}
                      </button>
                      <button 
                        onClick={() => deleteKey(k.id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" 
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl flex flex-col gap-4 border border-white/10">
            {!newlyCreatedKey ? (
              <>
                <h3 className="text-lg font-medium text-white">创建新 API Key</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm text-gray-400">名称 (可选)</label>
                  <input 
                    type="text" 
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="例如：Production App"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    onClick={() => setShowNewKeyModal(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleCreateKey}
                    className="px-4 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
                  >
                    创建
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <Check className="w-6 h-6" />
                  <h3 className="text-lg font-medium text-white">API Key 创建成功</h3>
                </div>
                <p className="text-sm text-gray-300">
                  请立即复制您的 API Key。出于安全考虑，关闭此窗口后您将无法再次查看完整的 Key。
                </p>
                <div className="flex items-center gap-2 mt-2 bg-black/50 border border-white/10 rounded-lg p-3">
                  <code className="flex-1 text-sm text-[var(--color-accent-start)] break-all">{newlyCreatedKey}</code>
                  <button 
                    onClick={() => handleCopy(newlyCreatedKey, 'new')}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0"
                  >
                    {copiedId === 'new' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => { setShowNewKeyModal(false); setNewlyCreatedKey(null); }}
                    className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium"
                  >
                    我已保存，关闭
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
