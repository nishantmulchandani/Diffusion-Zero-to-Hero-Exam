import React from 'react';
import ExamContainer from '@/components/Exam/ExamContainer';
import { getModuleData, getAllModuleIds } from '@/lib/data';
import { ExamProvider } from '@/context/ExamContext';

// Generate static params for all modules
export async function generateStaticParams() {
    return getAllModuleIds();
}

export default async function ExamPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
    const moduleData = getModuleData(moduleId);

    if (!moduleData) {
        return <div>Module not found</div>;
    }

    return (
        <ExamProvider>
            <ExamContainer moduleData={moduleData} />
        </ExamProvider>
    );
}
