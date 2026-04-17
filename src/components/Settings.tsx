import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Mail, Smartphone, Check } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">个人设置</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">管理您的账户信息和偏好设置。</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {[
            { id: 'profile', icon: User, label: '个人信息' },
            { id: 'security', icon: Shield, label: '安全设置' },
            { id: 'notifications', icon: Bell, label: '通知偏好' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[var(--color-accent-start)]/10 text-[var(--color-accent-start)] font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-panel rounded-2xl p-6 border border-white/5 min-h-[500px]">
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">基本信息</h3>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent-start)] to-[var(--color-accent-end)] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    U
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10">
                      更换头像
                    </button>
                    <p className="text-xs text-gray-500">支持 JPG, PNG 格式，最大 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">显示名称</label>
                    <input 
                      type="text" 
                      defaultValue="User1234"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">邮箱地址</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="email" 
                        defaultValue="user@example.com"
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-accent-start)] hover:opacity-90 text-white transition-opacity text-sm font-medium"
                >
                  {saved ? <><Check className="w-4 h-4" /> 已保存</> : '保存更改'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">修改密码</h3>
                <div className="max-w-md flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">当前密码</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="password" 
                        placeholder="输入当前密码"
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">新密码</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="password" 
                        placeholder="输入新密码"
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">确认新密码</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="password" 
                        placeholder="再次输入新密码"
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <button className="mt-2 w-fit px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium border border-white/10">
                    更新密码
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h3 className="text-lg font-medium text-white mb-4">两步验证 (2FA)</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">身份验证器应用</p>
                      <p className="text-xs text-gray-400 mt-0.5">使用 Google Authenticator 等应用获取验证码</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[var(--color-accent-start)]/10 text-[var(--color-accent-start)] hover:bg-[var(--color-accent-start)]/20 transition-colors text-sm font-medium">
                    开启
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-8 animate-in fade-in">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">邮件通知</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'n1', title: '余额不足提醒', desc: '当账户余额低于 50 元时发送邮件提醒', defaultChecked: true },
                    { id: 'n2', title: '实例状态变更', desc: '实例创建成功、启动、停止或销毁时发送邮件', defaultChecked: true },
                    { id: 'n3', title: '账单出账提醒', desc: '每月初生成上月账单时发送邮件', defaultChecked: true },
                    { id: 'n4', title: '产品与活动更新', desc: '接收 BitaHub 的最新功能和优惠活动信息', defaultChecked: false },
                  ].map(item => (
                    <label key={item.id} className="flex items-start justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent-start)]"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
