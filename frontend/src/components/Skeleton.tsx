'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="space-y-4 w-full">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-8 py-6 border-b border-white/[0.02]">
                    <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-2 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24 hidden md:block" />
                    <Skeleton className="h-4 w-24 hidden md:block" />
                    <div className="flex gap-2">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-6">
            <div className="flex items-start justify-between">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="flex gap-2">
                    <Skeleton className="w-9 h-9 rounded-xl" />
                    <Skeleton className="w-9 h-9 rounded-xl" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="glass p-5 rounded-2xl border border-white/5 space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-8 w-12" />
        </div>
    );
}
