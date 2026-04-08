'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Power,
    MapPin,
    LogOut,
    CircleDot,
    Navigation,
    ShieldCheck,
    Layers,
    CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { io } from 'socket.io-client';

export default function DriverPage() {
    const router = useRouter();
    const [activeShift, setActiveShift] = useState<any>(null);
    const [route, setRoute] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [gpsActive, setGpsActive] = useState(false);
    const [lastPos, setLastPos] = useState<any>(null);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) { router.push('/login'); return; }

            try {
                const [shiftRes, routeRes] = await Promise.all([
                    api.get('/shifts/active'),
                    api.get('/routes/my-route')
                ]);
                setActiveShift(shiftRes.data);
                setRoute(routeRes.data);
            } catch (err) {
                console.error('[DriverPage] Data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Автоматически определяем адрес бэкенда из конфига API
        const socketUrl = 'http://localhost:3005';
        console.log('[DriverPage] Connecting to socket:', socketUrl);
        const s = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        s.on('connect', () => console.log('[DriverPage] Socket CONNECTED:', s.id));
        s.on('connect_error', (err: any) => console.error('[DriverPage] Socket Connection Error:', err));

        setSocket(s);
        return () => { s.disconnect(); };
    }, [router]);

    // GPS Tracking Loop
    useEffect(() => {
        let watchId: number;
        console.log('[DriverPage] Tracking Effect:', { hasShift: !!activeShift, hasSocket: !!socket });

        if (activeShift && socket && activeShift.truck?.id) {
            console.log('[DriverPage] GPS tracking START for Truck:', activeShift.truck.id);
            setGpsActive(true);

            const sendUpdate = (pos: GeolocationPosition) => {
                const coords = {
                    truckId: activeShift.truck.id,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                console.log('[DriverPage] GPS Update Sending:', coords);
                socket.emit('updateLocation', coords);
                setLastPos(coords);
            };

            // 1. Сразу получаем текущую позицию
            navigator.geolocation.getCurrentPosition(
                sendUpdate,
                (err) => console.error('[DriverPage] Initial GPS Error:', err),
                { enableHighAccuracy: true }
            );

            // 2. Начинаем слежение
            watchId = navigator.geolocation.watchPosition(
                sendUpdate,
                (err) => console.error('[DriverPage] Watch GPS Error:', err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setGpsActive(false);
        }
        return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
    }, [activeShift, socket]);

    const startShift = async () => {
        try {
            const res = await api.post('/shifts/start');
            setActiveShift(res.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка старта смены');
        }
    };

    const endShift = async () => {
        if (!confirm('Завершить рабочую смену?')) return;
        try {
            await api.post('/shifts/end');
            setActiveShift(null);
            setLastPos(null);
        } catch (err) {
            alert('Ошибка завершения смены');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center">
            <CircleDot className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col font-sans antialiased pb-20">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Truck className="text-emerald-950 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight uppercase leading-none">DRIVER CTRL</h1>
                        <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mt-1">Version 1.1.0-AST</p>
                    </div>
                </div>
                <button onClick={logout} className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-zinc-500">
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            <main className="flex-1 flex flex-col gap-6">
                {/* Status Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className={`glass p-8 rounded-[2.5rem] border ${activeShift ? 'border-emerald-500/20' : 'border-white/5'} flex flex-col items-center text-center relative overflow-hidden`}
                >
                    {activeShift && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse -z-10" />}

                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${activeShift ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-800 text-zinc-600'}`}>
                        <Navigation className={`w-10 h-10 ${activeShift ? 'animate-bounce' : ''}`} />
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                        {activeShift ? 'Вы на смене' : 'Смена закрыта'}
                    </h2>
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-4">
                        {activeShift
                            ? `Машина: ${activeShift.truck.plateNumber}`
                            : 'Нажмите кнопку ниже для начала работы'}
                    </p>

                    {activeShift && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ТРАНСЛЯЦИЯ GPS АКТИВНА</span>
                        </div>
                    )}
                </motion.div>

                {/* Zones List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Ваш маршрут</h3>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-700 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-widest">Сегодня</span>
                    </div>

                    <div className="space-y-3">
                        {route?.zones && route.zones.length > 0 ? (
                            route.zones.map((zone: any) => (
                                <div key={zone.id} className="glass p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                                    <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: zone.color }} />
                                    <div>
                                        <p className="font-black text-xs uppercase tracking-tight text-white">{zone.name}</p>
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Сектор обслуживания #{zone.id}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center glass rounded-3xl border border-white/5">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Маршрут для вашей машины еще не сформирован
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Action Button Fixed at Bottom */}
            <div className="fixed bottom-6 left-6 right-6 z-20">
                {!activeShift ? (
                    <button
                        onClick={startShift}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Power className="w-6 h-6" />
                        Начать смену
                    </button>
                ) : (
                    <button
                        onClick={endShift}
                        className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 backdrop-blur-xl"
                    >
                        <LogOut className="w-6 h-6" />
                        Завершить смену
                    </button>
                )}
            </div>

            <footer className="mt-8 flex items-center justify-center gap-2 opacity-30 px-6">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Safety Protocol v2.0 Active</span>
            </footer>
        </div>
    );
}
