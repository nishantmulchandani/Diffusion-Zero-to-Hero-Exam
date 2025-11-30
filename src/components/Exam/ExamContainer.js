'use client';

import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import MCQQuestion from './MCQQuestion';
import ParsonsProblem from './ParsonsProblem';
import TheoryQuestion from './TheoryQuestion';
import FillInBlankQuestion from './FillInBlankQuestion';
import PerformanceReport from '../Dashboard/PerformanceReport';
import { calculateScore } from '../../lib/scoring';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ChevronRight, CheckCircle2 } from 'lucide-react';
import GrokExplainer from '../GrokExplainer';

export default function ExamContainer({ moduleData }) {
    const { startExam, examStatus, submitExam, answers } = useExam();
    const [activeSection, setActiveSection] = useState('A');
    const [reportData, setReportData] = useState(null);
    const [isGrading, setIsGrading] = useState(false);

    useEffect(() => {
        if (moduleData) {
            startExam(moduleData.module_name);
        }
    }, [moduleData]);

    const handleSubmit = async () => {
        if (confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
            submitExam();
            setIsGrading(true);

            const localResults = calculateScore(moduleData, answers);

            setTimeout(() => {
                setReportData(localResults);
                setIsGrading(false);
            }, 2000);
        }
    };

    if (examStatus === 'submitted') {
        if (isGrading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full mb-8"
                    />
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        AI Examiner is Grading...
                    </h2>
                    <p className="text-zinc-500 mt-2">Analyzing logic puzzles and theory responses.</p>
                </div>
            );
        }

        if (reportData) {
            return <PerformanceReport moduleData={moduleData} reportData={reportData} />;
        }
    }

    if (!moduleData) return <div className="text-white p-8">Loading...</div>;

    const currentSectionData = moduleData.sections.find(s => s.section_id === activeSection);

    // Calculate Progress
    const totalQuestions = moduleData.sections.reduce((acc, s) => acc + s.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    return (
        <div className="min-h-screen bg-[#030014] text-white pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-zinc-100">{moduleData.module_name}</h1>
                        <div className="flex items-center text-xs text-zinc-400 mt-1">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 mr-2">{moduleData.difficulty_level}</span>
                            <span>Section {activeSection}: {currentSectionData?.section_title}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Progress</div>
                            <div className="text-sm font-mono text-blue-400">{Math.round(progress)}%</div>
                        </div>
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Section Tabs */}
                <div className="flex space-x-2 mb-12 p-1 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
                    {moduleData.sections.map(section => (
                        <button
                            key={section.section_id}
                            onClick={() => setActiveSection(section.section_id)}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                                activeSection === section.section_id
                                    ? "text-white shadow-lg"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            )}
                        >
                            {activeSection === section.section_id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 text-xs">
                                    {section.section_id}
                                </span>
                                {section.section_title}
                            </span>
                        </button>
                    ))}
                </div>



                {/* Questions */}
                <GrokExplainer>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {currentSectionData?.questions.map((question, index) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {(() => {
                                        switch (question.type) {
                                            case 'mcq':
                                                return <MCQQuestion question={question} />;
                                            case 'parsons_problem':
                                                return <ParsonsProblem question={question} />;
                                            case 'fill_in_blank':
                                                return <FillInBlankQuestion question={question} />;
                                            case 'theory_open_ended':
                                                return <TheoryQuestion question={question} />;
                                            default:
                                                return <div>Unknown type</div>;
                                        }
                                    })()}
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </GrokExplainer>

                {/* Footer */}
                <div className="mt-16 flex justify-end border-t border-white/10 pt-8">
                    <button
                        onClick={handleSubmit}
                        className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative flex items-center">
                            Submit Module <CheckCircle2 className="ml-2 w-5 h-5" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
