import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { items, destinations, levels } from '../src/data';
describe('integridade editorial',()=>{
 it('preserva os 52 IDs e os oito destinos',()=>{expect(items).toHaveLength(52);expect(new Set(items.map(i=>i.id)).size).toBe(52);expect(destinations).toHaveLength(8);});
 it('todos os destinos existem e os cenários são explícitos',()=>{for(const i of items){expect(destinations.some(d=>d.id===i.destinationId)).toBe(true);expect(i.condition.length).toBeGreaterThan(20);expect(i.explanation.length).toBeGreaterThan(30);expect(i.originalName).toBeTruthy();}});
 it('suspensos não entram em perguntas',()=>{for(const l of levels){expect(l.questionCount).toBe(10);expect(l.pool.length).toBeGreaterThanOrEqual(10);for(const id of l.pool)expect(items.find(i=>i.id===id)?.enabled).toBe(true);}});
 it('textos não têm codificação dupla (mojibake)',()=>{for(const f of ['items','destinations','levels','version'])expect(readFileSync('src/data/'+f+'.json','utf8')).not.toMatch(/Ã[\u0080-¿]|Â[\u0080-¿]|â€/);});
 it('dificuldade cresce por fase',()=>{expect(levels[0].pool.every(id=>items.find(i=>i.id===id)!.difficulty===1)).toBe(true);expect(levels[1].pool.every(id=>items.find(i=>i.id===id)!.difficulty===2)).toBe(true);expect(levels[2].pool.some(id=>items.find(i=>i.id===id)!.difficulty===3)).toBe(true);});
});