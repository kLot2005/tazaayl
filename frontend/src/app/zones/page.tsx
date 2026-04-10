'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map as MapIcon,
    Plus,
    Trash2,
    Edit2,
    ChevronLeft,
    Search,
    Layers,
    Palette,
    Eye,
    ArrowUpDown
} from 'lucide-react';
import api from '@/lib/api';
import { TableSkeleton } from '@/components/Skeleton';

export default function ZonesPage() {
    const router = useRouter();
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<any>(null);

    // Поиск и сортировка
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const res = await api.get('/street-zones');
            setZones(res.data);
        } catch (err) {
            console.error('Failed to fetch zones');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить эту геозону? Это действие необратимо.')) return;
        try {
            await api.delete(`/street-zones/${id}`);
            fetchZones();
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };

    const handleUpdateZone = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/street-zones/${editingZone.id}`, {
                name: editingZone.name,
                color: editingZone.color
            });
            setIsEditModalOpen(false);
            fetchZones();
        } catch (err) {
            alert('Ошибка при обновлении');
        }
    };

    // Обработка данных
    const filteredAndSortedZones = useMemo(() => {
        let result = [...zones];

        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(z => z.name?.toLowerCase().includes(lowSearch));
        }

        result.sort((a, b) => {
            let valA = a[sortBy] || '';
            let valB = b[sortBy] || '';

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [zones, searchTerm, sortBy, sortOrder]);

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
            {/* Header */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-4 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Назад в Дашборд</span>
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Геозоны / Полигоны</h1>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Реестр оцифрованных секторов обслуживания</p>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4 text-emerald-500" />
                    Оцифровать на карте
                </button>
            </header>

            {/* Stats Mini Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Всего секторов</p>
                    <p className="text-2xl font-black text-white">{zones.length}</p>
                </div>
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Средняя площадь</p>
                    <p className="text-2xl font-black text-white">0.42 <span className="text-xs text-zinc-500 font-medium whitespace-pre">км²</span></p>
                </div>
                <div className="glass p-5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Покрытие</p>
                    <p className="text-2xl font-black text-emerald-500">84%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        placeholder="ПОИСК ПО НАЗВАНИЮ УЛИЦЫ ИЛИ СЕКТОРА..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all text-white placeholder:text-zinc-700"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleSort('name')}
                        className={`px-6 py-3 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortBy === 'name' ? 'bg-emerald-500 text-emerald-950 border-emerald-500' : 'bg-zinc-900/50 text-zinc-500 hover:text-white'}`}
                    >
                        <ArrowUpDown className="w-3 h-3" /> По имени
                    </button>
                </div>
            </div>

            {/* Main Table Area */}
            <main className="max-w-6xl mx-auto">
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.01] text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Название улицы / Сектора {sortBy === 'name' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </th>
                                <th className="px-8 py-6">Цвет метки</th>
                                <th className="px-8 py-6">Тип геометрии</th>
                                <th className="px-8 py-6 text-right">Управление</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-0">
                                            <TableSkeleton />
                                        </td>
                                    </tr>
                                ) : filteredAndSortedZones.length > 0 ? (
                                    filteredAndSortedZones.map((zone) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={zone.id}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-2 h-8 rounded-full"
                                                        style={{ backgroundColor: zone.color || '#10b981' }}
                                                    />
                                                    <div>
                                                        <p className="text-white font-black tracking-tight text-sm uppercase">{zone.name || 'Unnamed Street'}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ID: SEC-{zone.id.toString().padStart(4, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 bg-zinc-900/50 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                                                    <span className="text-[10px] font-mono text-zinc-400">{zone.color}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Layers className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Polygon</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => { setEditingZone(zone); setIsEditModalOpen(true); }}
                                                        className="p-2.5 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(zone.id)}
                                                        className="p-2.5 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 transition-colors text-zinc-700 hover:text-rose-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em]">Результатов не найдено</p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingZone && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl"
                        >
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Редактировать Зону</h3>
                            <form onSubmit={handleUpdateZone} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Название Сектора</label>
                                        <input
                                            required
                                            value={editingZone.name}
                                            onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                                            className="w-full bg-[#050505] border border-white/5 py-4 px-6 rounded-2xl text-white font-bold tracking-widest text-[11px] outline-none focus:border-emerald-500/50 transition-colors uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Цвет визуализации</label>
                                        <div className="flex gap-3 p-4 bg-[#050505] rounded-2xl border border-white/5">
                                            {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setEditingZone({ ...editingZone, color })}
                                                    className={`w-6 h-6 rounded-full transition-transform ${editingZone.color === color ? 'scale-125 ring-2 ring-white' : 'opacity-40 hover:opacity-100'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-5 font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Отмена</button>
                                    <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 transition-all active:scale-95">Сохранить изменения</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all group w-full ${active ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/5' : 'hover:bg-white/5 text-zinc-500 font-medium'}`}>
            <span className="text-zinc-400 group-hover:text-emerald-400 transition-colors">{icon}</span>
            <span className="hidden lg:block text-[12px] tracking-wide">{label}</span>
        </div>
    );
}

