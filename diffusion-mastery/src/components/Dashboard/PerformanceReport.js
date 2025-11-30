'use client';

import React from 'react';
import MathRenderer from '../MathRenderer';
import clsx from 'clsx';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PerformanceReport({ moduleData, reportData }) {
    const { sectionAScore, sectionBScore, totalScore, sectionADetails, sectionBDetails } = reportData;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Performance Report</h1>
                <p className="text-zinc-500 dark:text-zinc-400">{moduleData.module_name}</p>

                <div className="mt-8 inline-block bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                    <div className="text-sm text-zinc-500 uppercase tracking-wide mb-1">Total Score</div>
                    <div className="text-5xl font-black text-blue-600 dark:text-blue-400">{totalScore.toFixed(1)}</div>
                    <div className="mt-4 grid grid-cols-2 gap-8 text-left">
                        <div>
                            <div className="text-xs text-zinc-400">Section A</div>
                            <div className="font-semibold text-zinc-700 dark:text-zinc-300">{sectionAScore.toFixed(1)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-zinc-400">Section B</div>
                            <div className="font-semibold text-zinc-700 dark:text-zinc-300">{sectionBScore.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {/* Section A Review */}
                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-3">SECTION A</span>
                        Conceptual Recall
                    </h2>
                    <div className="space-y-4">
                        {sectionADetails.map((item) => (
                            <div key={item.questionId} className={clsx(
                                "p-4 rounded-lg border",
                                item.isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                            )}>
                                <div className="flex items-start">
                                    <div className="mt-1 mr-3 flex-shrink-0">
                                        {item.isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                                            Q{item.questionId.replace('q', '')}
                                        </div>
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                            Your Answer: <span className="font-semibold">{item.userAnswer || 'Skipped'}</span>
                                            {!item.isCorrect && <span className="ml-4">Correct: <span className="font-semibold">{item.correctAnswer}</span></span>}
                                        </div>
                                        <div className="text-sm text-zinc-500 italic border-l-2 border-zinc-300 pl-3">
                                            <MathRenderer text={item.explanation} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section B Review */}
                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded mr-3">SECTION B</span>
                        Logic Puzzles
                    </h2>
                    <div className="space-y-4">
                        {sectionBDetails.map((item) => (
                            <div key={item.questionId} className={clsx(
                                "p-4 rounded-lg border",
                                item.isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                            )}>
                                <div className="flex items-start">
                                    <div className="mt-1 mr-3 flex-shrink-0">
                                        {item.isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                                            Q{item.questionId.replace('q', '')}
                                        </div>
                                        <div className="text-sm text-zinc-500 italic border-l-2 border-zinc-300 pl-3">
                                            <MathRenderer text={item.explanation} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section C Placeholder */}
                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded mr-3">SECTION C</span>
                        Deep Theory (AI Graded)
                    </h2>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                        <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">AI Grading Pending</h3>
                        <p className="text-zinc-500">Section C responses are being analyzed by the AI Examiner. Results will be emailed to you.</p>
                    </div>
                </section>
            </div>

            <div className="mt-12 text-center">
                <a href="/" className="text-blue-600 hover:underline">Back to Dashboard</a>
            </div>
        </div>
    );
}
