'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Simple regex to detect math tokens. 
// This is a heuristic. The requirement says "detect these tokens".
// We might need a more robust parser if the tokens are not standard LaTeX delimiters.
// The example says "alpha_bar_t", "sigma^2". These look like they might need manual replacement or regex to wrap in $...$.
// However, standard LaTeX usually uses $...$ or \(...\).
// If the JSON has raw text like "alpha_bar_t" without delimiters, we need to guess.
// BUT, the prompt says "The JSON content contains raw text representation of math... Implement KaTeX... to detect these tokens".
// This implies we should look for specific patterns or just assume anything that looks like math is math.
// A safer bet for now is to render the text, and if we see specific known variables, wrap them.
// OR, maybe the JSON *does* have delimiters?
// Looking at the JSON file content: "alpha_bar_t", "sqrt(beta(t))", "sigma^2". No delimiters.
// So I need to replace these with LaTeX equivalents.

const MATH_REPLACEMENTS = [
    { pattern: /alpha_bar_t/g, replacement: '\\bar{\\alpha}_t' },
    { pattern: /alpha_bar_\{t-1\}/g, replacement: '\\bar{\\alpha}_{t-1}' },
    { pattern: /alpha_bar/g, replacement: '\\bar{\\alpha}' },
    { pattern: /beta_t/g, replacement: '\\beta_t' },
    { pattern: /beta_tilde_t/g, replacement: '\\tilde{\\beta}_t' },
    { pattern: /sigma\^2/g, replacement: '\\sigma^2' },
    { pattern: /sigma_t/g, replacement: '\\sigma_t' },
    { pattern: /mu/g, replacement: '\\mu' },
    { pattern: /lambda/g, replacement: '\\lambda' },
    { pattern: /epsilon/g, replacement: '\\epsilon' },
    { pattern: /eps_theta/g, replacement: '\\epsilon_\\theta' },
    { pattern: /eps/g, replacement: '\\epsilon' },
    { pattern: /x_t/g, replacement: 'x_t' },
    { pattern: /x_0/g, replacement: 'x_0' },
    { pattern: /x_\{t-1\}/g, replacement: 'x_{t-1}' },
    { pattern: /x_T/g, replacement: 'x_T' },
    { pattern: /q\(x_t \| x_0\)/g, replacement: 'q(x_t | x_0)' },
    { pattern: /sqrt\(beta\(t\)\)/g, replacement: '\\sqrt{\\beta(t)}' },
    { pattern: /alpha_prev/g, replacement: '\\bar{\\alpha}_{t-1}' },
    { pattern: /sqrt_one_minus_alpha_bar/g, replacement: '\\sqrt{1 - \\bar{\alpha}_t}' },
    { pattern: /log_snr/g, replacement: '\\log \\text{SNR}' },
    // Add more as needed based on the content
];

// Helper to wrap math in delimiters if we want to use a parser, 
// or just render specific parts as Math.
// Since we are using react-katex, we can split the string.

export default function MathRenderer({ text }) {
    if (!text) return null;

    // 1. Perform replacements to convert "alpha_bar_t" -> "\bar{\alpha}_t"
    let processedText = text;
    MATH_REPLACEMENTS.forEach(({ pattern, replacement }) => {
        processedText = processedText.replace(pattern, `$${replacement}$`);
    });

    // 2. Now split by $...$ to render
    const parts = processedText.split(/(\$.*?\$)/);

    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const mathContent = part.slice(1, -1);
                    return <InlineMath key={index} math={mathContent} />;
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
}
