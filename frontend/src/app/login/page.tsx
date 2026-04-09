'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, X, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
            {/* Background elements for depth */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* Glow behind the card */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative glow in the bottom-left corner */}
                    <div className="absolute -bottom-5 -left[-30px] w-42 h-42 bg-emerald-500/25 blur-[80px] rounded-full pointer-events-none" />

                    {/* Header Area */}
                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-xl font-black text-white tracking-tight leading-tight mb-2 uppercase">Sign In to Tazaayl</h1>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Fleet Infrastructure Control</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter Username"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 px-6 text-[12px] font-bold text-white placeholder:text-zinc-600 transition-all focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.05]"
                                    required
                                />
                                {username && (
                                    <button
                                        type="button"
                                        onClick={() => setUsername('')}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 px-6 text-[12px] font-bold text-white placeholder:text-zinc-600 transition-all focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.05]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center py-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="relative group pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-2xl flex items-center justify-center transition-all transform active:scale-[0.98] shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] disabled:opacity-50 relative z-10 text-[11px] uppercase tracking-[0.2em]"
                            >
                                {loading ? 'Processing...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-white/5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">End-to-End Encryption</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer Footer */}
            <div className="fixed bottom-8 text-center w-full">
                <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.4em]">
                    © 2026 Tazaayl Systems • Monitoring & Control
                </p>
            </div>
        </div>
    );
}


