import { saveCollection, loadCollection } from './idb';

export type Priority = 'low' | 'medium' | 'high';

export type Profile = {
  level: number;
  xp: number;
  totalTasksCompleted: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  levelReq?: number;
  tasksReq?: number;
};

const XP_BY_PRIORITY: Record<Priority, number> = {
  low: 10,
  medium: 20,
  high: 30,
};

export function nextLevelRequirement(level: number): number {
  return 100 + level * level * 20;
}

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem('gamification-profile');
    if (raw) return JSON.parse(raw);
  } catch { void 0 }
  return { level: 1, xp: 0, totalTasksCompleted: 0 };
}

export async function saveProfile(profile: Profile): Promise<void> {
  localStorage.setItem('gamification-profile', JSON.stringify(profile));
  await saveCollection('gamification-profile', [profile]);
}

export function generateAchievements(): Achievement[] {
  const list: Achievement[] = [];
  for (let i = 1; i <= 50; i++) {
    list.push({
      id: `lvl-${i}`,
      title: `Nivel ${i}`,
      description: `Alcanza el nivel ${i}`,
      unlocked: false,
      levelReq: i,
    });
  }
  for (let i = 1; i <= 50; i++) {
    const tasks = i * 10;
    list.push({
      id: `tasks-${tasks}`,
      title: `${tasks} tareas`,
      description: `Completa ${tasks} tareas`,
      unlocked: false,
      tasksReq: tasks,
    });
  }
  return list;
}

export async function loadAchievements(): Promise<Achievement[]> {
  try {
    const raw = localStorage.getItem('achievements');
    if (raw) return JSON.parse(raw);
  } catch { void 0 }
  const fromIDB = await loadCollection<Achievement>('achievements');
  if (fromIDB && fromIDB.length) return fromIDB;
  return generateAchievements();
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  localStorage.setItem('achievements', JSON.stringify(achievements));
  await saveCollection('achievements', achievements);
}

export async function resetGamification(): Promise<void> {
  const defaultProfile: Profile = { level: 1, xp: 0, totalTasksCompleted: 0 };
  await saveProfile(defaultProfile);
  const base = generateAchievements();
  const evaluated = evaluateAchievements(defaultProfile, base);
  await saveAchievements(evaluated);
}

export function applyTaskToggle(profile: Profile, wasCompleted: boolean, nowCompleted: boolean, priority: Priority): Profile {
  let xp = profile.xp;
  let completed = profile.totalTasksCompleted;
  const delta = XP_BY_PRIORITY[priority];
  if (!wasCompleted && nowCompleted) {
    xp += delta;
    completed += 1;
  } else if (wasCompleted && !nowCompleted) {
    xp -= delta;
    if (completed > 0) completed -= 1;
  }
  if (xp < 0) xp = 0;
  let level = profile.level;
  while (xp >= nextLevelRequirement(level)) {
    xp -= nextLevelRequirement(level);
    level += 1;
  }
  return { level, xp, totalTasksCompleted: completed };
}

export function evaluateAchievements(profile: Profile, achievements: Achievement[]): Achievement[] {
  return achievements.map(a => {
    const okLevel = a.levelReq ? profile.level >= a.levelReq : true;
    const okTasks = a.tasksReq ? profile.totalTasksCompleted >= a.tasksReq : true;
    return { ...a, unlocked: okLevel && okTasks };
  });
}
