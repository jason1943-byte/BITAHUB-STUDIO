import { LayoutDashboard, Server, PlusSquare, Image as ImageIcon, Key, Box, PlaySquare, CreditCard, FileText, Settings, User, Shield, Home } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToHome: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onBackToHome }: SidebarProps) {
  const sections = [
    {
      header: '工作空间',
      items: [
        { id: 'dashboard', label: '概览 (Dashboard)', icon: LayoutDashboard },
      ]
    },
    {
      header: '实例管理',
      items: [
        { id: 'instances', label: '实例列表', icon: Server },
        { id: 'create-instance', label: '创建实例', icon: PlusSquare },
      ]
    },
    {
      header: '镜像市场',
      items: [
        { id: 'images', label: '镜像列表', icon: ImageIcon },
      ]
    },
    {
      header: 'API 服务',
      items: [
        { id: 'api-keys', label: 'API Key 管理', icon: Key },
        { id: 'models', label: '模型列表', icon: Box },
        { id: 'playground', label: 'Playground', icon: PlaySquare },
      ]
    },
    {
      header: '费用中心',
      items: [
        { id: 'billing', label: '余额与充值', icon: CreditCard },
        { id: 'bills', label: '账单明细', icon: FileText },
      ]
    },
    {
      header: '个人设置',
      items: [
        { id: 'settings', label: '个人设置', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="glass-panel sidebar flex flex-col p-6 gap-6 z-40 h-full rounded-[24px] overflow-y-auto scrollbar-hide">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1 px-3">
            {section.header}
          </div>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          <span>返回首页</span>
        </button>
      </div>
    </aside>
  );
}
