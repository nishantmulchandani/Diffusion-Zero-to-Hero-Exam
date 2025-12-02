'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePageContent({ modules }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[url('/grid.svg')] bg-fixed">
            <main className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 mr-2" /> AI-Native Examination Platform
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter mb-6">
                            <span className="text-white">WAN Architecture</span>
                            <span className="text-gradient ml-4">& LoRA Engineering</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            The gold standard for Video Model Engineering. <br />
                            Master the mathematics and implementation of WAN-2.1, Flow Matching, and Temporal LoRA.
                        </p>
                    </motion.div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {modules.map((module) => (
                        <motion.div key={module.id} variants={item}>
                            <Link
                                href={`/exam/${module.id}`}
                                className="glass-card group relative block p-8 rounded-3xl h-full"
                            >
                                <div className="absolute top-6 right-6">
                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-colors">
                                        {module.difficulty}
                                    </span>
                                </div>

                                <div className="mb-8 w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                                    <Cpu className="w-7 h-7 text-blue-400" />
                                </div>

                                <h2 className="text-2xl font-bold mb-3 text-zinc-100 group-hover:text-blue-400 transition-colors break-words hyphens-auto">
                                    {module.title}
                                </h2>
                                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                    Master the core concepts and implementation details through rigorous testing.
                                </p>

                                <div className="flex items-center text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                                    Start Module <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Research Paper Lab Card */}
                    <motion.div variants={item}>
                        <Link
                            href="/research-lab"
                            className="glass-card group relative block p-8 rounded-3xl h-full border-purple-500/30 hover:border-purple-500/50"
                            style={{ background: 'linear-gradient(145deg, rgba(147, 51, 234, 0.05) 0%, rgba(0,0,0,0) 100%)' }}
                        >
                            <div className="mb-8 w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                                <Code className="w-7 h-7 text-purple-400" />
                            </div>

                            <h2 className="text-2xl font-bold mb-3 text-zinc-100 group-hover:text-purple-400 transition-colors">
                                Research Paper Lab
                            </h2>
                            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                Implement papers from scratch. Upload code for static analysis by our AI Examiner.
                            </p>

                            <div className="flex items-center text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors">
                                Enter Lab <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
