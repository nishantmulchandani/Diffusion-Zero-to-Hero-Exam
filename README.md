# Diffusion Mastery: Zero to Hero Exam Platform

**Diffusion Mastery** is an advanced, AI-native examination platform designed specifically for Deep Learning Engineers to master the mathematics and implementation of Diffusion Models. This project aims to provide a rigorous testing environment suitable for PhD candidates and researchers.

## 🚀 Features

- **Comprehensive Curriculum**: Covers advanced topics like Video Diffusion, Debugging, Robustness, and Evaluation Metrics.
- **Interactive Exam Modules**:
  - **Multiple Choice Questions**: Test your theoretical understanding.
  - **Parsons Problems**: Drag-and-drop interface to reconstruct code logic for diffusion algorithms.
  - **Theory Questions**: Deep-dive questions graded by an AI Examiner (Grok API) using strict rubrics.
- **Research Paper Lab**: A dedicated space to implement research papers from scratch and get static analysis feedback.
- **High-Fidelity Math Rendering**: Uses `KaTeX` to render complex LaTeX formulas ($q(x_t | x_0)$, $\sqrt{1 - \beta_t}$, etc.) seamlessly.
- **Modern UI/UX**: Built with Next.js, Tailwind CSS, and Framer Motion for a smooth, "glassmorphism" aesthetic.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Math Rendering**: [KaTeX](https://katex.org/) / `react-katex`
- **Drag & Drop**: [`@dnd-kit`](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
Diffusion-Zero-to-Hero-Exam/
├── diffusion-mastery/       # Main Next.js Web Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components (Exam, MathRenderer, etc.)
│   │   └── lib/            # Utilities (scoring, data handling)
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
└── tests/                   # Exam Content & Data
    ├── *.json              # Exam modules (questions, rubrics, correct answers)
    └── developer-note.txt  # Technical implementation details
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nishantmulchandani/Diffusion-Zero-to-Hero-Exam.git
   cd Diffusion-Zero-to-Hero-Exam
   ```

2. **Navigate to the web app directory:**
   ```bash
   cd diffusion-mastery
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## 🧪 Exam Content Format

The exam content is stored in JSON files within the `tests/` directory. Each module includes:
- **MCQs**: Standard multiple-choice questions.
- **Logic Puzzles**: Scenarios requiring deep reasoning.
- **Parsons Problems**: `scrambled_code_blocks` that need to be ordered correctly.
- **Theory**: Open-ended questions with an `ai_grading_rubric` for automated evaluation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
