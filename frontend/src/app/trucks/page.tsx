'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Plus,
    Trash2,
    Edit2,
    ChevronLeft,
    Search,
    User,
    MapPin,
    Activity,
    Layers,
    ArrowUpDown,
    Filter
} from 'lucide-react';
import api from '@/lib/api';
import { TableSkeleton } from '@/components/Skeleton';

export default function TrucksPage() {
    const router = useRouter();
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTruck, setNewTruck] = useState({ plateNumber: '', model: '' });

    // Поиск и сортировка
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const fetchData = async () => {
        try {
            const res = await api.get('/trucks');
            setTrucks(res.data);
        } catch (err) {
            console.error('Failed to fetch trucks');
        } finally {
            setLoading(false);
        }
    };

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
    }, [router]);

    const handleAddTruck = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/trucks', newTruck);
            setNewTruck({ plateNumber: '', model: '' });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Ошибка при добавлении');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены?')) return;
        try {
            await api.delete(`/trucks/${id}`);
            fetchData();
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };

    // Обработка данных
    const filteredAndSortedTrucks = useMemo(() => {
        let result = [...trucks];

        // Поиск
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.plateNumber?.toLowerCase().includes(lowSearch) ||
                t.model?.toLowerCase().includes(lowSearch) ||
                t.driver?.username?.toLowerCase().includes(lowSearch)
            );
        }

        // Сортировка
        result.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (sortBy === 'username') {
                valA = a.driver?.username || '';
                valB = b.driver?.username || '';
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [trucks, searchTerm, sortBy, sortOrder]);

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-400 p-6 lg:p-10 font-sans antialiased">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-4 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Назад в Дашборд</span>
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Автопарк</h1>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Управление и мониторинг активных юнитов</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 text-emerald-950 px-6 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Plus className="w-4 h-4" />
                    Новый Юнит
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* Фильтры и поиск */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            placeholder="ПОИСК ПО НОМЕРУ, МОДЕЛИ ИЛИ ВОДИТЕЛЮ..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all text-white placeholder:text-zinc-700"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-1 flex items-center">
                            <button
                                onClick={() => toggleSort('plateNumber')}
                                className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortBy === 'plateNumber' ? 'bg-emerald-500 text-emerald-950' : 'text-zinc-500 hover:text-white'}`}
                            >
                                <Truck className="w-3 h-3" /> Номер
                            </button>
                            <button
                                onClick={() => toggleSort('username')}
                                className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortBy === 'username' ? 'bg-emerald-500 text-emerald-950' : 'text-zinc-500 hover:text-white'}`}
                            >
                                <User className="w-3 h-3" /> Водитель
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01] text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('plateNumber')}>
                                    <div className="flex items-center gap-2">
                                        ID / Гос. номер {sortBy === 'plateNumber' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </th>
                                <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('username')}>
                                    <div className="flex items-center gap-2">
                                        Водитель {sortBy === 'username' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </th>
                                <th className="px-8 py-6">Привязаный Маршрут</th>
                                <th className="px-8 py-6">Статус</th>
                                <th className="px-8 py-6 text-right">Управление</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode='popLayout'>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-0">
                                            <TableSkeleton />
                                        </td>
                                    </tr>
                                ) : filteredAndSortedTrucks.length > 0 ? (
                                    filteredAndSortedTrucks.map((truck) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={truck.id}
                                            className="group hover:bg-white/[0.01] transition-all"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                                        <Truck className="w-6 h-6 text-emerald-500/70" />
                                                    </div>
                                                    <div>
                                                        <span className="text-white font-black uppercase text-sm block tracking-tight">{truck.plateNumber}</span>
                                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{truck.model || 'MAN TGS'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {truck.driver ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                                            <User className="w-3.5 h-3.5 text-emerald-500" />
                                                        </div>
                                                        <span className="text-[11px] font-black text-white uppercase tracking-tight">{truck.driver.username}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Не назначен</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {truck.zones && truck.zones.length > 0 ? (
                                                        truck.zones.map((zone: any) => (
                                                            <div key={zone.id} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg flex items-center gap-1.5">
                                                                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                                                                <span className="text-[8px] font-black uppercase tracking-tight text-zinc-400">{zone.name}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest">Маршрут пуст</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleDelete(truck.id)} className="p-2.5 bg-rose-500/5 rounded-xl text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Результатов не найдено</p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                            <h2 className="text-xl font-black uppercase text-white mb-8 tracking-tight">Добавить новый транспорт</h2>
                            <form onSubmit={handleAddTruck} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Гос. регистрационный номер</label>
                                        <input required placeholder="001 AAA 01" value={newTruck.plateNumber} onChange={e => setNewTruck({ ...newTruck, plateNumber: e.target.value.toUpperCase() })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold tracking-[0.2em] outline-none focus:border-emerald-500/50 transition-all text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Модель юнита</label>
                                        <input required placeholder="MAN TGS / КАМАЗ" value={newTruck.model} onChange={e => setNewTruck({ ...newTruck, model: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold tracking-widest outline-none focus:border-emerald-500/50 transition-all text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-colors">Отмена</button>
                                    <button type="submit" className="flex-1 bg-emerald-500 text-emerald-950 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all">Создать</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

