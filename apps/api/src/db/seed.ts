import { closeDb, getDb } from './connection';
import { loadAchievements, loadContent } from '../content/loader';
import { loadAllManifests } from '../modules/labs/manifest';
import { logger } from '../logger';
import type { DB } from './connection';

export interface SeedReport {
  tracks: number;
  modules: number;
  lessons: number;
  exercises: number;
  achievements: number;
  labs: number;
}

export function syncCatalog(db: DB): SeedReport {
  const tracks = loadContent();
  const achievements = loadAchievements();
  const labs = loadAllManifests();

  const report: SeedReport = {
    tracks: 0,
    modules: 0,
    lessons: 0,
    exercises: 0,
    achievements: 0,
    labs: 0
  };

  const upsertTrack = db.prepare(`
    INSERT INTO tracks (slug, title, description, icon, color, position, status)
    VALUES (@slug, @title, @description, @icon, @color, @position, @status)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      icon = excluded.icon,
      color = excluded.color,
      position = excluded.position,
      status = excluded.status
    RETURNING id
  `);

  const upsertModule = db.prepare(`
    INSERT INTO modules (track_id, slug, title, description, position, xp_reward)
    VALUES (@track_id, @slug, @title, @description, @position, @xp_reward)
    ON CONFLICT(slug) DO UPDATE SET
      track_id = excluded.track_id,
      title = excluded.title,
      description = excluded.description,
      position = excluded.position,
      xp_reward = excluded.xp_reward
    RETURNING id
  `);

  const upsertLesson = db.prepare(`
    INSERT INTO lessons (
      module_id, slug, title, kind, difficulty, est_minutes, xp_reward, position,
      content_path, lab_slug, status, prerequisites_json
    ) VALUES (
      @module_id, @slug, @title, @kind, @difficulty, @est_minutes, @xp_reward, @position,
      @content_path, @lab_slug, @status, @prerequisites_json
    )
    ON CONFLICT(slug) DO UPDATE SET
      module_id = excluded.module_id,
      title = excluded.title,
      kind = excluded.kind,
      difficulty = excluded.difficulty,
      est_minutes = excluded.est_minutes,
      xp_reward = excluded.xp_reward,
      position = excluded.position,
      content_path = excluded.content_path,
      lab_slug = excluded.lab_slug,
      status = excluded.status,
      prerequisites_json = excluded.prerequisites_json
    RETURNING id
  `);

  const upsertExercise = db.prepare(`
    INSERT INTO exercises (lesson_id, position, type, payload_json, xp)
    VALUES (@lesson_id, @position, @type, @payload_json, @xp)
    ON CONFLICT(lesson_id, position) DO UPDATE SET
      type = excluded.type,
      payload_json = excluded.payload_json,
      xp = excluded.xp
    RETURNING id
  `);

  const deleteExtraExercises = db.prepare('DELETE FROM exercises WHERE lesson_id = ? AND position >= ?');

  const upsertAchievement = db.prepare(`
    INSERT INTO achievements (slug, title, description, icon, rarity, criteria_json)
    VALUES (@slug, @title, @description, @icon, @rarity, @criteria_json)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      icon = excluded.icon,
      rarity = excluded.rarity,
      criteria_json = excluded.criteria_json
  `);

  const upsertLab = db.prepare(`
    INSERT INTO lab_templates (slug, title, difficulty, ttl_minutes, xp_reward, manifest_path)
    VALUES (@slug, @title, @difficulty, @ttl_minutes, @xp_reward, @manifest_path)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      difficulty = excluded.difficulty,
      ttl_minutes = excluded.ttl_minutes,
      xp_reward = excluded.xp_reward,
      manifest_path = excluded.manifest_path
  `);

  const transaction = db.transaction(() => {
    tracks.forEach((track, trackIndex) => {
      const trackRow = upsertTrack.get({
        slug: track.frontmatter.slug,
        title: track.frontmatter.title,
        description: track.frontmatter.description,
        icon: track.frontmatter.icon,
        color: track.frontmatter.color,
        position: track.frontmatter.position ?? trackIndex,
        status: track.frontmatter.status
      }) as { id: number };
      report.tracks += 1;

      track.modules.forEach((module, moduleIndex) => {
        const moduleRow = upsertModule.get({
          track_id: trackRow.id,
          slug: module.frontmatter.slug,
          title: module.frontmatter.title,
          description: module.frontmatter.description,
          position: module.frontmatter.position ?? moduleIndex,
          xp_reward: module.frontmatter.xp_reward
        }) as { id: number };
        report.modules += 1;

        module.lessons.forEach((lesson, lessonIndex) => {
          const fm = lesson.frontmatter;
          const lessonRow = upsertLesson.get({
            module_id: moduleRow.id,
            slug: fm.slug,
            title: fm.title,
            kind: fm.kind,
            difficulty: fm.difficulty,
            est_minutes: fm.est_minutes,
            xp_reward: fm.xp,
            position: lessonIndex,
            content_path: lesson.relativePath,
            lab_slug: fm.lab_slug ?? null,
            status: fm.status,
            prerequisites_json: JSON.stringify(fm.prerequisites ?? [])
          }) as { id: number };
          report.lessons += 1;

          fm.exercises.forEach((exercise, exerciseIndex) => {
            upsertExercise.get({
              lesson_id: lessonRow.id,
              position: exerciseIndex,
              type: exercise.type,
              payload_json: JSON.stringify(exercise),
              xp: exercise.xp ?? 10
            });
            report.exercises += 1;
          });
          deleteExtraExercises.run(lessonRow.id, fm.exercises.length);
        });
      });
    });

    achievements.forEach((achievement) => {
      upsertAchievement.run({
        slug: achievement.slug,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon ?? '🏅',
        rarity: achievement.rarity ?? 'comum',
        criteria_json: JSON.stringify(achievement.criteria)
      });
      report.achievements += 1;
    });

    labs.forEach((lab) => {
      upsertLab.run({
        slug: lab.slug,
        title: lab.title,
        difficulty: lab.difficulty,
        ttl_minutes: lab.ttl_minutes,
        xp_reward: lab.xp_reward,
        manifest_path: `manifests/${lab.slug}.yml`
      });
      report.labs += 1;
    });
  });

  transaction();
  return report;
}

if (require.main === module) {
  try {
    const db = getDb();
    const report = syncCatalog(db);
    logger.info(report, 'Seed concluído');
    console.log(
      `Seed OK: ${report.tracks} trilhas, ${report.modules} módulos, ${report.lessons} lições, ` +
        `${report.exercises} exercícios, ${report.achievements} conquistas e ${report.labs} labs.`
    );
  } finally {
    closeDb();
  }
}
