/**
 * SYSTEM MILESTONES STORE — Completely independent from moments.
 * Storage key: SYSTEM_MILESTONES_{pregnancyId}
 * Handles ONLY milestone data. Never shares state with moments.
 * Milestones NEVER call addMoment, setMoments, or push to moments array.
 */
import { loadJSON, saveJSON } from './storage';
import { Milestone } from '../types/pregnancy';
import { generateMilestones } from './milestones';

const STORAGE_PREFIX = 'SYSTEM_MILESTONES_';

function storageKey(pregnancyId: string): string {
  return `${STORAGE_PREFIX}${pregnancyId}`;
}

function isMilestone(item: unknown): item is Milestone {
  if (!item || typeof item !== 'object') return false;
  const o = item as Record<string, unknown>;
  return o.type === 'milestone' || ('milestoneDate' in o && 'linkedMomentIds' in o);
}

const LEGACY_KEY = (id: string) => `mommy_milestones_${id}`;

export async function loadMilestones(pregnancyId: string, dueDate: string): Promise<Milestone[]> {
  let raw = await loadJSON<unknown[]>(storageKey(pregnancyId));
  if ((!raw || !Array.isArray(raw)) && pregnancyId) {
    raw = await loadJSON<unknown[]>(LEGACY_KEY(pregnancyId));
  }
  if (!raw || !Array.isArray(raw)) {
    return generateMilestones(dueDate);
  }
  const filtered = raw.filter(isMilestone).map((m) => {
    const o = m as unknown as Record<string, unknown>;
    return {
      id: String(o.id ?? ''),
      type: 'milestone' as const,
      title: String(o.title ?? ''),
      milestoneDate: String(o.milestoneDate ?? o.calculatedDate ?? o.date ?? ''),
      linkedMomentIds: Array.isArray(o.linkedMomentIds) ? o.linkedMomentIds : [],
    } as Milestone;
  });
  if (filtered.length === 0) return generateMilestones(dueDate);
  return filtered;
}

export async function saveMilestones(pregnancyId: string, milestones: Milestone[]): Promise<void> {
  await saveJSON(storageKey(pregnancyId), milestones);
}
