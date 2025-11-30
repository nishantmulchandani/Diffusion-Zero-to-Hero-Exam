import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, context } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const apiKey = process.env.GROK_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: 'Configuration Error',
                details: 'GROK_API_KEY is missing in environment variables. Please add it to .env.local.'
            }, { status: 500 });
        }

        const systemPrompt = `You are an expert Deep Learning Professor specializing in Diffusion Models. 
    Explain the selected text clearly and rigorously. 
    If the text is a mathematical term, explain the formula and intuition.
    If it's a code snippet, explain what it does.
    Keep the explanation concise (under 150 words) but insightful.`;

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Explain this context from a Diffusion Model exam: "${text}"` }
                ],
                model: 'grok-beta', // Or appropriate model version
                stream: false,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Grok API Error', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        const explanation = data.choices[0].message.content;

        return NextResponse.json({ explanation });

    } catch (error) {
        console.error('Explanation API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
