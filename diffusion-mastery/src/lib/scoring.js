export function calculateScore(moduleData, userAnswers) {
    let sectionAScore = 0;
    let sectionBScore = 0;
    const sectionADetails = [];
    const sectionBDetails = [];

    const sectionA = moduleData.sections.find((s) => s.section_id === 'A');
    const sectionB = moduleData.sections.find((s) => s.section_id === 'B');

    // Section A: MCQs
    if (sectionA) {
        sectionA.questions.forEach((q) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correct_option;
            if (isCorrect) {
                sectionAScore += sectionA.marking_scheme.correct;
            } else if (userAnswer) {
                sectionAScore += sectionA.marking_scheme.incorrect;
            }
            sectionADetails.push({
                questionId: q.id,
                userAnswer,
                correctAnswer: q.correct_option,
                isCorrect,
                explanation: q.explanation,
            });
        });
    }

    // Section B: Logic Puzzles
    if (sectionB) {
        sectionB.questions.forEach((q) => {
            const userAnswer = userAnswers[q.id];
            let isCorrect = false;

            if (q.type === 'parsons_problem') {
                // Check if order matches
                // userAnswer should be an array of block IDs
                if (Array.isArray(userAnswer) && Array.isArray(q.correct_order)) {
                    isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correct_order);
                }
            } else if (q.type === 'fill_in_blank') {
                // Simple string matching, maybe case insensitive
                if (userAnswer && typeof userAnswer === 'string') {
                    isCorrect = userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
                }
            }

            if (isCorrect) {
                sectionBScore += sectionB.marking_scheme.correct;
            } else if (userAnswer) {
                sectionBScore += sectionB.marking_scheme.incorrect;
            }

            sectionBDetails.push({
                questionId: q.id,
                userAnswer,
                correctAnswer: q.type === 'parsons_problem' ? q.correct_order : q.correct_answer,
                isCorrect,
                explanation: q.explanation
            });
        });
    }

    return {
        sectionAScore,
        sectionBScore,
        totalScore: sectionAScore + sectionBScore,
        sectionADetails,
        sectionBDetails,
    };
}
