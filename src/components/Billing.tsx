import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { date: '03-20', amount: 12.5 },
  { date: '03-21', amount: 15.2 },
  { date: '03-22', amount: 18.7 },
  { date: '03-23', amount: 14.3 },
  { date: '03-24', amount: 22.1 },
  { date: '03-25', amount: 28.5 },
  { date: '03-26', amount: 24.8 },
];

const mockTransactions = [
  { id: 'tx-1', date: '2026-03-26 14:30:00', type: 'deduction', desc: '实例运行扣费 (i-8f92a1)', amount: '-¥4.50', balance: '¥124.50' },
  { id: 'tx-2', date: '2026-03-25 09:15:00', type: 'deduction', desc: 'API 调用扣费 (DeepSeek-R1)', amount: '-¥12.80', balance: '¥129.00' },
  { id: 'tx-3', date: '2026-03-24 10:00:00', type: 'recharge', desc: '支付宝充值', amount: '+¥100.00', balance: '¥141.80' },
  { id: 'tx-4', date: '2026-03-23 18:45:00', type: 'deduction', desc: '实例运行扣费 (i-3b4c5d)', amount: '-¥8.20', balance: '¥41.80' },
];

export default function Billing({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('100');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">费用中心</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">管理您的账户余额、充值及查看账单明细。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">账户余额</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">¥ 124.50</div>
            <p className="text-sm text-gray-400">可用余额充足，预计可使用 15 天</p>
          </div>
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setShowRechargeModal(true)}
              className="flex-1 py-2.5 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity font-medium"
            >
              立即充值
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-400 mb-2">本月累计消费</p>
              <div className="text-2xl font-semibold text-white mb-1">¥ 342.80</div>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" /> 较上月下降 12%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">今日预计消费</p>
              <div className="text-2xl font-semibold text-white mb-1">¥ 28.50</div>
              <p className="text-xs text-red-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 较昨日上升 5%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-white">近 7 天消费趋势</h3>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--color-accent-start)]/50">
            <option>近 7 天</option>
            <option>近 30 天</option>
            <option>本月</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent-start)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-accent-start)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: 'var(--color-accent-start)' }}
                formatter={(value: number) => [`¥${value.toFixed(2)}`, '消费金额']}
              />
              <Area type="monotone" dataKey="amount" stroke="var(--color-accent-start)" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-white">最近账单明细</h3>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5" /> 导出 CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-medium">时间</th>
                <th className="pb-3 font-medium">类型</th>
                <th className="pb-3 font-medium">描述</th>
                <th className="pb-3 font-medium text-right">金额</th>
                <th className="pb-3 font-medium text-right">余额</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-gray-400 text-xs">{tx.date}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      tx.type === 'recharge' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {tx.type === 'recharge' ? '充值' : '扣费'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{tx.desc}</td>
                  <td className={`py-4 text-right font-medium ${tx.type === 'recharge' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.amount}
                  </td>
                  <td className="py-4 text-right text-gray-400">{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setActiveTab('bills')}
            className="text-xs text-[var(--color-accent-start)] hover:underline"
          >
            查看全部账单
          </button>
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl flex flex-col gap-6 border border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">账户充值</h3>
              <button onClick={() => setShowRechargeModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">充值金额 (元)</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['50', '100', '500', '1000', '5000', 'custom'].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setRechargeAmount(amt === 'custom' ? '' : amt)}
                    className={`py-2 rounded-lg border text-sm transition-colors ${
                      (rechargeAmount === amt || (amt === 'custom' && !['50', '100', '500', '1000', '5000'].includes(rechargeAmount)))
                        ? 'bg-[var(--color-accent-start)]/20 border-[var(--color-accent-start)] text-[var(--color-accent-start)]' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {amt === 'custom' ? '自定义' : `¥${amt}`}
                  </button>
                ))}
              </div>
              {(!['50', '100', '500', '1000', '5000'].includes(rechargeAmount) || rechargeAmount === '') && (
                <input 
                  type="number" 
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="输入自定义金额"
                  className="w-full bg-black/50 border border-[var(--color-accent-start)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">支付方式</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-accent-start)] bg-[var(--color-accent-start)]/10 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-[var(--color-accent-start)]" />
                  <span className="text-white text-sm">支付宝</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="radio" name="payment" className="accent-[var(--color-accent-start)]" />
                  <span className="text-white text-sm">微信支付</span>
                </label>
              </div>
            </div>

            <button 
              onClick={() => {
                alert(`模拟充值：¥${rechargeAmount}`);
                setShowRechargeModal(false);
              }}
              disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
              className="w-full py-3 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              确认支付 ¥{rechargeAmount || '0'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
