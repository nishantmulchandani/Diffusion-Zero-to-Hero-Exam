'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

export function ExamProvider({ children }) {
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [examStatus, setExamStatus] = useState('idle'); // idle, in_progress, submitted
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const startExam = React.useCallback((moduleId) => {
        setCurrentModuleId(moduleId);
        setAnswers({});
        setExamStatus('in_progress');
        setStartTime(Date.now());
        setEndTime(null);
    }, []);

    const submitExam = React.useCallback(() => {
        setExamStatus('submitted');
        setEndTime(Date.now());
    }, []);

    const setAnswer = React.useCallback((questionId, answer) => {
        setAnswers((prev) => {
            // Optimization: Don't update if value hasn't changed
            if (JSON.stringify(prev[questionId]) === JSON.stringify(answer)) {
                return prev;
            }
            return {
                ...prev,
                [questionId]: answer,
            };
        });
    }, []);

    return (
        <ExamContext.Provider
            value={{
                currentModuleId,
                answers,
                examStatus,
                startTime,
                endTime,
                startExam,
                submitExam,
                setAnswer,
            }}
        >
            {children}
        </ExamContext.Provider>
    );
}

export function useExam() {
    return useContext(ExamContext);
}
