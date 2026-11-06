import type { Exercise } from '@cyberquest/shared';
import { sha256Hex } from '../../utils/crypto';

export interface GradeResult {
  correct: boolean;
  explanation: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...new Set(a)].sort((x, y) => x - y);
  const right = [...new Set(b)].sort((x, y) => x - y);
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function gradeExercise(exercise: Exercise, answer: unknown): GradeResult {
  let correct = false;
  switch (exercise.type) {
    case 'single_choice':
      correct = Number(answer) === exercise.answerIndex;
      break;
    case 'multi_choice':
      correct = Array.isArray(answer) && sameSet(answer.map(Number), exercise.answerIndexes);
      break;
    case 'true_false':
      correct = Boolean(answer) === exercise.answer;
      break;
    case 'order':
      correct =
        Array.isArray(answer) &&
        answer.length === exercise.correctOrder.length &&
        answer.every((value, index) => Number(value) === exercise.correctOrder[index]);
      break;
    case 'match': {
      const expected = exercise.pairs
        .map(([left, right]) => `${normalize(left)}::${normalize(right)}`)
        .sort();
      const provided = Array.isArray(answer)
        ? answer
            .map((pair) => {
              if (!Array.isArray(pair) || pair.length !== 2) return '';
              return `${normalize(String(pair[0]))}::${normalize(String(pair[1]))}`;
            })
            .sort()
        : [];
      correct = expected.length === provided.length && expected.every((value, index) => value === provided[index]);
      break;
    }
    case 'fill_command': {
      const values = Array.isArray(answer) ? answer.map((value) => normalize(String(value))) : [];
      correct =
        values.length === exercise.accepted.length &&
        exercise.accepted.every((accepted, index) =>
          accepted.some((candidate) => normalize(candidate) === values[index])
        );
      break;
    }
    case 'sim_terminal': {
      const data = (answer ?? {}) as { history?: unknown; files?: unknown; cwd?: unknown };
      const history = Array.isArray(data.history) ? data.history.map((item) => String(item)) : [];
      const files = Array.isArray(data.files) ? data.files.map((item) => String(item)) : [];
      const cwd = typeof data.cwd === 'string' ? data.cwd : '';
      const historyOk = (exercise.checks.historyIncludes ?? []).every((needle) =>
        history.some((line) => line.toLowerCase().includes(needle.toLowerCase()))
      );
      const filesOk = (exercise.checks.fileExists ?? []).every((file) => files.includes(file));
      const cwdOk = exercise.checks.cwd ? cwd === exercise.checks.cwd : true;
      correct = historyOk && filesOk && cwdOk;
      break;
    }
    case 'code_review':
      correct = Array.isArray(answer) && sameSet(answer.map(Number), exercise.vulnerableLines);
      break;
    case 'flag':
      correct = sha256Hex(normalize(String(answer ?? ''))) === exercise.flagHash.toLowerCase();
      break;
    default:
      correct = false;
  }
  return { correct, explanation: exercise.explanation };
}
