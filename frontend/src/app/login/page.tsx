'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'admin') {
                router.push('/');
            } else {
                router.push('/driver');
            }
        } catch (err: any) {
            setError('Неверный логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full glass p-10 rounded-[2.5rem] relative z-10 mx-4"
            >
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20"
                    >
                        <Truck className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Tazaayl</h1>
                    <div className="flex items-center gap-2 text-emerald-400/60 font-semibold uppercase tracking-[0.2em] text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Access</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Логин</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Manager ID"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 transition-all focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/5 input-glow"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Пароль</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 transition-all focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/5 input-glow"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-rose-400 text-sm font-bold text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] disabled:opacity-50 mt-4 group"
                    >
                        {loading ? 'ПРОВЕРКА...' : 'ВОЙТИ В СИСТЕМУ'}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="h-px w-12 bg-white/10" />
                    <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                        © 2026 Tazaayl Monitoring
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
