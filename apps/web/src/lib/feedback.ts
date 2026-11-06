import { useQueryClient } from '@tanstack/react-query';
import type { AnswerResult } from '@cyberquest/shared';
import { useUiStore } from './ui';

export function useAnswerFeedback() {
  const queryClient = useQueryClient();
  const addToast = useUiStore((state) => state.addToast);
  const showLevelUp = useUiStore((state) => state.showLevelUp);

  return (result: AnswerResult) => {
    if (result.correct) {
      addToast({
        tone: 'success',
        title: result.xpGained > 0 ? `Correto! +${result.xpGained} XP` : 'Correto!',
        description: result.reviewScheduled ? 'Revisão agendada para mais tarde.' : undefined
      });
    } else {
      addToast({
        tone: 'error',
        title: 'Ainda não é essa resposta',
        description: 'Leia a explicação e tente novamente.'
      });
    }
    if (result.leveledUp) showLevelUp(result.level, result.levelTitle);
    result.unlockedAchievements?.forEach((achievement) => {
      addToast({
        tone: 'achievement',
        title: `Conquista desbloqueada: ${achievement.title}`,
        description: achievement.description
      });
    });
    void queryClient.invalidateQueries({ queryKey: ['me'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}
