import { describe, expect, it } from 'vitest';
import {
  applyDailyActivity,
  hintAdjustedXp,
  levelForXp,
  sm2,
  starsForLesson,
  xpForLevel,
  xpIntoLevel,
  xpToNextLevel
} from '../src/gamification';
import { publicExercisePayload } from '../src/exercises';
import type { Exercise } from '../src/exercises';

describe('gamificação', () => {
  it('calcula níveis nos limites de XP', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(xpForLevel(2)).toBe(100);
    expect(xpIntoLevel(125)).toBe(25);
    expect(xpToNextLevel(125)).toBe(175);
  });

  it('atribui estrelas conforme erros', () => {
    expect(starsForLesson(0, 3)).toBe(3);
    expect(starsForLesson(1, 4)).toBe(2);
    expect(starsForLesson(3, 4)).toBe(1);
    expect(starsForLesson(0, 0)).toBe(3);
  });

  it('reduz XP de dicas com piso mínimo', () => {
    expect(hintAdjustedXp(100, 0)).toBe(100);
    expect(hintAdjustedXp(100, 1)).toBeLessThan(100);
    expect(hintAdjustedXp(100, 20)).toBeGreaterThan(0);
  });

  it('avança streak e consome congelamentos', () => {
    const first = applyDailyActivity(
      { current: 0, best: 0, freezes: 0, lastActivityDate: null },
      '2026-01-01'
    );
    expect(first.current).toBe(1);
    const next = applyDailyActivity(first, '2026-01-02');
    expect(next.current).toBe(2);
    const frozen = applyDailyActivity(
      { current: 2, best: 2, freezes: 2, lastActivityDate: '2026-01-02' },
      '2026-01-04'
    );
    expect(frozen.current).toBe(3);
    expect(frozen.freezes).toBe(1);
  });

  it('agenda revisão com SM-2', () => {
    expect(sm2(null, 5).intervalDays).toBe(1);
    expect(sm2({ intervalDays: 1, ease: 2.5 }, 5).intervalDays).toBe(3);
    expect(sm2({ intervalDays: 6, ease: 2.5 }, 1).intervalDays).toBe(1);
  });
});

describe('payload público de exercícios', () => {
  const single: Exercise = {
    type: 'single_choice',
    question: 'Pergunta',
    options: ['A', 'B'],
    answerIndex: 1,
    explanation: 'Explicação'
  };

  it('não expõe resposta de single_choice', () => {
    const payload = publicExercisePayload(single);
    expect(payload).toEqual({ question: 'Pergunta', options: ['A', 'B'] });
    expect(payload).not.toHaveProperty('answerIndex');
    expect(payload).not.toHaveProperty('explanation');
  });

  it('não expõe respostas aceitas de fill_command', () => {
    const exercise: Exercise = {
      type: 'fill_command',
      question: 'Complete',
      template: 'ls ___',
      accepted: [['-la']],
      explanation: 'Use -la'
    };
    const payload = publicExercisePayload(exercise);
    expect(payload).not.toHaveProperty('accepted');
    expect(payload.blanks).toEqual(['']);
  });
});
