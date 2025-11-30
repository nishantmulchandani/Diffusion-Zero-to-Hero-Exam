'use client';

import React from 'react';
import MathRenderer from '../MathRenderer';
import { useExam } from '../../context/ExamContext';

export default function TheoryQuestion({ question }) {
    const { answers, setAnswer } = useExam();
    const answer = answers[question.id] || '';

    return (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                <span className="mr-2 text-purple-600 dark:text-purple-400">Q{question.id.replace('q', '')}.</span>
                <MathRenderer text={question.question_text} />
            </h3>

            <textarea
                value={answer}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                placeholder="Type your explanation or code here..."
                className="w-full h-48 p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono text-sm"
            />
            <p className="mt-2 text-xs text-zinc-500">
                This answer will be graded by AI based on a strict rubric.
            </p>
        </div>
    );
}
