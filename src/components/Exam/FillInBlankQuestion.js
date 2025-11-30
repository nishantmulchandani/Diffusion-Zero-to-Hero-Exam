'use client';

import React from 'react';
import MathRenderer from '../MathRenderer';
import { useExam } from '../../context/ExamContext';

export default function FillInBlankQuestion({ question }) {
    const { answers, setAnswer } = useExam();
    const answer = answers[question.id] || '';

    return (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                <span className="mr-2 text-green-600 dark:text-green-400">Q{question.id.replace('q', '')}.</span>
                <MathRenderer text={question.question_text} />
            </h3>

            <div className="flex items-center">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 max-w-md p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
            </div>
        </div>
    );
}
