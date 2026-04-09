'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Map as MapIcon,
  Truck,
  LogOut,
  LayoutDashboard,
  Bell,
  Settings,
  CircleDot,
  User,
  Activity,
  Maximize2,
  CheckCircle2,
  XCircle,
  Plus,
  Layers
} from 'lucide-react';
import React from 'react';
import dynamic from 'next/dynamic';

const FleetMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center text-zinc-600 text-xs uppercase tracking-widest font-bold">Initializing Map...</div>
});
import api from '@/lib/api';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ trucks: 0, zones: 0, routes: 0 });
  const [zones, setZones] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPolygon, setTempPolygon] = useState<any>(null);
  const [isSavingZone, setIsSavingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneColor, setNewZoneColor] = useState('#10b981');

  const fetchZones = async () => {
    try {
      const res = await api.get('/street-zones');
      setZones(res.data);
      setStats(prev => ({ ...prev, zones: res.data.length }));
    } catch (err) {
      console.error('Failed to fetch zones');
    }
  };

  const handleDrawComplete = React.useCallback((polygon: any) => {
    setTempPolygon(polygon);
    setIsDrawing(false);
    setIsSavingZone(true);
  }, []);

  const saveZone = async () => {
    if (!newZoneName) return;
    try {
      await api.post('/street-zones', {
        name: newZoneName,
        boundary: tempPolygon,
        color: newZoneColor
      });
      setNewZoneName('');
      setTempPolygon(null);
      setIsSavingZone(false);
      fetchZones();
    } catch (err) {
      alert('Ошибка при сохранении зоны');
    }
  };

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005');

    // Оптимизация обновлений (дросселирование)
    let pendingUpdates = new Map<number, any>();
    let throttleTimer: NodeJS.Timeout | null = null;

    socket.on('locationUpdated', (data) => {
      pendingUpdates.set(data.truckId, data);

      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          setTrucks((prev) => {
            const newTrucks = [...prev];
            pendingUpdates.forEach((val: any) => {
              const idx = newTrucks.findIndex(t => t.truckId === val.truckId);
              if (idx > -1) newTrucks[idx] = { ...newTrucks[idx], ...val };
              else newTrucks.push(val);
            });
            pendingUpdates.clear();
            return newTrucks;
          });
          throttleTimer = null;
        }, 500);
      }
    });

    return () => {
      socket.disconnect();
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(userStr);
      if (userData.role !== 'admin') {
        router.push('/driver');
        return;
      }
      setUser(userData);

      try {
        const [trucksRes, zonesRes, routesRes] = await Promise.all([
          api.get('/trucks').catch(() => ({ data: [] })),
          api.get('/street-zones').catch(() => ({ data: [] })),
          api.get('/routes').catch(() => ({ data: [] })),
        ]);

        setStats({
          trucks: trucksRes.data.length,
          zones: zonesRes.data.length,
          routes: routesRes.data.length,
        });
        setZones(zonesRes.data);
        setTrucks(trucksRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <CircleDot className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[9px]">Syncing Data...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 overflow-hidden font-sans antialiased">
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-16 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-start py-8 px-4 bg-[#0a0a0a]"
      >
        <div className="flex items-center gap-3 px-2 mb-10 w-full">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Truck className="text-emerald-950 w-5 h-5" />
          </div>
          <div className="hidden lg:block truncate">
            <span className="text-lg font-black text-white tracking-tight block leading-none">Tazaayl</span>
            <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest mt-0.5 block">Operator Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 w-full overflow-y-auto no-scrollbar">
          <NavItem icon={<LayoutDashboard />} label="Дашборд" active />
          <NavItem icon={<Maximize2 />} label="Мониторинг" onClick={() => router.push('/map')} />
          <NavItem icon={<Layers />} label="Сектора / Зоны" onClick={() => router.push('/zones')} />
          <NavItem icon={<Truck />} label="Транспорт" onClick={() => router.push('/trucks')} />
          <NavItem icon={<User />} label="Водители" onClick={() => router.push('/drivers')} />
          <NavItem icon={<BarChart3 />} label="Аналитика" />
          <div className="pt-6 mt-6 border-t border-white/5 w-full">
            <NavItem icon={<Settings />} label="Настройки" />
            <NavItem icon={<Bell />} label="Логи" />
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full group hover:bg-rose-500/5 rounded-xl transition-all text-zinc-600 hover:text-rose-500 font-bold text-[11px] uppercase tracking-wider mt-auto"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Выйти</span>
        </button>
      </motion.aside>

      <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.3em]">System Health: Normal</p>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Оперативный мониторинг</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 shadow-inner">
              <User className="w-5 h-5 text-emerald-400/70" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Widget title="Активно в рейсе" value={stats.trucks.toString()} unit="Units" color="emerald" />
          <Widget title="Оцифровано зон" value={stats.zones.toString()} unit="Sectors" color="blue" />
          <Widget title="Плановых маршрутов" value={stats.routes.toString()} unit="Active" color="amber" />
        </div>

        <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl glass no-scrollbar">
          <FleetMap zones={zones} trucks={trucks} isDrawing={isDrawing} onDrawComplete={handleDrawComplete} />

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {!isDrawing && !isSavingZone ? (
              <button onClick={() => setIsDrawing(true)} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95">
                <Plus className="w-4 h-4" /> Оцифровать Зону
              </button>
            ) : isDrawing ? (
              <div className="flex flex-col gap-2 scale-in group">
                <button onClick={() => setIsDrawing(false)} className="bg-rose-500 hover:bg-rose-400 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95">
                  <XCircle className="w-4 h-4" /> Отмена
                </button>
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl animate-bounce-subtle">
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Инструкция</p>
                  <p className="text-[10px] text-zinc-300 font-bold leading-tight">
                    • Ставьте точки кликом<br />
                    • Двойной клик или <span className="text-white">Enter</span><br />
                    <span className="text-emerald-500/50">завершают отрисовку</span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <AnimatePresence>
            {isSavingZone && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 glass border border-emerald-500/30 p-4 rounded-2xl z-20 flex items-center gap-4 w-[400px]">
                <div className="flex-1">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Зона отрисована</p>
                  <input autoFocus placeholder="НАЗВАНИЕ..." value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} className="bg-transparent border-none outline-none text-[11px] font-bold text-white tracking-widest w-full placeholder:text-zinc-600 uppercase mb-3" />
                  <div className="flex gap-2">
                    {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                      <button key={color} onClick={() => setNewZoneColor(color)} className={`w-4 h-4 rounded-full transition-transform ${newZoneColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-40'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <button onClick={() => { setIsSavingZone(false); setTempPolygon(null); }} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><XCircle className="w-5 h-5" /></button>
                  <button onClick={saveZone} className="bg-emerald-500 text-emerald-950 p-2 rounded-lg hover:bg-emerald-400 transition-colors"><CheckCircle2 className="w-5 h-5" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-xl border border-white/10 z-10 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Live Tracking Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all group w-full ${active ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/5' : 'hover:bg-white/5 text-zinc-500 font-medium'}`}>
      {React.cloneElement(icon, { className: `w-4 h-4 ${active ? 'text-emerald-400' : 'group-hover:text-emerald-300'}` })}
      <span className="hidden lg:block text-[12px] tracking-wide">{label}</span>
    </div>
  );
}

function Widget({ title, value, unit, color }: { title: string, value: string, unit: string, color: 'emerald' | 'blue' | 'amber' }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
      <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-3">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{unit}</p>
      </div>
      <div className={`mt-2 h-1 w-8 rounded-full ${color === 'emerald' ? 'bg-emerald-500/20' : color === 'blue' ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}>
        <div className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: '40%' }} />
      </div>
    </div>
  );
}
