'use client';

import React from 'react';
import MathRenderer from '../MathRenderer';
import { useExam } from '../../context/ExamContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function MCQQuestion({ question }) {
    const { answers, setAnswer } = useExam();
    const selectedOption = answers[question.id];

    return (
        <div className="glass-card p-8 rounded-2xl mb-8">
            <h3 className="text-lg font-medium mb-6 text-zinc-100 leading-relaxed">
                <span className="mr-3 text-blue-400 font-bold">Q{question.id.replace('q', '')}.</span>
                <MathRenderer text={question.question_text} />
            </h3>

            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const optionLetter = option.charAt(0);
                    const isSelected = selectedOption === optionLetter;

                    return (
                        <motion.label
                            key={index}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className={clsx(
                                "flex items-center p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden group",
                                isSelected
                                    ? "bg-blue-500/10 border-blue-500/50"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className={clsx(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors",
                                isSelected ? "border-blue-400" : "border-zinc-600 group-hover:border-zinc-400"
                            )}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />}
                            </div>

                            <input
                                type="radio"
                                name={question.id}
                                value={optionLetter}
                                checked={isSelected}
                                onChange={() => setAnswer(question.id, optionLetter)}
                                className="hidden"
                            />
                            <span className={clsx("text-sm transition-colors", isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")}>
                                <MathRenderer text={option} />
                            </span>

                            {isSelected && (
                                <motion.div
                                    layoutId={`glow-${question.id}`}
                                    className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </motion.label>
                    );
                })}
            </div>
        </div>
    );
}
