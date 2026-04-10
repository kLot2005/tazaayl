'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Trash2,
    Edit2,
    ChevronLeft,
    Search,
    Truck as TruckIcon,
    MapPin,
    ShieldCheck,
    Plus,
    Key,
    ArrowUpDown
} from 'lucide-react';
import api from '@/lib/api';
import { CardSkeleton } from '@/components/Skeleton';

export default function DriversPage() {
    const router = useRouter();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriverId, setEditingDriverId] = useState<number | null>(null);

    // Поиск и сортировка
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('username');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        truckId: '',
        zoneIds: [] as number[]
    });

    const fetchData = async () => {
        try {
            const [dRes, tRes, zRes] = await Promise.all([
                api.get('/drivers'),
                api.get('/trucks'),
                api.get('/street-zones')
            ]);
            setDrivers(dRes.data);
            setTrucks(tRes.data);
            setZones(zRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr || JSON.parse(userStr).role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchData();
    }, [router]);

    const handleOpenCreate = () => {
        setEditingDriverId(null);
        setFormData({ username: '', password: '', truckId: '', zoneIds: [] });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (driver: any) => {
        setEditingDriverId(driver.id);
        setFormData({
            username: driver.username,
            password: '', // Пароль не показываем
            truckId: driver.truck?.id?.toString() || '',
            zoneIds: [] // Зоны нужно бы подтянуть из текущего маршрута
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                truckId: formData.truckId ? parseInt(formData.truckId) : null
            };

            if (editingDriverId) {
                await api.patch(`/drivers/${editingDriverId}`, payload);
            } else {
                await api.post('/drivers', payload);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить водителя?')) return;
        try {
            await api.delete(`/drivers/${id}`);
            fetchData();
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };

    const toggleZone = (id: number) => {
        setFormData(prev => ({
            ...prev,
            zoneIds: prev.zoneIds.includes(id)
                ? prev.zoneIds.filter(zid => zid !== id)
                : [...prev.zoneIds, id]
        }));
    };

    // Обработка данных
    const filteredAndSortedDrivers = useMemo(() => {
        let result = [...drivers];

        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(d =>
                d.username?.toLowerCase().includes(lowSearch) ||
                d.truck?.plateNumber?.toLowerCase().includes(lowSearch)
            );
        }

        result.sort((a, b) => {
            let valA = a[sortBy] || '';
            let valB = b[sortBy] || '';

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [drivers, searchTerm, sortBy, sortOrder]);

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 font-sans antialiased">
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
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Водители</h1>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Управление персоналом и маршрутами</p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Новый водитель
                </button>
            </header>

            {/* Filters */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        placeholder="ПОИСК ПО ИМЕНИ ИЛИ НОМЕРУ МАШИНЫ..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/30 transition-all text-white placeholder:text-zinc-700"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleSort('username')}
                        className={`px-6 py-3 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${sortBy === 'username' ? 'bg-emerald-500 text-emerald-950 border-emerald-500' : 'bg-zinc-900/50 text-zinc-500 hover:text-white'}`}
                    >
                        <ArrowUpDown className="w-3 h-3" /> Сортировка А-Я
                    </button>
                </div>
            </div>

            {/* Drivers Grid */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <CardSkeleton />
                            </motion.div>
                        ))
                    ) : filteredAndSortedDrivers.map((driver) => (
                        <motion.div
                            key={driver.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass p-6 rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(driver)}
                                        className="p-2.5 bg-zinc-800 rounded-xl hover:bg-zinc-700 text-zinc-500 hover:text-white transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(driver.id)}
                                        className="p-2.5 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-black uppercase tracking-tight mb-1">{driver.username}</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">Staff Level: Driver</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <TruckIcon className="w-4 h-4 text-zinc-500" />
                                    <div>
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Машина</p>
                                        <p className="text-[11px] font-bold text-emerald-500 uppercase">{driver.truck?.plateNumber || 'Не назначена'}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {driver.zones && driver.zones.length > 0 ? (
                                        driver.zones.map((zone: any) => (
                                            <div key={zone.id} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.color }} />
                                                <span className="text-[8px] font-black uppercase tracking-tight text-zinc-400">{zone.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest pl-1 italic">Зоны не привязаны</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredAndSortedDrivers.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em]">Водители не найдены</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
                                {editingDriverId ? 'Редактирование водителя' : 'Регистрация нового водителя'}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Логин</label>
                                        <input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold tracking-widest focus:border-emerald-500/50 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Пароль {editingDriverId && '(оставьте пустым чтобы не менять)'}</label>
                                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold tracking-widest focus:border-emerald-500/50 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Машина</label>
                                        <select value={formData.truckId} onChange={e => setFormData({ ...formData, truckId: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold tracking-widest focus:border-emerald-500/50 outline-none transition-all appearance-none text-emerald-500">
                                            <option value="">Не назначена</option>
                                            {trucks.map(t => <option key={t.id} value={t.id}>{t.plateNumber}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Зоны (только для новых маршрутов)</label>
                                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-64 pr-2 no-scrollbar">
                                        {zones.map(z => (
                                            <div key={z.id} onClick={() => toggleZone(z.id)} className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${formData.zoneIds.includes(z.id) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/30 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                                                    <span className="text-[10px] font-black uppercase">{z.name}</span>
                                                </div>
                                                {formData.zoneIds.includes(z.id) && <Plus className="w-3 h-3 text-emerald-500 rotate-45" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-full flex gap-4 mt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Отмена</button>
                                    <button type="submit" className="flex-1 bg-emerald-500 text-emerald-950 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                        {editingDriverId ? 'Сохранить изменения' : 'Создать водителя'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


