import React, { useState } from 'react';
import { Send, Settings2, Bot, User, Trash2, RefreshCw } from 'lucide-react';

export default function Playground() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是 BitaHub AI 助手，请问有什么我可以帮您的？' }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('deepseek-r1');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [showSettings, setShowSettings] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Mock response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', content: '这是一个模拟的回复。在实际应用中，这里会调用您选择的 API 模型并返回结果。' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">在线调试</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">在浏览器中直接测试和体验 API 模型。</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50"
          >
            <option value="deepseek-r1">DeepSeek-R1</option>
            <option value="deepseek-v3">DeepSeek-V3</option>
            <option value="llama-3-70b">Llama-3-70B-Instruct</option>
            <option value="qwen-2.5-72b">Qwen-2.5-72B-Instruct</option>
          </select>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)]' : 'bg-white/10 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-accent-start)]/10 text-white border border-[var(--color-accent-start)]/20' 
                    : 'bg-white/5 text-gray-300 border border-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-[var(--color-accent-start)]/50 transition-colors">
              <button 
                onClick={() => setMessages([])}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="清空对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入消息..." 
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-2"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-[var(--color-accent-start)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-80 glass-panel rounded-2xl p-6 flex flex-col gap-6 border border-white/5 overflow-y-auto shrink-0 animate-in slide-in-from-right-8">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> 模型参数
            </h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">System Prompt</label>
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors h-24 resize-none"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Temperature</span>
                  <span className="text-white">{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="2" step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-accent-start)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Max Tokens</span>
                  <span className="text-white">{maxTokens}</span>
                </div>
                <input 
                  type="range" 
                  min="256" max="8192" step="256" 
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[var(--color-accent-start)]"
                />
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm">
                <RefreshCw className="w-4 h-4" /> 恢复默认设置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
