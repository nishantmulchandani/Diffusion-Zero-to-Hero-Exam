import React from 'react';
import { getAllModulesList } from '@/lib/data';
import HomePageContent from '@/components/HomePageContent';

export default function Home() {
    const modules = getAllModulesList();

    return <HomePageContent modules={modules} />;
}
