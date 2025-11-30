'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, BookOpen, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function GrokExplainer({ children }) {
    const [selection, setSelection] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleSelection = () => {
            const activeSelection = window.getSelection();
            if (!activeSelection || activeSelection.isCollapsed || !activeSelection.toString().trim()) {
                setSelection(null);
                return;
            }

            // Check if selection is inside our container
            if (containerRef.current && !containerRef.current.contains(activeSelection.anchorNode)) {
                setSelection(null);
                return;
            }

            const range = activeSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Calculate position relative to viewport, but we'll use fixed positioning for the button
            setButtonPos({
                x: rect.left + (rect.width / 2),
                y: rect.top - 10 // Slightly above the selection
            });
            setSelection(activeSelection.toString());
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection); // For keyboard selection

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
        };
    }, []);

    const handleExplain = async () => {
        if (!selection) return;

        setIsLoading(true);
        setShowModal(true);
        setExplanation(null);

        try {
            const res = await fetch('/api/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: selection })
            });

            const data = await res.json();

            if (data.error) {
                setExplanation(`Error: ${data.details || data.error}`);
            } else {
                setExplanation(data.explanation);
            }
        } catch (err) {
            setExplanation("Failed to connect to Grok AI. Please check your network.");
        } finally {
            setIsLoading(false);
            // Clear selection after asking
            window.getSelection()?.removeAllRanges();
            setSelection(null);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {children}

            {/* Floating Explain Button */}
            <AnimatePresence>
                {selection && !showModal && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        style={{
                            position: 'fixed',
                            left: buttonPos.x,
                            top: buttonPos.y,
                            transform: 'translate(-50%, -100%)',
                            zIndex: 50
                        }}
                        onClick={handleExplain}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full shadow-xl border border-zinc-700 hover:bg-black hover:border-blue-500 transition-colors group"
                    >
                        <Sparkles className="w-4 h-4 text-blue-400 group-hover:animate-pulse" />
                        <span className="text-sm font-medium">Grok Explain</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Explanation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="font-bold text-zinc-100">Grok AI Explanation</span>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                                        <p className="text-zinc-400 text-sm animate-pulse">Consulting the neural network...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="text-zinc-300 leading-relaxed">
                                            {explanation}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
