import { describe, expect, it } from 'vitest';
import { scoreForAttempt } from '../src/game/scoring';
describe('pontuação por tentativa',()=>{
 it.each([[1,100],[2,60],[3,30],[4,0],[0,0]])('tentativa %i vale %i',(attempt,points)=>expect(scoreForAttempt(attempt)).toBe(points));
});