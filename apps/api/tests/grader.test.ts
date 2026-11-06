import { describe, expect, it } from 'vitest';
import type { Exercise } from '@cyberquest/shared';
import { gradeExercise } from '../src/modules/exercises/grader';

describe('correção de exercícios', () => {
  it('corrige single_choice', () => {
    const exercise: Exercise = {
      type: 'single_choice',
      question: 'Escolha',
      options: ['A', 'B'],
      answerIndex: 1,
      explanation: 'B'
    };
    expect(gradeExercise(exercise, 1).correct).toBe(true);
    expect(gradeExercise(exercise, 0).correct).toBe(false);
  });

  it('corrige múltipla escolha sem depender da ordem', () => {
    const exercise: Exercise = {
      type: 'multi_choice',
      question: 'Escolha',
      options: ['A', 'B', 'C'],
      answerIndexes: [0, 2],
      explanation: 'A e C'
    };
    expect(gradeExercise(exercise, [2, 0]).correct).toBe(true);
    expect(gradeExercise(exercise, [0]).correct).toBe(false);
  });

  it('corrige ordem', () => {
    const exercise: Exercise = {
      type: 'order',
      question: 'Ordene',
      items: ['A', 'B', 'C'],
      correctOrder: [2, 0, 1],
      explanation: 'C A B'
    };
    expect(gradeExercise(exercise, [2, 0, 1]).correct).toBe(true);
    expect(gradeExercise(exercise, [0, 2, 1]).correct).toBe(false);
  });

  it('corrige fill_command com alternativas normalizadas', () => {
    const exercise: Exercise = {
      type: 'fill_command',
      question: 'Complete',
      template: 'ls ___',
      accepted: [['-la', ' -LA ']],
      explanation: 'Use -la'
    };
    expect(gradeExercise(exercise, ['-la']).correct).toBe(true);
    expect(gradeExercise(exercise, [' -LA ']).correct).toBe(true);
    expect(gradeExercise(exercise, ['-l']).correct).toBe(false);
  });

  it('corrige sim_terminal com histórico, arquivos e cwd', () => {
    const exercise: Exercise = {
      type: 'sim_terminal',
      question: 'Navegue',
      goal: 'Ir para /var/log',
      scenario: 'basico-terminal',
      checks: { historyIncludes: ['cd /var/log'], cwd: '/var/log' },
      explanation: 'Use cd'
    };
    expect(
      gradeExercise(exercise, { history: ['cd /var/log', 'ls'], files: [], cwd: '/var/log' }).correct
    ).toBe(true);
    expect(gradeExercise(exercise, { history: ['ls'], files: [], cwd: '/var/log' }).correct).toBe(false);
  });

  it('corrige true_false', () => {
    const exercise: Exercise = {
      type: 'true_false',
      statement: 'Afirmação',
      answer: false,
      explanation: 'Falsa'
    };
    expect(gradeExercise(exercise, false).correct).toBe(true);
    expect(gradeExercise(exercise, true).correct).toBe(false);
  });
});
