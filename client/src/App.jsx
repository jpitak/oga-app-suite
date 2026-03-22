import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import {
  BarChart3,
  Boxes,
  Bot,
  Camera,
  ChevronRight,
  Download,
  LogOut,
  MessageSquare,
  Package2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Warehouse,
  Zap
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const api = axios.create({ withCredentials: true });

const sidebarConfig = [
  { key: 'Marketing', icon: BarChart3 },
  { key: 'Facial', icon: Camera },
  { key: 'Robotics', icon: Bot },
  { key: 'Inventory', icon: Warehouse },
  { key: 'Product', icon: Package2 },
];

const gradients = {
  Marketing: 'from-sky-400 via-cyan-400 to-blue-600',
  Facial: 'from-violet-500 via-fuchsia-500 to-purple-600',
  Robotics: 'from-emerald-400 via-teal-400 to-green-600',
  Inventory: 'from-orange-400 via-amber-400 to-red-500',
  Product: 'from-pink-500 via-rose-500 to-red-500',
};

const statusColors = {
  'Available': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  'Low Stock': 'bg-orange-500/20 text-orange-100 border-orange-400/30',
  'Reserved': 'bg-violet-500/20 text-violet-100 border-violet-400/30',
  'Active': 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
  'Idle': 'bg-slate-500/20 text-slate-100 border-slate-400/30',
  'Scaling': 'bg-sky-500/20 text-sky-100 border-sky-400/30',
  'Healthy': 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
  'Top 5': 'bg-pink-500/20 text-pink-100 border-pink-400/30',
  'Growing': 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30',
  'Insight Ready': 'bg-purple-500/20 text-purple-100 border-purple-400/30',
  'Monitoring': 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30',
  'ออนไลน์': 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
  'ซิงก์อยู่': 'bg-sky-500/20 text-sky-100 border-sky-400/30',
};

const quickPrompts = {
  Marketing: ['สรุป Conversion ที่ควรโฟกัสสัปดาห์นี้', 'วิเคราะห์ CAC และ ROAS แบบผู้บริหาร', 'ช่วยวาง Action Plan สำหรับแคมเปญที่ต้นทุนสูง'],
  Facial: ['วิเคราะห์ sentiment ของลูกค้ากลุ่มใหม่', 'สรุป repeat visitor และ dwell time', 'ช่วยหาความเสี่ยงจาก demographic ที่เปลี่ยนไป'],
  Robotics: ['สรุปสถานะหุ่นยนต์และแบตเตอรี่', 'ช่วยวิเคราะห์ error log และความเสี่ยง', 'วางแผน preventive maintenance ให้หน่อย'],
  Inventory: ['มีสินค้าไหนเสี่ยง Low Stock บ้าง', 'ช่วยสรุป turnover ratio', 'วิเคราะห์สินค้าค้างสต็อกและแนวทางระบาย'],
  Product: ['สินค้าขายดี 5 อันดับควรทำอะไรต่อ', 'สรุปรีวิวและอัตราการคืนสินค้า', 'วิเคราะห์ stock-to-sales ratio ให้หน่อย'],
};

function formatProvider(provider) {
  return provider === 'gemini' ? 'Gemini' : provider === 'openai' ? 'GPT' : provider === 'anthropic' ? 'Claude' : 'Mock AI';
}

function LoginScreen({ authConfig, onDemoLogin }) {
  const [name, setName] = useState('OGA Team Member');

  return (
    <div className="min-h-screen bg-[#060d1f] bg-mesh-glow px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-glass backdrop-blur-2xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" /> OGA International Enterprise Suite
          </div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            Glossy AI Dashboard<br />
            สำหรับบริหารองค์กรยุคใหม่
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200/85">
            รวม 5 โมดูลหลัก Marketing, Facial, Robotics, Inventory และ Product พร้อม AI Chat, Google Login, ตารางข้อมูลแบบสะอาดตา, Glassmorphism และปุ่มสไตล์ 3D ในระบบเดียว
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sidebarConfig.map(({ key, icon: Icon }) => (
              <div key={key} className={clsx('rounded-3xl border border-white/10 bg-gradient-to-br p-5 shadow-glow', gradients[key])}>
                <div className="flex items-center justify-between text-white">
                  <Icon className="h-8 w-8" />
                  <ChevronRight className="h-5 w-5 opacity-70" />
                </div>
                <div className="mt-8 text-xl font-bold">{key}</div>
                <div className="mt-2 text-sm text-white/80">AI-ready module พร้อมใช้งานร่วมกันหลายผู้ใช้</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-glass backdrop-blur-2xl">
          <div className="mb-8 flex items-center gap-3 text-slate-100">
            <ShieldCheck className="h-7 w-7 text-emerald-300" />
            <div>
              <div className="text-2xl font-bold">Sign in</div>
              <div className="text-sm text-slate-400">รองรับ Google Login และ Demo Login</div>
            </div>
          </div>
          {authConfig?.googleEnabled ? (
            <a href="/auth/google" className="flex h-14 w-full items-center justify-center rounded-2xl border border-white/10 bg-white text-base font-semibold text-slate-900 shadow-button3d transition hover:-translate-y-0.5">
              เข้าสู่ระบบด้วย Google
            </a>
          ) : (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              Google OAuth ยังไม่ได้ใส่คีย์ในไฟล์ .env ระบบจึงเปิด Demo Login ให้ใช้งานแทนชั่วคราว
            </div>
          )}
          <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
            <div className="h-px flex-1 bg-white/10" /> หรือ <div className="h-px flex-1 bg-white/10" />
          </div>
          <label className="mb-2 block text-sm text-slate-300">ชื่อสำหรับเข้า Demo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            placeholder="เช่น OGA Analyst"
          />
          <button onClick={() => onDemoLogin(name)} className="btn-3d w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 py-4 font-semibold text-white">
            เข้าใช้งาน Demo Login
          </button>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatChip icon={Users} label="Multi-user" value="Shared DB" />
            <StatChip icon={MessageSquare} label="AI Chat" value="Hybrid" />
            <StatChip icon={Download} label="Export" value="PDF / Excel" />
            <StatChip icon={UserCog} label="Roles" value="Viewer/Admin" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-300"><Icon className="h-4 w-4" /> {label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function App() {
  const [authConfig, setAuthConfig] = useState(null);
  const [user, setUser] = useState(undefined);
  const [dashboard, setDashboard] = useState(null);
  const [activeModule, setActiveModule] = useState('Marketing');
  const [provider, setProvider] = useState('mock');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const moduleData = useMemo(() => dashboard?.modules?.find((m) => m.name === activeModule), [dashboard, activeModule]);
  const pieData = useMemo(() => {
    if (!moduleData?.records?.length) return [];
    const map = {};
    moduleData.records.forEach((item) => { map[item.status] = (map[item.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [moduleData]);

  async function initialize() {
    try {
      const [configRes, meRes, dashboardRes] = await Promise.all([
        api.get('/api/auth/config'),
        api.get('/api/auth/me'),
        api.get('/api/dashboard'),
      ]);
      setAuthConfig(configRes.data);
      setUser(meRes.data.user || null);
      setDashboard(dashboardRes.data);
      const firstModule = dashboardRes.data?.modules?.[0]?.name;
      if (firstModule) setActiveModule(firstModule);
      if (meRes.data.user) {
        await Promise.all([loadHistory(), loadUsers()]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBooting(false);
    }
  }

  async function loadHistory() {
    try {
      const res = await api.get('/api/chat/history');
      setHistory(res.data.history || []);
    } catch {
      setHistory([]);
    }
  }

  async function loadUsers() {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    }
  }

  async function handleDemoLogin(name) {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/demo-login', { name });
      setUser(res.data.user);
      await Promise.all([loadHistory(), loadUsers()]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(promptText) {
    const finalMessage = (promptText ?? message).trim();
    if (!finalMessage) return;
    setLoading(true);
    try {
      const res = await api.post('/api/chat', { message: finalMessage, module: activeModule, provider });
      setHistory((prev) => [
        ...prev,
        { id: `tmp-${Date.now()}`, user_name: user?.name, question: finalMessage, answer: res.data.reply, module: activeModule, provider: res.data.provider, created_at: new Date().toISOString() }
      ]);
      setMessage('');
      await loadHistory();
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api.post('/api/auth/logout');
    setUser(null);
    setHistory([]);
    setUsers([]);
  }

  async function updateRole(id, role) {
    await api.patch(`/api/users/${id}/role`, { role });
    await loadUsers();
  }

  if (booting) {
    return <div className="grid min-h-screen place-items-center bg-[#050b18] text-white">Loading OGA Experience...</div>;
  }

  if (!user) {
    return <LoginScreen authConfig={authConfig} onDemoLogin={handleDemoLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050b18] bg-mesh-glow text-white">
      <div className="mx-auto grid min-h-screen max-w-[1700px] gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="glass-panel sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#071329] via-[#0b1a3d] to-[#081022] p-5">
          <div className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-sky-200/70">OGA International</div>
              <div className="mt-1 text-2xl font-black">Enterprise AI</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <Boxes className="h-6 w-6 text-cyan-300" />
            </div>
          </div>

          <div className="space-y-3">
            {sidebarConfig.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveModule(key)}
                className={clsx(
                  'group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition',
                  activeModule === key
                    ? 'border-cyan-300/40 bg-white/15 shadow-glow'
                    : 'border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10'
                )}
              >
                <div className={clsx('rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg', gradients[key])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{key}</div>
                  <div className="text-xs text-slate-400">Module dashboard</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:text-white" />
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-cyan-200"><Sparkles className="h-4 w-4" /> AI Provider</div>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#09142a] px-4 py-3 text-white outline-none">
              <option value="mock">Mock AI</option>
              <option value="gemini">Gemini</option>
              <option value="openai">GPT (placeholder)</option>
              <option value="anthropic">Claude (placeholder)</option>
            </select>
            <p className="mt-3 text-xs text-slate-400">หากยังไม่ใส่ API Key ระบบจะ fallback ไปใช้ Mock Response อัตโนมัติ</p>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-white"><Users className="h-4 w-4 text-cyan-300" /> {user.name}</div>
            <div>สิทธิ์: <span className="font-semibold text-cyan-200">{user.role}</span></div>
            <button onClick={logout} className="btn-3d mt-5 w-full rounded-2xl bg-gradient-to-r from-slate-600 to-slate-800 py-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> ออกจากระบบ</span>
            </button>
          </div>
        </aside>

        <main className="space-y-5 py-1">
          <section className="glass-panel rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur-2xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">Modern Enterprise Workspace</div>
                <h1 className="mt-3 text-3xl font-black md:text-5xl">{moduleData?.title || activeModule}</h1>
                <p className="mt-3 max-w-3xl text-slate-300">{moduleData?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <OverviewCard title="Total Users" value={dashboard?.overview?.totalUsers} icon={Users} gradient="from-blue-500 to-cyan-500" />
                <OverviewCard title="AI Chats" value={dashboard?.overview?.totalChats} icon={MessageSquare} gradient="from-violet-500 to-fuchsia-500" />
                <OverviewCard title="Data Rows" value={dashboard?.overview?.totalRecords} icon={DatabaseCardIcon} gradient="from-orange-400 to-red-500" />
                <OverviewCard title="Modules" value={dashboard?.overview?.activeModules} icon={Boxes} gradient="from-emerald-400 to-green-500" />
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                {moduleData?.kpis?.map((item) => (
                  <div key={item.label} className={clsx('rounded-[28px] border border-white/15 bg-gradient-to-br p-5 shadow-glow', gradients[activeModule])}>
                    <div className="text-sm text-white/80">{item.label}</div>
                    <div className="mt-6 text-4xl font-black text-white">{item.value}</div>
                    <div className="mt-3 inline-flex rounded-full bg-black/20 px-3 py-1 text-sm text-white/90">{item.delta}</div>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-[32px] border border-white/10 bg-slate-950/45 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Performance Trend</h2>
                    <p className="text-sm text-slate-400">ภาพรวมประสิทธิภาพแบบหลายโมดูล</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-cyan-100">Live-style mock analytics</div>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard?.trendSeries || []}>
                      <defs>
                        <linearGradient id="marketingFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} /><stop offset="100%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
                        <linearGradient id="facialFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c084fc" stopOpacity={0.35} /><stop offset="100%" stopColor="#c084fc" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#081224', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)' }} />
                      <Area type="monotone" dataKey="facial" stroke="#67e8f9" fill="url(#marketingFill)" strokeWidth={3} />
                      <Area type="monotone" dataKey="marketing" stroke="#fb923c" fillOpacity={0} strokeWidth={2.5} />
                      <Area type="monotone" dataKey="robotics" stroke="#34d399" fillOpacity={0} strokeWidth={2.5} />
                      <Area type="monotone" dataKey="inventory" stroke="#f472b6" fill="url(#facialFill)" strokeWidth={2.5} />
                      <Area type="monotone" dataKey="product" stroke="#a78bfa" fillOpacity={0} strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[32px] border border-white/10 bg-slate-950/45 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">AI Chat Interface</h2>
                  <p className="text-sm text-slate-400">ถาม AI กลางระบบ และรับคำตอบแบบ mock/hybrid</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">{formatProvider(provider)}</div>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {(quickPrompts[activeModule] || []).map((prompt) => (
                  <button key={prompt} onClick={() => sendMessage(prompt)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 hover:bg-white/10">
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="scrollbar-thin h-[390px] space-y-4 overflow-auto rounded-[28px] border border-white/10 bg-[#071122]/80 p-4">
                {history.length === 0 ? (
                  <div className="grid h-full place-items-center text-center text-slate-400">
                    <div>
                      <Bot className="mx-auto mb-4 h-12 w-12 text-cyan-300" />
                      <div className="text-lg font-semibold text-slate-200">เริ่มต้นถาม AI ได้ทันที</div>
                      <div className="mt-2 text-sm">ระบบจะบันทึกประวัติคำถามไว้ในฐานข้อมูลร่วมของระบบนี้</div>
                    </div>
                  </div>
                ) : history.map((item) => (
                  <div key={item.id} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{item.user_name || user.name} • {item.module}</span>
                      <span>{formatProvider(item.provider)}</span>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-100">
                      <span className="font-semibold text-cyan-200">Q:</span> {item.question}
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-4 text-sm whitespace-pre-line text-slate-100">
                      <span className="font-semibold text-fuchsia-200">AI:</span> {item.answer}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={`ถาม AI เกี่ยวกับ ${activeModule}...`}
                  className="w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">ตัวอย่างนี้พร้อมใช้ Gemini API จริงเมื่อใส่ Key และยังมี mock response สำหรับทดสอบเสมอ</div>
                <button onClick={() => sendMessage()} disabled={loading} className="btn-3d rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
                  {loading ? 'กำลังตอบ...' : 'ส่งคำถาม'}
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[.95fr_1.05fr]">
            <div className="glass-panel rounded-[32px] border border-white/10 bg-slate-950/45 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Status Distribution</h2>
                  <p className="text-sm text-slate-400">ภาพรวมสถานะข้อมูลในโมดูล {activeModule}</p>
                </div>
                <RefreshCw className="h-5 w-5 text-slate-500" />
              </div>
              <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                        {pieData.map((entry, index) => (
                          <Cell key={entry.name} fill={['#38bdf8','#fb923c','#a78bfa','#34d399','#f472b6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#081224', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ['#38bdf8','#fb923c','#a78bfa','#34d399','#f472b6'][index % 5] }} />
                        <span>{entry.name}</span>
                      </div>
                      <span className="text-xl font-bold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[32px] border border-white/10 bg-slate-950/45 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Module Comparison</h2>
                  <p className="text-sm text-slate-400">เปรียบเทียบสัญญาณหลักจากแต่ละหมวด</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard?.modules?.map((module) => ({
                    name: module.name,
                    value: Number(module.records?.[0]?.metric_primary || 0),
                  })) || []}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#081224', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {(dashboard?.modules || []).map((module) => <Cell key={module.name} fill={module.name === 'Marketing' ? '#38bdf8' : module.name === 'Facial' ? '#a78bfa' : module.name === 'Robotics' ? '#34d399' : module.name === 'Inventory' ? '#fb923c' : '#f472b6'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-[32px] border border-white/10 bg-slate-950/45 p-6">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{activeModule} Records</h2>
                <p className="text-sm text-slate-400">ตารางข้อมูลแบบ clean enterprise พร้อมปุ่ม 3D และ export</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={`/api/export/pdf?module=${activeModule}`} className="btn-3d rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white">
                  ส่งออก PDF
                </a>
                <a href={`/api/export/excel?module=${activeModule}`} className="btn-3d rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 px-5 py-3 text-sm font-semibold text-white">
                  ส่งออก Excel
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/10 text-slate-300">
                    <tr>
                      {['Code', 'Name', 'Primary', 'Secondary', 'Status', 'Details'].map((heading) => (
                        <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {moduleData?.records?.map((row) => (
                      <tr key={row.id} className="border-t border-white/5 bg-white/[0.03] hover:bg-white/[0.06]">
                        <td className="px-5 py-4 text-slate-300">{row.code}</td>
                        <td className="px-5 py-4 font-semibold text-white">{row.name}</td>
                        <td className="px-5 py-4 text-slate-200">{row.metric_primary}</td>
                        <td className="px-5 py-4 text-slate-200">{row.metric_secondary}</td>
                        <td className="px-5 py-4">
                          <span className={clsx('rounded-full border px-3 py-1 text-xs', statusColors[row.status] || 'bg-white/10 text-white border-white/10')}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{row.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-5 py-1">
          <section className="glass-panel rounded-[32px] border border-white/10 bg-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-cyan-200">System Status</div>
                <div className="text-2xl font-bold">Operational Health</div>
              </div>
              <Zap className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="space-y-3">
              {dashboard?.systemStatus?.map((item) => (
                <div key={item.service} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{item.service}</div>
                      <div className="mt-1 text-sm text-slate-400">อัปเดตล่าสุด {item.updated}</div>
                    </div>
                    <span className={clsx('rounded-full border px-3 py-1 text-xs', statusColors[item.status] || 'border-white/10 bg-white/10')}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">Uptime {item.uptime}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[32px] border border-white/10 bg-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-cyan-200">Administration</div>
                <div className="text-2xl font-bold">User Management</div>
              </div>
              <UserCog className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{u.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{u.email || 'no-email'}</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">{u.provider}</span>
                    <select
                      value={u.role}
                      disabled={user.role !== 'admin'}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#0a1730] px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      <option value="viewer">viewer</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[32px] border border-white/10 bg-white/10 p-6">
            <div className="mb-4 text-2xl font-bold">Reference Widget Mood</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <ReferenceMood title="Deep Navy Sidebar" desc="โทน enterprise หรูและคุม mood ให้ข้อมูลเด่น" color="from-[#071329] to-[#163267]" />
              <ReferenceMood title="Glass Cards" desc="เลเยอร์โปร่งใส + blur ให้ความเงาแบบทันสมัย" color="from-white/25 to-white/5" />
              <ReferenceMood title="Gradient Widgets" desc="ใช้สีสดอย่างฟ้า ส้ม ม่วง ชมพู เขียวกับ KPI สำคัญ" color="from-cyan-400 via-orange-400 to-fuchsia-500" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className={clsx('rounded-[26px] border border-white/10 bg-gradient-to-br p-4 text-white shadow-glow', gradient)}>
      <div className="flex items-center justify-between text-white/80"><span className="text-sm">{title}</span><Icon className="h-5 w-5" /></div>
      <div className="mt-5 text-3xl font-black">{value}</div>
    </div>
  );
}

function ReferenceMood({ title, desc, color }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className={clsx('mb-3 h-20 rounded-2xl bg-gradient-to-br', color)} />
      <div className="font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-400">{desc}</div>
    </div>
  );
}

function DatabaseCardIcon(props) {
  return <Boxes {...props} />;
}

export default App;
