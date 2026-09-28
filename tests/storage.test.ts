import {beforeEach,describe,it,expect,vi} from 'vitest';
import {items,levels} from '../src/data';
import {createSession,applyAnswer} from '../src/game/session';
import {newCareer} from '../src/game/career';
import {save,loadCareer,loadRanking,loadPreferences,loadAlbum} from '../src/storage/local';
let data:Map<string,string>;
beforeEach(()=>{data=new Map();vi.stubGlobal('localStorage',{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v)});});
describe('persistência',()=>{
 it('retoma exatamente entre tentativas',()=>{const c=newCareer();let s=createSession(levels[0],items,'career');const i=items.find(i=>i.id===s.itemIds[0])!;s=applyAnswer(s,i.destinationId==='hamper'?'black_bag':'hamper',i);c.session=s;save('career',c);expect(loadCareer()).toEqual(c);});
 it('descarta formato corrompido sem lançar',()=>{save('career',{unexpected:true});save('ranking',[null]);expect(loadCareer()).toBeNull();expect(loadRanking()).toEqual([]);});
 it('não aceita pontuação adulterada dentro da sessão',()=>{const c=newCareer();let s=createSession(levels[0],items,'career');const i=items.find(i=>i.id===s.itemIds[0])!;s=applyAnswer(s,i.destinationId,i);s.answers[0].points=3000;c.session=s;save('career',c);expect(loadCareer()).toBeNull();});
 it('armazena preferências separadas',()=>{save('preferences',{sound:false,reducedMotion:true});expect(loadPreferences()).toEqual({sound:false,music:true,reducedMotion:true});});
 it('falha de quota não interrompe execução',()=>{vi.stubGlobal('localStorage',{setItem:()=>{throw new Error('quota');},getItem:()=>{throw new Error('denied');}});expect(save('ranking',[])).toBe(false);expect(loadRanking()).toEqual([]);});
 it('coleção aceita apenas itens habilitados e sem repetição',()=>{const ok=items.filter(i=>i.enabled).slice(0,3).map(i=>i.id);save('album',ok);expect(loadAlbum()).toEqual(ok);save('album',[ok[0],ok[0]]);expect(loadAlbum()).toEqual([]);const suspended=items.find(i=>!i.enabled)!.id;save('album',[suspended]);expect(loadAlbum()).toEqual([]);save('album',{x:1});expect(loadAlbum()).toEqual([]);});
});
