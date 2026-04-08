'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Maximize2,
    ChevronLeft,
    Activity,
    Truck,
    Layers,
    Settings,
    CircleDot
} from 'lucide-react';
import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#050505] flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">System Initializing...</div>
});

import api from '@/lib/api';
import { io } from 'socket.io-client';

export default function MonitoringPage() {
    const router = useRouter();
    const [zones, setZones] = useState<any[]>([]);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [stats, setStats] = useState({ trucks: 0, zones: 0 });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                router.push('/driver');
                return;
            }
        } else {
            router.push('/login');
            return;
        }

        fetchData();
        const socket = io('http://localhost:3005');

        socket.on('locationUpdated', (data) => {
            setTrucks((prev) => {
                const index = prev.findIndex(t => t.truckId === data.truckId);
                if (index > -1) {
                    const newTrucks = [...prev];
                    newTrucks[index] = data;
                    return newTrucks;
                }
                return [...prev, data];
            });
        });

        return () => { socket.disconnect(); };
    }, []);

    const fetchData = async () => {
        try {
            const [tRes, zRes] = await Promise.all([
                api.get('/trucks').catch(() => ({ data: [] })),
                api.get('/street-zones').catch(() => ({ data: [] }))
            ]);
            setTrucks(tRes.data);
            setZones(zRes.data);
            setStats({ trucks: tRes.data.length, zones: zRes.data.length });
        } catch (err) {
            console.error('Fetch failed');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col font-sans antialiased text-white">
            <div className="absolute inset-0 z-0">
                <Map zones={zones} trucks={trucks} />
            </div>

            <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-4 pointer-events-auto">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => router.push('/')}
                        className="glass px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Вернуться в</p>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">Терминал</p>
                        </div>
                    </motion.button>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-5 rounded-3xl border border-white/10 w-64 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Live Monitoring</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Транспорт</p>
                                    <p className="text-2xl font-black text-white">{trucks.length}</p>
                                </div>
                                <div className="h-10 w-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                    <div className="h-1/2 w-full bg-emerald-500" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Сектора</p>
                                    <p className="text-2xl font-black text-white">{zones.length}</p>
                                </div>
                                <div className="h-10 w-1 bg-blue-500/20 rounded-full overflow-hidden">
                                    <div className="h-3/4 w-full bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button onClick={toggleFullscreen} className="glass p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors group">
                        <Maximize2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                    <button className="glass p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors group">
                        <Layers className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                    <button className="glass p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors group">
                        <Settings className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass px-8 py-3 rounded-full border border-white/10 backdrop-blur-2xl flex items-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">ASTANA-GLOBAL-SYSTEM</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">SECURE LINK: ESTABLISHED</span>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
                        className="absolute top-24 bottom-24 right-6 w-80 glass border border-white/10 rounded-3xl z-10 p-6 backdrop-blur-xl"
                    >
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Список машин</h3>
                        <div className="space-y-3 overflow-y-auto max-h-[calc(100%-80px)] no-scrollbar">
                            {trucks.map(t => (
                                <div key={t.truckId} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[11px] font-black text-white group-hover:text-emerald-400 transition-colors uppercase">{t.truckId}</p>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    </div>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Status: Active Service</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 group">
                <div
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="h-20 w-1 bg-white/20 rounded-l-full group-hover:w-2 group-hover:bg-emerald-500 cursor-pointer transition-all flex items-center justify-center"
                >
                    <div className={`w-0.5 h-4 bg-white transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
        </div>
    );
}
