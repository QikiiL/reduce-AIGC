import { useState } from 'react';
import { Loader2, FileText, Settings, ShieldCheck, Sparkles, Copy, Check, Globe } from 'lucide-react';

const TENCENT_CLOUD_FUNCTION_URL = 'https://1324344853-49ve2becrb.ap-guangzhou.tencentscf.com'; 

export default function App() {
  const [inputText, setInputText] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [requirements, setRequirements] = useState('约等于0');
  const [styleRef, setStyleRef] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ optimizedText: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    if (!inputText.trim()) {
      setError('请输入需要优化的文本');
      return;
    }
    
    // 检查云函数 URL 是否已配置
    if (TENCENT_CLOUD_FUNCTION_URL.includes('你的腾讯云网关地址')) {
      setError('请先在代码中配置您的腾讯云函数 URL');
      return;
    }

    setError('');
    setIsOptimizing(true);
    setNetworkStatus('searching');
    setResult(null);

    try {
      // 向你的腾讯云后端发送请求
      const response = await fetch(TENCENT_CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText,
          discipline,
          requirements,
          styleRef,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '服务器响应异常');
      }

      const data = await response.json();
      
      if (data && data.optimizedText) {
        setResult({
          optimizedText: data.optimizedText,
        });
        setNetworkStatus('success');
      } else {
        throw new Error('返回数据格式不正确');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '优化过程中发生错误，请重试。');
      setNetworkStatus('error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimizedText) {
      navigator.clipboard.writeText(result.optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              学术论文原创性优化系统
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Globe className={`w-4 h-4 ${
                networkStatus === 'success' ? 'text-emerald-500' :
                networkStatus === 'error' ? 'text-red-500' :
                networkStatus === 'searching' ? 'text-blue-500' :
                'text-gray-400'
              }`} />
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  {networkStatus === 'searching' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    networkStatus === 'success' ? 'bg-emerald-500' :
                    networkStatus === 'error' ? 'bg-red-500' :
                    networkStatus === 'searching' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}></span>
                </span>
                <span className="font-medium text-sm">
                  {networkStatus === 'success' ? '联网检索成功' :
                   networkStatus === 'error' ? '联网检索失败' :
                   networkStatus === 'searching' ? '正在联网检索...' :
                   '联网待命'}
                </span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm">动态追踪最新AI检测算法，目标AI率约等于0</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-500" />
                优化参数设置
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学科领域</label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder="例：计算机科学、社会学"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标要求/AI率</label>
                  <input
                    type="text"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="默认：约等于0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">作者风格参考 (可选)</label>
                  <input
                    type="text"
                    value={styleRef}
                    onChange={(e) => setStyleRef(e.target.value)}
                    placeholder="描述您的写作习惯，或粘贴一段过往文字"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-500" />
                待优化文本
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在此粘贴需要优化的学术论文片段..."
                className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none font-serif leading-relaxed"
              ></textarea>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    联网检索最新策略并深度优化中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始深度优化
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[780px] overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <FileText className="w-5 h-5 text-emerald-600" />
                优化后文本
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-6 relative">
              {!result && !isOptimizing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                  <p>等待输入文本进行优化</p>
                </div>
              )}

              {isOptimizing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600">
                  <Globe className="w-12 h-12 mb-4 animate-pulse opacity-80" />
                  <p className="font-medium">正在检索最新AI检测算法特征...</p>
                  <p className="text-sm text-gray-500 mt-2">执行多维特征消除与重构，请耐心等待</p>
                </div>
              )}

              {result && !isOptimizing && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors bg-gray-100 hover:bg-emerald-50 px-3 py-1.5 rounded-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制文本'}
                    </button>
                  </div>
                  <div className="prose prose-emerald max-w-none font-serif leading-loose text-gray-800 whitespace-pre-wrap">
                    {result.optimizedText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}