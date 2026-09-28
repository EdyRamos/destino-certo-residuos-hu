import { test, expect, type Page } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
const items = JSON.parse(readFileSync('src/data/items.json', 'utf8'));
const version = JSON.parse(readFileSync('src/data/version.json', 'utf8'));
const key='destino-certo-v2:'+version.content+':'+version.rules+':career';
const rankingKey=key.replace(/career$/,'ranking');
async function state(page:Page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),key);}
async function begin(page:Page){
 await page.goto('/');await page.locator('#play').click();await page.locator('#career').click();await page.locator('[data-phase="0"]').click();await page.locator('#mission-start').click();
}
async function current(page:Page){const s=(await state(page)).session;return items.find(i=>i.id===s.itemIds[s.currentIndex])!;}
async function correct(page:Page){const i=await current(page);await page.locator('[data-destination="'+i.destinationId+'"]').click();await expect(page.getByRole('dialog')).toContainText('Destino certo!');await page.locator('#feedback-next').click();}
test('carreira completa, ranking, nome seguro e novo participante',async({page})=>{
 test.setTimeout(180000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await begin(page);
 for(let phase=0;phase<3;phase++){
  for(let question=0;question<10;question++)await correct(page);
  await expect(page.locator('.result-stats')).toContainText('1000');
  if(phase===0){await expect(page.locator('.result-stars .star.filled')).toHaveCount(3);await expect(page.locator('.medal-card')).toContainText(['Olhar atento','Fase perfeita','Sequência de primeira']);}
  await page.locator('#result-next').click();
  if(phase<2){await expect(page.locator('[data-phase="'+(phase+1)+'"]')).toBeEnabled();await page.locator('[data-phase="'+(phase+1)+'"]').click();await page.locator('#mission-start').click();}
 }
 await page.locator('#player-name').fill('<img src=x> Ana');
 await page.getByRole('button',{name:'Salvar e ver ranking'}).click();
 await expect(page.locator('tbody tr')).toHaveCount(1);
 await expect(page.locator('tbody')).toContainText('3000');
 await expect(page.locator('tbody')).toContainText('<img src=x> Ana');
 await expect(page.locator('tbody img')).toHaveCount(0);
 await page.reload();await page.locator('#ranking').click();await expect(page.locator('tbody tr')).toHaveCount(1);
 await page.locator('#rank-home').click();await page.locator('#play').click();await page.locator('#career').click();await page.locator('#new-career').click();await page.locator('#confirm-new').click();
 await expect(page.locator('[data-phase="1"]')).toBeDisabled();expect((await state(page)).results).toHaveLength(0);
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).length,rankingKey)).toBe(1);
 await page.locator('#back').click();await page.locator('#album').click();
 await expect(page.locator('.album-count')).toHaveText('30/45');await expect(page.locator('[data-album]')).toHaveCount(30);
 await page.locator('[data-album]').first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.locator('#close-album').click();
 expect(errors).toEqual([]);
});
test('erros, redução de pontos e retomada entre tentativas',async({page})=>{
 await begin(page);const item=await current(page);
 const wrong=items.map(i=>i.destinationId).find(id=>id!==item.destinationId)!;
 await page.locator('[data-destination="'+wrong+'"]').click();
 await expect(page.getByRole('dialog')).toContainText('60 pontos');
 await expect(page.locator('.correct-answer')).toHaveCount(0);
 await page.reload();await page.locator('#resume').click();await page.locator('[data-phase="0"]').click();
 await expect(page.getByRole('dialog')).toContainText('60 pontos');
 await page.locator('#feedback-next').click();
 await expect(page.locator('[data-destination="'+wrong+'"]')).toBeDisabled();
 await page.locator('[data-destination="'+item.destinationId+'"]').click();
 await expect(page.getByRole('dialog')).toContainText('+60 pontos');
 await page.locator('#feedback-next').click();
 expect((await state(page)).session.currentIndex).toBe(1);
});
test('reprovação, bloqueio e repetição sem somar pontuação anterior',async({page})=>{
 await begin(page);
 for(let n=0;n<10;n++){
  if(n<5){await correct(page);continue;}
  const item=await current(page),wrong=['white_bag','hamper','red_bag','green_bag','black_bag','sharps'].filter(id=>id!==item.destinationId).slice(0,3);
  for(let t=0;t<3;t++){await page.locator('[data-destination="'+wrong[t]+'"]').click();if(t===2)await expect(page.getByRole('dialog')).toContainText('três tentativas');await page.locator('#feedback-next').click();}
 }
 await expect(page.locator('h1')).toHaveText('Vamos praticar novamente?');
 await page.locator('#result-next').click();await page.locator('#resume').click();
 await expect(page.locator('[data-phase="1"]')).toBeDisabled();
 await page.locator('[data-phase="0"]').click();expect((await state(page)).session.answers).toHaveLength(0);
});
test('prática, toque e layout móvel sem alterar carreira',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();await begin(page);const before=await state(page);
 await page.locator('#pause').tap();await page.locator('#exit-game').tap();
 await page.locator('#play').tap();await page.locator('#practice').tap();await page.locator('[data-practice="2"]').tap();await page.locator('#mission-start').tap();
 await page.locator('.destination').first().tap();await expect(page.getByRole('dialog')).toBeVisible();
 expect(await state(page)).toEqual(before);
 await page.screenshot({path:'output/mobile-feedback.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});
test('arraste reconhece destino e cancelamento não pontua',async({page})=>{
 await begin(page);const item=await current(page);
 const card=await page.locator('#waste-card').boundingBox(),dest=await page.locator('[data-destination="'+item.destinationId+'"]').boundingBox();
 await page.mouse.move(card!.x+card!.width/2,card!.y+card!.height/2);await page.mouse.down();await page.mouse.move(dest!.x+dest!.width/2,dest!.y+dest!.height/2,{steps:12});await page.mouse.up();
 await expect(page.getByRole('dialog')).toContainText('Destino certo');
 await page.locator('#feedback-next').click();
 await page.locator('#waste-card').dispatchEvent('pointerdown',{pointerId:4,button:0,clientX:100,clientY:200});
 await page.locator('#waste-card').dispatchEvent('pointercancel',{pointerId:4});
 expect((await state(page)).session.currentIndex).toBe(1);
});
test('offline após cache, reabertura e nenhuma dependência externa',async({page,context})=>{
 const external:string[]=[];page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:4173'))external.push(r.url());});
 await page.goto('/');await expect(page.locator('#status')).toContainText('Pronto para uso offline',{timeout:30000});
 await page.reload();await context.setOffline(true);await page.reload();
 await expect(page.locator('#status')).toContainText('jogando offline');
 await page.locator('#play').click();await page.locator('#career').click();await page.locator('[data-phase="0"]').click();
 await page.locator('#mission-start').click();await correct(page);expect(external).toEqual([]);
 await context.setOffline(false);
});
test('publicação em subdiretório mantém recursos, escopo e modo offline',async({page,context})=>{
 const root='http://127.0.0.1:4174/residuos/',outside:string[]=[],failed:string[]=[];
 page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(root))outside.push(r.url());});
 page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
 await page.goto(root);await expect(page.locator('#status')).toContainText('Pronto para uso offline',{timeout:30000});
 expect(await page.evaluate(async()=>(await navigator.serviceWorker.ready).scope)).toBe(root);
 expect(await page.evaluate(()=>(document.querySelector('.hu-logo') as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 await context.setOffline(true);await page.reload();
 await expect(page.locator('#status')).toContainText('jogando offline');
 await page.locator('#play').click();await page.locator('#career').click();await page.locator('[data-phase="0"]').click();
 await page.locator('#mission-start').click();await expect(page.locator('.destination')).toHaveCount(8);
 await page.locator('.destination').first().click();await expect(page.getByRole('dialog')).toBeVisible();
 expect(outside).toEqual([]);expect(failed).toEqual([]);
 await context.setOffline(false);
});
test('telas de tablet e desktop carregam sem transbordamento',async({page})=>{
 for(const [width,height,label] of [[1280,800,'tablet'],[800,1280,'portrait'],[1920,1200,'desktop']] as const){
  await page.setViewportSize({width,height});await page.goto('/');
  await page.screenshot({path:'output/home-'+label+'.png',fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('#play').click();await page.locator('#practice').click();await page.locator('[data-practice="0"]').click();await page.locator('#mission-start').click();
  await page.screenshot({path:'output/game-'+label+'.png',fullPage:true});
  expect(await page.locator('.destination').count()).toBe(8);
 }
});
test('gabarito abre por arquivo offline e revela em etapas',async({page,context})=>{
 const external:string[]=[];page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await context.setOffline(true);
 await page.goto(pathToFileURL(resolve('output/gabarito/Destino-Certo-Gabarito-DEPE.html')).href);
 await expect(page.locator('.answer')).toHaveCount(0);
 await page.locator('#show-choices').click();await expect(page.locator('[data-choice]')).toHaveCount(8);
 await page.locator('#reveal').click();await expect(page.locator('.answer')).toBeVisible();await expect(page.locator('.answer p')).toHaveCount(0);
 await page.locator('#explain').click();await expect(page.locator('.answer p')).toBeVisible();
 await page.locator('#next').click();await expect(page.locator('.answer')).toHaveCount(0);
 await page.locator('#pending').check();await page.locator('#search').fill('Frascos de dieta');
 await expect(page.locator('.pending')).toBeVisible();await expect(page.locator('#reveal')).toHaveCount(0);
 await page.screenshot({path:'output/guide-pending.png',fullPage:true});
 expect(external).toEqual([]);
});
test('armazenamento indisponível não impede treino',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('QuotaExceededError');};});
 await page.goto('/');await page.locator('#play').click();await page.locator('#career').click();
 await expect(page.locator('#storage-warning')).toBeVisible();await page.locator('[data-phase="0"]').click();
 await page.locator('#mission-start').click();
 await page.locator('.destination').first().click();await expect(page.getByRole('dialog')).toBeVisible();
});

test('missão apresenta objetivo, áudio persiste e retorno começa no topo',async({page})=>{
 await page.goto('/');await expect(page.locator('#music-quick')).toHaveAttribute('aria-pressed','true');
 await page.locator('#music-quick').click();await expect(page.locator('#music-quick')).toHaveAttribute('aria-pressed','false');
 await page.locator('#settings').click();await expect(page.locator('#music-toggle')).not.toBeChecked();
 await page.locator('#sound-toggle').uncheck();await page.locator('#motion-toggle').check();
 await page.reload();await page.locator('#settings').click();
 await expect(page.locator('#sound-toggle')).not.toBeChecked();await expect(page.locator('#music-toggle')).not.toBeChecked();
 await expect(page.locator('html')).toHaveClass(/reduce-motion/);
 await page.locator('#back').click();await page.locator('#play').click();await page.locator('#practice').click();await page.locator('[data-practice="1"]').click();
 await expect(page.locator('h1')).toHaveText('Um detalhe muda a decisão');
 await expect(page.locator('.mission-focus')).toContainText('Não decida só pela aparência');
 await page.locator('#dialogue-next').click();await page.locator('#dialogue-next').click();
 await expect(page.locator('#dialogue-next')).toBeHidden();await expect(page.locator('#nery-line')).toContainText('investigar');
 await page.locator('#mission-start').click();await expect(page.locator('.destination')).toHaveCount(8);
 expect(await page.evaluate(()=>scrollY)).toBe(0);
 await page.locator('#pause').click();await page.locator('#resume-game').click();await expect(page.locator('.destination')).toHaveCount(8);
});
