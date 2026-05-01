'use client';

import { useState, useCallback } from 'react';
import questions from '@/data/trainingQuestions.json';
import { TrainingQuestion } from '@/types';

const allQuestions = questions as TrainingQuestion[];

const typeLabels: Record<string, string> = {
  guess_grape: '🍇 Gissa druvan',
  guess_style: '🗺️ Gissa stilen',
  distinguish: '🔍 Skilj dem åt',
  match_aroma: '🌸 Para ihop arom',
};

const categories = [
  { id: 'all', label: 'Alla', emoji: '🎯' },
  { id: 'white', label: 'Vita druvor', emoji: '🥂' },
  { id: 'red', label: 'Röda druvor', emoji: '🍷' },
  { id: 'sparkling', label: 'Mousserande', emoji: '🍾' },
  { id: 'style', label: 'Stilar & regioner', emoji: '🗺️' },
];

const difficulties = [
  { id: 'all', label: 'Alla nivåer', emoji: '🎓' },
  { id: 'beginner', label: 'Nybörjare', emoji: '🟢' },
  { id: 'intermediate', label: 'Medel', emoji: '🟡' },
  { id: 'advanced', label: 'Avancerad', emoji: '🔴' },
];

export default function TranaPage() {
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shuffled, setShuffled] = useState<TrainingQuestion[]>([]);

  const startQuiz = () => {
    const filtered = allQuestions.filter((q) => {
      const catMatch = category === 'all' || q.category === category;
      const diffMatch = difficulty === 'all' || q.difficulty === difficulty;
      return catMatch && diffMatch;
    });
    const randomized = [...filtered].sort(() => Math.random() - 0.5);
    setShuffled(randomized);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStarted(true);
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
  };

  const question = shuffled[current];

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === question.correctAnswer) setScore((s) => s + 1);
  };

  const handleNext = useCallback(() => {
    if (current + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }, [current, shuffled.length]);

  if (!started) {
    const filteredCount = allQuestions.filter((q) => {
      const catMatch = category === 'all' || q.category === category;
      const diffMatch = difficulty === 'all' || q.difficulty === difficulty;
      return catMatch && diffMatch;
    }).length;

    return (
      <div className="px-4 py-8 max-w-xl mx-auto">
        <h1 className="font-display text-4xl text-wine-100 mb-2">Träna</h1>
        <p className="text-wine-300 mb-8 leading-relaxed">
          Välj kategori och svårighetsgrad, sedan kör vi!
        </p>

        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Kategori</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  category === cat.id
                    ? 'bg-wine-600 border-wine-600 text-white'
                    : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-wine-500 mb-3">Svårighetsgrad</h2>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  difficulty === diff.id
                    ? 'bg-wine-600 border-wine-600 text-white'
                    : 'bg-wine-900 border-wine-700 text-wine-400 hover:border-wine-500'
                }`}
              >
                {diff.emoji} {diff.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCount === 0 ? (
          <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 text-wine-400 text-sm text-center mb-4">
            Inga frågor matchar den kombinationen. Prova en annan!
          </div>
        ) : (
          <div className="bg-wine-900 rounded-2xl p-4 border border-wine-800 text-wine-300 text-sm mb-6">
            {filteredCount} frågor matchar ditt val.
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={filteredCount === 0}
          className="w-full py-4 bg-wine-600 hover:bg-wine-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-display text-xl rounded-2xl transition-colors"
        >
          Starta träning →
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div className="px-4 py-16 max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : '🎓'}</div>
        <h2 className="font-display text-4xl text-wine-100 mb-3">Klart!</h2>
        <p className="text-wine-300 text-lg mb-2">
          Du fick {score} av {shuffled.length} rätt.
        </p>
        <p className="text-wine-400 text-sm mb-8">
          {pct >= 80 ? 'Utmärkt! Din blindprovning sitter.' : pct >= 60 ? 'Bra jobbat – fortsätt träna.' : 'Bra start – prova igen och se om det sitter bättre.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-wine-600 hover:bg-wine-500 text-white font-medium rounded-xl transition-colors"
          >
            Träna igen
          </button>
          <button
            onClick={restart}
            className="px-6 py-3 bg-wine-900 hover:bg-wine-800 border border-wine-700 text-wine-300 font-medium rounded-xl transition-colors"
          >
            Byt kategori
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selected === question?.correctAnswer;

  return (
    <div className="px-4 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={restart} className="text-wine-500 text-sm hover:text-wine-300">
          ← Byt kategori
        </button>
        <div className="text-sm text-wine-400">
          {current + 1} / {shuffled.length}
        </div>
      </div>

      <div className="h-1.5 bg-wine-900 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-wine-600 rounded-full transition-all duration-300"
          style={{ width: `${(current / shuffled.length) * 100}%` }}
        />
      </div>

      <div className="flex gap-2 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-wine-900 border border-wine-700 text-wine-400">
          {typeLabels[question.type] || question.type}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
          question.difficulty === 'beginner' ? 'bg-green-900/30 border-green-700/50 text-green-400' :
          question.difficulty === 'intermediate' ? 'bg-amber-900/30 border-amber-700/50 text-amber-400' :
          'bg-red-900/30 border-red-700/50 text-red-400'
        }`}>
          {question.difficulty === 'beginner' ? '🟢 Nybörjare' : question.difficulty === 'intermediate' ? '🟡 Medel' : '🔴 Avancerad'}
        </span>
      </div>

      <div className="bg-wine-900 rounded-2xl p-5 border border-wine-800 mb-6">
        <p className="text-wine-100 leading-relaxed">{question.question}</p>
      </div>

      <ul className="space-y-2 mb-6">
        {question.options.map((option) => {
          const isSelected = option === selected;
          const isCorrectOption = option === question.correctAnswer;
          let className = 'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ';

          if (!selected) {
            className += 'bg-wine-900 border-wine-700 text-wine-200 hover:border-wine-500 hover:text-wine-50 cursor-pointer';
          } else if (isCorrectOption) {
            className += 'bg-green-900/50 border-green-600 text-green-300';
          } else if (isSelected) {
            className += 'bg-red-900/50 border-red-700 text-red-300';
          } else {
            className += 'bg-wine-900/50 border-wine-800 text-wine-500 cursor-not-allowed';
          }

          return (
            <li key={option}>
              <button onClick={() => handleAnswer(option)} disabled={!!selected} className={className}>
                <span className="mr-2">
                  {selected && isCorrectOption ? '✓' : selected && isSelected ? '✗' : ''}
                </span>
                {option}
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className={`rounded-2xl p-5 border mb-6 ${isCorrect ? 'bg-green-900/30 border-green-700/50' : 'bg-red-900/30 border-red-700/50'}`}>
          <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
            {isCorrect ? '✓ Rätt!' : '✗ Inte riktigt.'}
          </p>
          <p className="text-wine-300 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {selected && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-wine-700 hover:bg-wine-600 text-wine-50 font-medium rounded-xl transition-colors"
        >
          {current + 1 >= shuffled.length ? 'Se resultat' : 'Nästa fråga →'}
        </button>
      )}
    </div>
  );
}