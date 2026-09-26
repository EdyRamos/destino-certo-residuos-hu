import {describe,it,expect} from 'vitest';
import {items,levels} from '../src/data';
import {createSession,currentAnswer,applyAnswer,advance,summarize,selectItems} from '../src/game/session';
const fresh=()=>createSession(levels[0],items,'career',[],()=>.3);
const item=(s:ReturnType<typeof fresh>)=>items.find(i=>i.id===s.itemIds[s.currentIndex])!;
const wrong=(correct:string)=>['white_bag','hamper','red_bag','green_bag','black_bag','sharps','vial_glass','vial_chemical'].filter(d=>d!==correct);
describe('sessão',()=>{
 it('fase 2 preserva pares e fase 3 inclui quatro situações avançadas',()=>{const s2=createSession(levels[1],items,'career');expect(s2.itemIds).toEqual(expect.arrayContaining(['white_13','black_05','hamper_03','hamper_04']));const s3=createSession(levels[2],items,'career');expect(s3.itemIds.filter(id=>items.find(i=>i.id===id)!.difficulty===3).length).toBeGreaterThanOrEqual(4);});
 it('sorteia dez itens únicos sem casos suspensos',()=>{const s=fresh();expect(s.itemIds).toHaveLength(10);expect(new Set(s.itemIds).size).toBe(10);expect(s.itemIds.every(id=>items.find(i=>i.id===id)?.enabled)).toBe(true);});
 it('evita itens já vistos quando há alternativas suficientes',()=>{const seen=fresh().itemIds;const pool=items.filter(i=>i.enabled);const chosen=selectItems(pool,10,seen,()=>.2);expect(chosen.some(id=>seen.includes(id))).toBe(false);});
 it('erro não avança e resposta repetida não consome tentativa',()=>{let s=fresh();const i=item(s),d=wrong(i.destinationId)[0];s=applyAnswer(s,d,i);expect(s.currentIndex).toBe(0);expect(advance(s)).toBe(s);expect(applyAnswer(s,d,i)).toBe(s);});
 it.each([[0,100],[1,60],[2,30]])('acerto após %i erros vale %i',(errors,score)=>{let s=fresh();const i=item(s);for(const d of wrong(i.destinationId).slice(0,errors))s=applyAnswer(s,d,i);s=applyAnswer(s,i.destinationId,i);expect(currentAnswer(s)?.points).toBe(score);expect(applyAnswer(s,i.destinationId,i)).toBe(s);expect(advance(s).currentIndex).toBe(1);});
 it('terceiro erro encerra pergunta com zero',()=>{let s=fresh();const i=item(s);for(const d of wrong(i.destinationId).slice(0,3))s=applyAnswer(s,d,i);expect(currentAnswer(s)).toMatchObject({completed:true,correct:false,points:0});expect(applyAnswer(s,i.destinationId,i)).toBe(s);});
 it.each([[5,false],[6,true],[10,true]])('aprovação com %i itens: %s',(correct,passed)=>{let s=fresh();for(let n=0;n<10;n++){const i=item(s);if(n<correct)s=applyAnswer(s,i.destinationId,i);else for(const d of wrong(i.destinationId).slice(0,3))s=applyAnswer(s,d,i);s=advance(s);}expect(s.finished).toBe(true);expect(summarize(s)).toMatchObject({correct,passed,score:correct*100});expect(advance(s)).toBe(s);});
});
