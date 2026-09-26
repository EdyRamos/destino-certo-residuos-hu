import {describe,it,expect} from 'vitest';
import {addRanking,qualifies,sortRanking,newCareer,completePhase,careerEntry} from '../src/game/career';
import type {RankingEntry} from '../src/types';
const entry=(id:string,score=2000,firstTry=20,time='2026-09-25T12:00:00Z'):RankingEntry=>({id,name:'Participante',score,firstTry,endedAt:time});
describe('ranking e carreira',()=>{
 it('desempata por primeira tentativa, depois data',()=>expect(sortRanking([entry('a',2000,15),entry('b',2000,20,'2026-09-25T13:00:00Z'),entry('c')]).map(e=>e.id)).toEqual(['c','b','a']));
 it('limita vinte e não registra duplicatas',()=>{let r:RankingEntry[]=[];for(let n=0;n<25;n++)r=addRanking(r,entry(String(n),n*100));expect(r).toHaveLength(20);expect(r[0].score).toBe(2400);expect(addRanking(r,r[0])).toBe(r);expect(qualifies(r,entry('low',0))).toBe(false);});
 it('fase reprovada não soma e aprovada não duplica',()=>{let c=newCareer();const r={levelId:'nivel_1',score:500,correct:5,firstTry:5,itemIds:[],passed:false};c=completePhase(c,r);expect(c.results).toHaveLength(0);c=completePhase(c,{...r,passed:true,correct:6});c=completePhase(c,{...r,passed:true,correct:6});expect(c.results).toHaveLength(1);});
 it('três fases completam a carreira, nome é opcional e limitado',()=>{let c=newCareer();for(let n=1;n<=3;n++)c=completePhase(c,{levelId:'nivel_'+n,score:1000,correct:10,firstTry:10,itemIds:[],passed:true});expect(c.completedAt).toBeTruthy();expect(careerEntry(c,'  ')).toMatchObject({score:3000,name:'Participante'});expect(careerEntry(c,'x'.repeat(40)).name).toHaveLength(24);});
});