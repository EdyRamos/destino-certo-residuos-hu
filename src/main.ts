import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { items, destinations, levels, itemMap, pendingContent } from './data';
import version from './data/version.json';
import type { Career, SessionState } from './types';
import { createSession, applyAnswer, advance, currentAnswer, summarize } from './game/session';
import { newCareer, completePhase, careerEntry, addRanking, qualifies } from './game/career';
import { loadCareer, loadRanking, loadPreferences, save, storageFailed } from './storage/local';
import { playCorrect, playWrong, setAudioEnabled } from './ui/audio';
import { burstConfetti } from './ui/confetti';
import { enablePointerDrag } from './ui/drag';
import { base, esc, logo, icon, itemArt, destinationArt, nery } from './ui/common';

const app = document.querySelector<HTMLDivElement>('#app')!;
let career: Career | null = loadCareer();
let ranking = loadRanking();
let prefs = loadPreferences();
let session: SessionState | null = null;
let view = 'home', offlineReady = false, updateReady = false;
let installPrompt: (Event & { prompt(): Promise<void> }) | null = null;
setAudioEnabled(prefs.sound);
document.documentElement.classList.toggle('reduce-motion', prefs.reducedMotion);
document.documentElement.style.setProperty('--nery-reference', `url("${new URL(base + 'reference/telas.png', document.baseURI).href}")`);

const updateSW = registerSW({
  onOfflineReady() { offlineReady = true; updateStatus(); },
  onNeedRefresh() { updateReady = true; updateStatus(); },
  onRegisterError() { updateStatus('Não foi possível preparar o uso offline. Tente novamente com conexão.'); }
});
if ('serviceWorker' in navigator) void navigator.serviceWorker.ready.then(() => { offlineReady = true; updateStatus(); });
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e as typeof installPrompt; updateStatus(); });
window.addEventListener('online', () => updateStatus());
window.addEventListener('offline', () => updateStatus());

const btn = (id: string, text: string, style = 'primary', glyph = '') => `<button id="${id}" class="btn ${style}">${glyph ? icon(glyph) : ''}${text}</button>`;
function on(id: string, fn: () => void) { document.getElementById(id)?.addEventListener('click', fn); }
function persist() { if (session?.mode === 'career' && career) career.session = session; save('career', career); updateStatus(); }
function updateStatus(message?: string) {
  const status = document.getElementById('status');
  if (status) status.textContent = message ?? (offlineReady ? (navigator.onLine ? 'Pronto para uso offline' : 'Você está jogando offline') : 'Preparando uso offline…');
  const warning = document.getElementById('storage-warning');
  if (warning) { warning.hidden = !storageFailed(); warning.textContent = 'Não foi possível recuperar ou salvar dados locais. Você pode jogar, mas o progresso pode não ser preservado.'; }
  const actions = document.getElementById('system-actions');
  if (actions && view !== 'game') {
    actions.innerHTML = (updateReady ? btn('update', 'Atualização disponível', 'quiet') : '') + (installPrompt ? btn('install', 'Instalar jogo', 'quiet') : '');
    on('update', () => { void updateSW(true); });
    on('install', () => { void installPrompt?.prompt(); installPrompt = null; updateStatus(); });
  }
}
function shell(title: string, content: string, back = true, kind = '') {
  document.querySelector('.drag-ghost')?.remove();
  app.innerHTML = `<div class="app-shell ${kind}"><header class="header">${back ? `<button id="back" class="icon-btn" aria-label="Voltar ao início">${icon('back')}</button>` : ''}${logo()}<div class="header-title">${esc(title)}</div><button id="settings" class="icon-btn" aria-label="Configurações">${icon('settings')}</button></header><main id="main" tabindex="-1">${content}</main><footer><span class="status-dot"></span><span id="status" role="status"></span><span class="validation">${pendingContent ? 'Conteúdo em validação' : 'Conteúdo homologado'}</span><span id="system-actions"></span></footer><p id="storage-warning" class="storage-warning" role="status" hidden></p></div>`;
  on('back', home); on('settings', settings); updateStatus();
  document.getElementById('main')?.focus({ preventScroll: true });
}
function modal(title: string, content: string, actions: string, bind: () => void) {
  const el = document.createElement('dialog'); el.className = 'modal'; el.setAttribute('aria-label', title);
  el.innerHTML = `<h2>${title}</h2>${content}<div class="modal-actions">${actions}</div>`;
  document.body.append(el); el.addEventListener('close', () => el.remove()); el.showModal(); bind();
}
function home() {
  view = 'home'; session = null;
  const ongoing = career && !career.submitted;
  shell('', `<section class="hero"><div class="hero-copy"><span class="eyebrow">APRENDER PARA CUIDAR</span><h1>Destino<br><span>Certo.</span></h1><p class="game-name">Resíduos <strong>HU</strong></p><p class="tagline">Aprender hoje.<br>Um hospital mais seguro amanhã.</p><div class="home-actions">${btn('play', 'Jogar', 'primary', 'play')}${btn('instructions', 'Como jogar', 'secondary', 'book')}${btn('ranking', 'Ranking do aparelho', 'secondary', 'trophy')}</div>${ongoing ? `<button class="text-button" id="resume">Continuar minha carreira ${icon('arrow', 18)}</button>` : ''}</div><div class="hero-art"><div class="hero-halo"></div>${nery()}<div class="nery-label"><strong>Nery</strong><span>Sua guia no destino certo</span></div><div class="floating-note">${icon('leaf')}<span>Pequenas escolhas.<br><strong>Grandes cuidados.</strong></span></div></div></section><section class="home-bottom"><div><span class="mini-stat">03</span><span>fases para aprender</span></div><div><span class="mini-stat">10</span><span>perguntas por fase</span></div><img src="${base}brand/depe.png" alt="Divisão de Ensino e Pesquisa"></section>`, false, 'home');
  on('play', modes); on('instructions', instructions); on('ranking', () => showRanking()); on('resume', careerScreen);
}
function modes() {
  view = 'modes';
  shell('Vamos começar', `<div class="page-heading"><span class="eyebrow">SEU PRÓXIMO PASSO</span><h1>Como você quer jogar?</h1><p>Um destino certo começa com atenção aos detalhes.</p></div><div class="mode-grid"><button id="career" class="mode-card green"><span class="mode-symbol">${icon('bars', 46)}</span><h2>Carreira</h2><p>Avance por três fases, desbloqueie novos desafios e conquiste seu lugar no ranking.</p><span class="card-link">Iniciar jornada ${icon('arrow')}</span></button><button id="practice" class="mode-card blue"><span class="mode-symbol">${icon('target', 46)}</span><h2>Fases</h2><p>Escolha uma fase para praticar. Aprenda no seu ritmo, sem alterar sua carreira.</p><span class="card-link">Escolher fase ${icon('arrow')}</span></button></div><p class="page-note">Sem pressa: este jogo não tem cronômetro.</p>`);
  on('career', careerScreen); on('practice', practiceScreen);
}
function careerScreen() {
  view = 'career';
  if (!career) { career = newCareer(); save('career', career); }
  if (career.results.length === 3 && !career.submitted) return finishCareer();
  const done = career.results.length;
  shell('Modo carreira', `<div class="page-heading"><span class="eyebrow">UMA ESCOLHA DE CADA VEZ</span><h1>Sua jornada de cuidado</h1><p>Acerte pelo menos 6 de 10 itens para avançar.</p></div><div class="phase-grid">${levels.map((l, n) => `<button class="phase-card ${n > done ? 'locked' : ''}" data-phase="${n}" ${n !== done || career!.submitted ? 'disabled' : ''}><span class="phase-number">${n < done ? icon('check', 32) : n > done ? icon('lock', 26) : '0' + (n + 1)}</span><span class="eyebrow">FASE ${n + 1}</span><h2>${l.name}</h2><p>${l.description}</p><span class="phase-detail">${n < done ? career!.results[n].score + ' pontos · concluída' : n > done ? 'Conclua a fase anterior' : career!.session ? 'Continuar fase' : '10 perguntas · até 1.000 pontos'}</span></button>`).join('')}</div><div class="center-actions">${btn('new-career', 'Nova carreira', 'secondary')}</div><p class="page-note">Novo participante? Comece uma nova carreira. O ranking será preservado.</p>`);
  app.querySelectorAll<HTMLButtonElement>('[data-phase]').forEach(b => b.addEventListener('click', () => startPhase(Number(b.dataset.phase), 'career')));
  on('new-career', () => modal('Começar uma nova carreira?', '<p>O progresso desta carreira será reiniciado. O ranking e as preferências ficam salvos.</p>', btn('cancel-new', 'Voltar', 'secondary') + btn('confirm-new', 'Começar'), () => {
    on('cancel-new', () => document.querySelector('dialog')?.close());
    on('confirm-new', () => { document.querySelector('dialog')?.close(); career = newCareer(); save('career', career); careerScreen(); });
  }));
}
function practiceScreen() {
  view = 'practice';
  shell('Modo fases', `<div class="page-heading"><span class="eyebrow">PRATICAR FAZ DIFERENÇA</span><h1>Escolha uma fase</h1><p>Treino livre. Seus pontos não entram no ranking.</p></div><div class="phase-grid">${levels.map((l, n) => `<button class="phase-card" data-practice="${n}"><span class="phase-number">0${n + 1}</span><h2>${l.name}</h2><p>${l.description}</p><span class="card-link">Praticar ${icon('arrow')}</span></button>`).join('')}</div>`);
  app.querySelectorAll<HTMLButtonElement>('[data-practice]').forEach(b => b.addEventListener('click', () => startPhase(Number(b.dataset.practice), 'practice')));
}
function startPhase(index: number, mode: SessionState['mode']) {
  if (mode === 'career' && (!career || index !== career.results.length || career.submitted)) return;
  try {
    session = mode === 'career' && career?.session ? career.session : createSession(levels[index], items, mode, mode === 'career' ? career!.results.flatMap(r => r.itemIds) : []);
    if (mode === 'career') persist();
    renderGame();
  } catch (e) { modal('Fase indisponível', `<p>${esc(String(e))}</p>`, btn('close-error', 'Voltar'), () => on('close-error', () => document.querySelector('dialog')?.close())); }
}
function renderGame() {
  if (!session) return home();
  if (session.finished) return resultScreen();
  view = 'game';
  const item = itemMap.get(session.itemIds[session.currentIndex])!, answer = currentAnswer(session);
  const phase = levels.findIndex(l => l.id === session!.levelId);
  const points = session.answers.reduce((s, a) => s + a.points, 0), attempts = answer?.tried.length ?? 0;
  shell('', `<div class="game-top"><button id="pause" class="icon-btn" aria-label="Pausar partida">${icon('pause')}</button><div class="phase-progress"><span>${session.mode === 'practice' ? 'Prática · ' : ''}Fase ${phase + 1} de 3 <strong>Item ${session.currentIndex + 1} de 10</strong></span><progress max="10" value="${session.currentIndex}" aria-label="Progresso da fase"></progress></div><div class="points">${icon('star', 32)}<strong>${points}</strong><span>pontos</span></div></div><div class="play-instruction">Arraste o item ou toque no destino correto</div><section class="question-area"><div id="waste-card" class="waste-card">${itemArt(item)}</div><div class="question-copy"><span class="eyebrow">OBSERVE O ITEM E A CONDIÇÃO</span><h1>${esc(item.name)}</h1><p class="condition">${esc(item.condition)}</p><div class="chances" aria-label="${3 - attempts} tentativas restantes">${[0, 1, 2].map(n => `<span class="${n < attempts ? 'used' : ''}">${n < attempts ? '×' : '●'}</span>`).join('')}<small>Até 3 tentativas</small></div></div></section><section class="destinations" aria-label="Destinos">${destinations.map(d => `<button class="destination" data-destination="${d.id}" ${answer?.completed || answer?.tried.includes(d.id) ? 'disabled' : ''}>${destinationArt(d)}<strong>${esc(d.name)}</strong></button>`).join('')}</section><p class="game-footnote">Considere sempre a condição descrita. Roupa reutilizável segue para a lavanderia.</p>`, false, 'game');
  document.getElementById('settings')!.hidden = true;
  document.querySelector('.header-title')!.textContent = 'Destino Certo · Resíduos HU';
  on('pause', pause);
  app.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach(b => b.addEventListener('click', () => answerItem(b.dataset.destination!)));
  if (!answer?.completed) enablePointerDrag(document.getElementById('waste-card')!, answerItem);
  if (answer?.completed) feedback(true);
  else if (attempts) feedback(false);
}
function answerItem(destination: string) {
  if (!session || document.querySelector('dialog[open]')) return;
  const item = itemMap.get(session.itemIds[session.currentIndex])!;
  const next = applyAnswer(session, destination, item); if (next === session) return;
  session = next; persist();
  const answer = currentAnswer(session)!;
  if (answer.correct) playCorrect(); else playWrong();
  renderGame();
  if (answer.correct && !prefs.reducedMotion) burstConfetti(app);
}
function feedback(completed: boolean) {
  const item = itemMap.get(session!.itemIds[session!.currentIndex])!, answer = currentAnswer(session!)!;
  const dest = destinations.find(d => d.id === item.destinationId)!;
  const title = answer.correct ? 'Destino certo!' : completed ? 'Vamos aprender com essa?' : 'Ainda não é este.';
  modal(title, `<div class="feedback-mark ${answer.correct ? 'success' : 'retry'}">${icon(answer.correct ? 'check' : completed ? 'book' : 'target', 45)}</div>${completed ? `<p class="earned">${answer.correct ? '+' + answer.points + ' pontos' : 'Você usou as três tentativas'}</p><strong class="correct-answer">${esc(dest.name)}</strong><p>${esc(item.explanation)}</p>` : `<p>${esc(item.hint)}</p><p><strong>Você ainda tem ${3 - answer.tried.length} tentativa${answer.tried.length === 1 ? 's' : ''}.</strong> Próximo acerto: ${[100, 60, 30][answer.tried.length]} pontos.</p>`}`, btn('feedback-next', completed ? 'Continuar' : 'Tentar novamente'), () => {
    const dialog = document.querySelector('dialog[open]')! as HTMLDialogElement;
    dialog.addEventListener('cancel', e => e.preventDefault());
    on('feedback-next', () => { dialog.close(); dialog.remove(); if (completed) { session = advance(session!); persist(); renderGame(); } else app.querySelector<HTMLButtonElement>('[data-destination]:not(:disabled)')?.focus(); });
  });
}
function pause() {
  modal('Uma pausa para respirar', `<p>${session?.mode === 'career' ? 'Seu progresso de carreira fica salvo neste aparelho.' : 'Você pode continuar agora. Ao sair, este treino será encerrado.'}</p>`, btn('resume-game', 'Continuar') + btn('exit-game', 'Voltar ao início', 'secondary'), () => {
    on('resume-game', () => document.querySelector('dialog')?.close());
    on('exit-game', () => { document.querySelector('dialog')?.close(); home(); });
  });
}
function resultScreen() {
  if (!session) return home();
  view = 'result';
  const result = summarize(session);
  shell('Resultado da fase', `<section class="result-panel"><div class="result-emblem ${result.passed ? '' : 'soft'}">${icon(result.passed ? 'check' : 'book', 52)}</div><span class="eyebrow">${result.passed ? 'MAIS UM PASSO NO CUIDADO' : 'APRENDER TAMBÉM É TENTAR DE NOVO'}</span><h1>${result.passed ? 'Fase concluída!' : 'Vamos praticar novamente?'}</h1><p>${result.passed ? 'Você atingiu os 60% necessários. Continue aprendendo!' : 'Você ainda não atingiu os 60% necessários para avançar. Na próxima tentativa, observe cada condição com calma.'}</p><div class="result-stats"><div><strong>${result.correct}/10</strong><span>itens acertados</span></div><div><strong>${result.score}</strong><span>pontos</span></div><div><strong>${result.firstTry}</strong><span>na primeira tentativa</span></div></div>${btn('result-next', session.mode === 'practice' ? 'Voltar às fases' : result.passed ? 'Continuar carreira' : 'Voltar ao início')}</section>`, false);
  on('result-next', () => {
    if (session!.mode === 'practice') { session = null; return practiceScreen(); }
    career = completePhase(career!, result); save('career', career); session = null;
    if (!result.passed) home(); else careerScreen();
  });
  document.getElementById('settings')!.hidden = true;
}
function finishCareer() {
  view = 'finish'; const candidate = careerEntry(career!); const eligible = qualifies(ranking, candidate);
  shell('Carreira concluída', `<section class="result-panel"><div class="result-emblem">${icon('trophy', 55)}</div><span class="eyebrow">TRÊS FASES. MUITOS APRENDIZADOS.</span><h1>Você fez a diferença.</h1><p>Sua carreira terminou com <strong>${candidate.score} pontos</strong>.</p>${eligible ? `<p>Você conquistou uma posição entre os 20 melhores deste aparelho!</p><form id="ranking-form"><label for="player-name">Como quer aparecer no ranking? <small>(opcional)</small></label><input id="player-name" name="name" maxlength="24" autocomplete="off" placeholder="Participante"><button class="btn primary" type="submit">Salvar e ver ranking</button></form>` : btn('finish-no-rank', 'Ver ranking')}</section>`, false);
  const finalize = (name: string) => {
    if (career!.submitted) return showRanking();
    if (eligible) { ranking = addRanking(ranking, careerEntry(career!, name)); save('ranking', ranking); }
    career = { ...career!, submitted: true }; save('career', career); showRanking(candidate.id);
  };
  document.getElementById('ranking-form')?.addEventListener('submit', e => { e.preventDefault(); finalize((document.getElementById('player-name') as HTMLInputElement).value); });
  on('finish-no-rank', () => finalize('Participante'));
}
function showRanking(highlight = '') {
  view = 'ranking';
  shell('Ranking do aparelho', `<div class="page-heading"><span class="eyebrow">CADA ACERTO CONTA</span><h1>Destinos certos.<br>Resultados para celebrar.</h1><p>As 20 melhores carreiras completas deste aparelho.</p></div><div class="ranking-table">${ranking.length ? `<table><thead><tr><th>Posição</th><th>Participante</th><th>Pontos</th><th>De primeira</th></tr></thead><tbody>${ranking.map((r, n) => `<tr class="${r.id === highlight ? 'highlight' : ''}"><td><span class="rank-number">${n < 3 ? icon('trophy', 20) : ''}${n + 1}</span></td><td>${esc(r.name)}</td><td><strong>${r.score}</strong></td><td>${r.firstTry}/30</td></tr>`).join('')}</tbody></table>` : `<div class="empty-state">${icon('trophy', 56)}<h2>Seu lugar está esperando.</h2><p>Conclua as três fases da carreira para participar.</p></div>`}</div><p class="page-note">Desempate: acertos na primeira tentativa e resultado mais antigo. Dados salvos apenas neste navegador.</p><div class="center-actions">${btn('rank-home', 'Voltar ao início', 'primary', 'home')}</div>`);
  on('rank-home', home);
}
function instructions() {
  view = 'instructions';
  shell('Como jogar', `<div class="page-heading"><span class="eyebrow">OLÁ, EU SOU A NERY</span><h1>Vamos aprender juntos?</h1><p>O cuidado começa antes do descarte.</p></div><div class="instructions-grid">${[['01', 'Observe', 'Leia o nome e a condição do item. Presença de sangue, material e conteúdo residual fazem diferença.'], ['02', 'Escolha', 'Arraste o item ou toque em um destino. Você tem três tentativas por pergunta.'], ['03', 'Aprenda', 'Acertos valem 100, 60 ou 30 pontos. Após a correção, leia a explicação antes de continuar.']].map(([n, t, p]) => `<article class="instruction-card"><span class="phase-number">${n}</span><h2>${t}</h2><p>${p}</p></article>`).join('')}</div><div class="notice"><strong>Na carreira, acerte 6 dos 10 itens para avançar.</strong><p>São três fases, sem limite de tempo. A prática por fase não altera seu ranking.</p></div><div class="center-actions">${btn('tutorial-play', 'Vamos jogar', 'primary', 'play')}</div>`);
  on('tutorial-play', modes);
}
function settings() {
  view = 'settings';
  shell('Configurações', `<div class="page-heading"><span class="eyebrow">DO SEU JEITO</span><h1>Conforto para aprender</h1></div><div class="settings-panel"><label class="setting"><span><strong>Sons do jogo</strong><small>Feedback curto de acerto e tentativa</small></span><input id="sound-toggle" type="checkbox" ${prefs.sound ? 'checked' : ''}></label><label class="setting"><span><strong>Reduzir animações</strong><small>Uma experiência com menos movimento</small></span><input id="motion-toggle" type="checkbox" ${prefs.reducedMotion ? 'checked' : ''}></label><div class="setting"><span><strong>Ranking deste aparelho</strong><small>Apagar os resultados não altera a carreira atual.</small></span>${btn('clear-ranking', 'Limpar', 'quiet')}</div><div class="notice"><strong>Instalar e usar offline</strong><p>Com internet, aguarde “Pronto para uso offline”. Use “Instalar jogo” quando disponível ou o menu do navegador para adicionar à tela inicial. O primeiro acesso precisa de conexão.</p></div><p class="page-note">Versão ${version.app} · Conteúdo ${version.content}<br>Imagens de referência para homologação. Arte 3D final em preparação.</p><img class="credits-logo" src="${base}brand/depe.png" alt="Divisão de Ensino e Pesquisa"></div>`);
  document.getElementById('sound-toggle')!.addEventListener('change', e => { prefs.sound = (e.target as HTMLInputElement).checked; setAudioEnabled(prefs.sound); save('preferences', prefs); updateStatus(); });
  document.getElementById('motion-toggle')!.addEventListener('change', e => { prefs.reducedMotion = (e.target as HTMLInputElement).checked; document.documentElement.classList.toggle('reduce-motion', prefs.reducedMotion); save('preferences', prefs); updateStatus(); });
  on('clear-ranking', () => modal('Limpar o ranking?', '<p>Os resultados salvos neste aparelho serão apagados. Esta ação não pode ser desfeita.</p>', btn('cancel-clear', 'Cancelar', 'secondary') + btn('confirm-clear', 'Limpar ranking'), () => {
    on('cancel-clear', () => document.querySelector('dialog')?.close());
    on('confirm-clear', () => { ranking = []; save('ranking', ranking); document.querySelector('dialog')?.close(); settings(); });
  }));
}
home();
