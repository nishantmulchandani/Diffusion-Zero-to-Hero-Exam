'use client';

import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, Download, Scan, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ResearchLabPage() {
    const [file, setFile] = useState<File | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
    const [result, setResult] = useState<{ pass: boolean; feedback: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisStatus('idle');
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setAnalysisStatus('analyzing');

        // Simulate reading file and sending to API
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const textContent = e.target?.result;
            console.log("File content:", textContent); // In real app, send this to API

            // Simulate API delay
            setTimeout(() => {
                setAnalysisStatus('complete');
                // Mock result
                setResult({
                    pass: Math.random() > 0.3, // Random pass/fail for demo
                    feedback: "The implementation of the ZeroConvolution class looks correct. However, ensure that the weights are initialized to zero to preserve the original model behavior during the initial training steps."
                });
            }, 3000);
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-[#030014] text-white p-8 bg-[url('/grid.svg')]">
            <div className="max-w-5xl mx-auto">
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium mb-6 backdrop-blur-sm">
                            <Terminal className="w-3 h-3 mr-2" /> Research Environment
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">
                            Research Paper <span className="text-gradient-purple">Lab</span>
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            Implement state-of-the-art diffusion papers. Upload your code for static analysis by our AI Examiner.
                        </p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Download Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-3xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                            <Download className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">1. Download Starter Kit</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Get the boilerplate code for the "ControlNet" implementation challenge. Includes model definitions and dummy data loaders.
                        </p>
                        <button className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center group-hover:border-blue-500/30">
                            <FileCode className="w-5 h-5 mr-3 text-blue-400" />
                            <span>Download controlnet_starter.zip</span>
                        </button>
                    </motion.div>

                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2" />

                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400">
                            <Upload className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">2. Submit Implementation</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Upload your modified <code>model.py</code> file. Our AI Examiner will check your logic without executing the code.
                        </p>

                        <div className="relative group">
                            <div className={clsx(
                                "border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 relative overflow-hidden",
                                file
                                    ? "border-purple-500 bg-purple-500/5"
                                    : "border-zinc-700 hover:border-purple-500 hover:bg-white/5"
                            )}>
                                <input
                                    type="file"
                                    accept=".py"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <AnimatePresence mode="wait">
                                    {file ? (
                                        <motion.div
                                            key="file-selected"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex flex-col items-center justify-center text-zinc-200"
                                        >
                                            <FileCode className="w-10 h-10 mb-3 text-purple-400" />
                                            <span className="font-mono text-sm bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-zinc-500 mt-2">Click to change file</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="no-file"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                                            </div>
                                            <span className="text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                                                Drop .py file here
                                            </span>
                                            <span className="text-zinc-600 text-sm mt-1">or click to browse</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <AnimatePresence>
                            {file && analysisStatus === 'idle' && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={handleUpload}
                                    className="mt-6 w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all"
                                >
                                    Analyze Code
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {analysisStatus === 'analyzing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-center p-6 bg-black/20 rounded-xl border border-white/5"
                            >
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-t-2 border-purple-500 rounded-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Scan className="w-6 h-6 text-purple-400" />
                                    </div>
                                </div>
                                <p className="text-sm font-mono text-purple-300 animate-pulse">
                                    AI Examiner is reading your code...
                                </p>
                            </motion.div>
                        )}

                        {analysisStatus === 'complete' && result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx(
                                    "mt-8 p-6 rounded-xl border backdrop-blur-md",
                                    result.pass
                                        ? "bg-green-500/10 border-green-500/20"
                                        : "bg-red-500/10 border-red-500/20"
                                )}
                            >
                                <div className="flex items-start">
                                    {result.pass ? (
                                        <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-0.5" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-0.5" />
                                    )}
                                    <div>
                                        <h3 className={clsx(
                                            "font-bold text-lg mb-1",
                                            result.pass ? "text-green-400" : "text-red-400"
                                        )}>
                                            {result.pass ? 'Pass' : 'Needs Improvement'}
                                        </h3>
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            {result.feedback}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                <div className="mt-16 text-center">
                    <a href="/" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">← Back to Dashboard</a>
                </div>
            </div>
        </div>
    );
}
