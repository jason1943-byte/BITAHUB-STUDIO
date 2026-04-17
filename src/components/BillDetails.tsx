import React, { useState } from 'react';
import { Download, Filter, Search, Calendar } from 'lucide-react';

const mockDetails = [
  { id: 'bd-1', date: '2026-03-26', type: 'GPU 实例', resource: 'i-8f92a1 (RTX 4090)', duration: '2.5 小时', unitPrice: '¥1.80/小时', total: '¥4.50' },
  { id: 'bd-2', date: '2026-03-25', type: 'API 调用', resource: 'DeepSeek-R1', duration: '124.5k tokens', unitPrice: '¥0.014/1K (入) ¥0.028/1K (出)', total: '¥12.80' },
  { id: 'bd-3', date: '2026-03-24', type: 'GPU 实例', resource: 'i-3b4c5d (A100)', duration: '1.2 小时', unitPrice: '¥6.50/小时', total: '¥7.80' },
  { id: 'bd-4', date: '2026-03-23', type: '存储费用', resource: '云盘 (100GB)', duration: '1 天', unitPrice: '¥0.50/天', total: '¥0.50' },
  { id: 'bd-5', date: '2026-03-22', type: 'API 调用', resource: 'Llama-3-70B', duration: '45.2k tokens', unitPrice: '¥0.005/1K (入) ¥0.010/1K (出)', total: '¥4.50' },
];

export default function BillDetails() {
  const [dateRange, setDateRange] = useState('this-month');
  const [typeFilter, setTypeFilter] = useState('all');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">账单明细</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">查看各项资源的详细扣费记录。</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10">
          <Download className="w-4 h-4" />
          导出账单 (CSV)
        </button>
      </header>

      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50"
              >
                <option value="today">今天</option>
                <option value="yesterday">昨天</option>
                <option value="this-week">本周</option>
                <option value="this-month">本月</option>
                <option value="last-month">上月</option>
                <option value="custom">自定义范围...</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50"
              >
                <option value="all">所有类型</option>
                <option value="gpu">GPU 实例</option>
                <option value="api">API 调用</option>
                <option value="storage">存储费用</option>
              </select>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索资源名称..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
            />
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-4 gap-4 py-4 border-y border-white/5">
          <div>
            <p className="text-xs text-gray-500 mb-1">总计费用</p>
            <p className="text-lg font-medium text-white">¥30.10</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">GPU 实例</p>
            <p className="text-lg font-medium text-white">¥12.30</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">API 调用</p>
            <p className="text-lg font-medium text-white">¥17.30</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">存储费用</p>
            <p className="text-lg font-medium text-white">¥0.50</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-medium">日期</th>
                <th className="pb-3 font-medium">类型</th>
                <th className="pb-3 font-medium">资源/模型</th>
                <th className="pb-3 font-medium">用量/时长</th>
                <th className="pb-3 font-medium">单价</th>
                <th className="pb-3 font-medium text-right">总价</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockDetails.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-gray-400 text-xs">{item.date}</td>
                  <td className="py-4 text-gray-300">{item.type}</td>
                  <td className="py-4 font-medium text-white">{item.resource}</td>
                  <td className="py-4 text-gray-300">{item.duration}</td>
                  <td className="py-4 text-gray-400 text-xs">{item.unitPrice}</td>
                  <td className="py-4 text-right font-medium text-white">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <span>共 5 条记录</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50">上一页</button>
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
