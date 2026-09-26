import itemsJson from './items.json';
import destinationsJson from './destinations.json';
import levelsJson from './levels.json';
import type { WasteItem, Destination, Level } from '../types';
export const items = itemsJson as WasteItem[];
export const destinations = destinationsJson as Destination[];
export const levels = levelsJson as Level[];
export const itemMap = new Map(items.map(i => [i.id, i]));
export const pendingContent = items.some(i => i.requiresInstitutionalValidation);
