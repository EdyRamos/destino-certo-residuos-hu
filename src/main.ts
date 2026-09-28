import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { items, destinations, levels, itemMap, pendingContent } from './data';
import version from './data/version.json';
import type { Answer, Career, SessionState, WasteItem } from './types';
import { createSession, applyAnswer, advance, currentAnswer, summarize } from './game/session';
import { newCareer, completePhase, careerEntry, addRanking, qualifies } from './game/career';
import { stars, currentStreak, phaseAchievements } from './game/achievements';
import { chapters, cheers, streakLine } from './game/story';
import { loadCareer, loadRanking, loadPreferences, loadAlbum, save, storageFailed } from './storage/local';
import { playCorrect, playWrong, playSfx, setAudioEnabled, setMusicEnabled, setAudioPaused, setMusicDucked, setMusicTheme, unlockAudio } from './ui/audio';
import { burstConfetti } from './ui/confetti';
import { enablePointerDrag } from './ui/drag';
import { base, esc, logo, icon, itemArt, destinationArt, neryImg, neryAvatar, artUrl, medal, type MedalKey, type Pose } from './ui/common';
import { reduced, wait, flyItem, pulse, floatText, sparkle, countUp, typewriter, confettiRain } from './ui/fx';

const app = document.querySelector<HTMLDivElement>('#app')!;
let career: Career | null = loadCareer();
let ranking = loadRanking();
let prefs = loadPreferences();
let album = new Set(loadAlbum());
let session: SessionState | null = null;
let view = 'home', shownView = '', offlineReady = false, updateReady = false, busy = false, shownPoints = 0;
let installPrompt: (Event & { prompt(): Promise<void> }) | null = null;
const cleanups: (() => void)[] = [];
const enabledItems = items.filter(i => i.enabled);
setAudioEnabled(prefs.sound);
setMusicEnabled(prefs.music);
document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });
document.documentElement.classList.toggle('reduce-motion', prefs.reducedMotion);

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
const later = (ms: number, fn: () => void) => { const t = setTimeout(fn, reduced() ? 0 : ms); cleanups.push(() => clearTimeout(t)); };
const points = (s: SessionState) => s.answers.reduce((n, a) => n + a.points, 0);
const phaseOf = (s: SessionState) => levels.findIndex(l => l.id === s.levelId);
const starRow = (n: number, size = 20) => `<span class="stars-row" aria-label="${n} de 3 estrelas">${[0, 1, 2].map(i => `<span class="star ${i < n ? 'filled' : ''}" style="--i:${i}">${icon('star', size)}</span>`).join('')}</span>`;
const pageHead = (title: string, sub = '', aside = '') => `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${aside}</div>`;
const tile = (id: string, glyph: string, label: string, badge = '') => `<button id="${id}" class="tile">${icon(glyph, 26)}<span>${label}</span>${badge ? `<span class="pill">${badge}</span>` : ''}</button>`;
const medalCard = (key: MedalKey, title: string, text: string, n = 0) => `<div class="medal-card" style="--i:${n}">${medal(key)}<strong>${esc(title)}</strong><small>${esc(text)}</small></div>`;
function persist() { if (session?.mode === 'career' && career) career.session = session; save('career', career); updateStatus(); }
function learn(item: WasteItem) { if (!album.has(item.id)) { album.add(item.id); save('album', [...album]); } }
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
function shell(_title: string, content: string, back = true, kind = '', scene = 'bg-home') {
  cleanups.splice(0).forEach(stop => stop());
  document.querySelector('.drag-ghost')?.remove();
  setMusicTheme(kind === 'game' ? 'game' : kind === 'finale' ? 'finale' : 'menu');
  // Absolute URL: a relative url() inside a custom property resolves against the stylesheet folder.
  const relative = artUrl(scene), bg = relative && new URL(relative, document.baseURI).href, entering = view !== shownView; shownView = view;
  app.innerHTML = `<div class="app-shell ${kind}${bg ? ' has-scene' : ''}"${bg ? ` style="--scene:url('${bg}')"` : ''}><header class="header">${back ? `<button id="back" class="icon-btn" aria-label="Voltar ao início">${icon('back')}</button>` : ''}${logo()}<span class="header-space"></span>${musicButton()}<button id="settings" class="icon-btn" aria-label="Configurações">${icon('settings')}</button></header><main id="main" tabindex="-1"${entering ? ' class="screen-in"' : ''}>${content}</main><footer><span class="status-dot"></span><span id="status" role="status"></span><span class="validation">${pendingContent ? 'Conteúdo em validação' : 'Conteúdo homologado'}</span><span id="system-actions"></span></footer><p id="storage-warning" class="storage-warning" role="status" hidden></p></div>`;
  on('back', () => { playSfx('click'); home(); }); on('settings', settings); updateStatus();
  bindMusic();
  document.getElementById('main')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function musicButton() {
  const label = prefs.music ? 'Música ligada. Toque para desligar' : 'Música desligada. Toque para ligar';
  return `<button id="music-quick" class="icon-btn music-toggle ${prefs.music ? 'on' : ''}" aria-pressed="${prefs.music}" aria-label="${label}" title="${label}">${icon(prefs.music ? 'music' : 'musicOff', 22)}</button>`;
}
function bindMusic() { on('music-quick', () => { prefs.music = !prefs.music; unlockAudio(); setMusicEnabled(prefs.music); save('preferences', prefs); document.getElementById('music-quick')!.outerHTML = musicButton(); bindMusic(); }); }
function modal(title: string, content: string, actions: string, bind: () => void, kind = '') {
  const el = document.createElement('dialog'); el.className = 'modal ' + kind; el.setAttribute('aria-label', title);
  el.innerHTML = `<h2>${title}</h2>${content}<div class="modal-actions">${actions}</div>`;
  setMusicDucked(true);
  document.body.append(el); el.addEventListener('close', () => { el.remove(); setMusicDucked(!!document.querySelector('dialog[open]')); }); el.showModal(); bind();
}
function speechCycle(id: string, lines: readonly string[], every = 5200) {
  const el = document.getElementById(id); if (!el) return;
  let n = 0, cancel = typewriter(el, lines[0]);
  const timer = setInterval(() => { cancel(); n = (n + 1) % lines.length; cancel = typewriter(el, lines[n]); }, every);
  cleanups.push(() => { clearInterval(timer); cancel(); });
}
function home() {
  view = 'home'; session = null;
  const ongoing = career && !career.submitted;
  shell('', `<section class="hero"><div class="hero-copy"><h1 class="hero-title">Destino <span>Certo</span></h1><p class="hero-sub">Resíduos HU</p><p class="tagline">Aprender hoje. Um hospital mais seguro amanhã.</p><div class="home-actions">${btn('play', 'Jogar', 'primary big', 'play')}${ongoing ? btn('resume', 'Continuar carreira', 'secondary big', 'route') : ''}</div><nav class="home-links" aria-label="Mais opções">${tile('instructions', 'book', 'Como jogar')}${tile('album', 'grid', 'Coleção', `${album.size}/${enabledItems.length}`)}${tile('ranking', 'trophy', 'Ranking')}</nav><img class="home-credits" src="${base}brand/depe.png" alt="Divisão de Ensino e Pesquisa"></div><figure class="hero-art"><div class="platform"></div>${neryImg('wave')}<figcaption class="speech hero-speech"><b>Nery</b><span id="hero-speech"></span></figcaption></figure></section>`, false, 'home');
  speechCycle('hero-speech', ['Olá! Vamos começar o plantão?', 'Cada item tem um destino certo.', 'Observe, escolha e aprenda comigo!']);
  on('play', () => { playSfx('click'); modes(); }); on('instructions', instructions); on('album', albumScreen); on('ranking', () => showRanking()); on('resume', careerScreen);
}
function modes() {
  view = 'modes';
  shell('Vamos começar', `${pageHead('Como você quer jogar?', 'Não há cronômetro. A carreira vale para o ranking; o treino livre serve só para praticar.')}<div class="mode-grid"><button id="career" class="mode-card green"><span class="mode-symbol">${icon('route', 46)}</span><h2>Carreira</h2><p>Três capítulos de um plantão, em sequência. Ganhe estrelas e medalhas e entre no ranking do aparelho.</p><span class="card-link">Iniciar jornada ${icon('arrow')}</span></button><button id="practice" class="mode-card blue"><span class="mode-symbol">${icon('target', 46)}</span><h2>Treino livre</h2><p>Escolha um capítulo para praticar. Aprenda no seu ritmo, sem alterar sua carreira nem o ranking.</p><span class="card-link">Escolher capítulo ${icon('arrow')}</span></button></div>`);
  on('career', () => { playSfx('click'); careerScreen(); }); on('practice', () => { playSfx('click'); practiceScreen(); });
}
function careerScreen() {
  view = 'career';
  if (!career) { career = newCareer(); save('career', career); }
  if (career.results.length === 3 && !career.submitted) return finishCareer();
  const done = career.results.length, total = career.results.reduce((n, r) => n + stars(r), 0);
  shell('Modo carreira', `${pageHead('Carreira', 'Acerte pelo menos 6 de 10 itens para liberar o próximo capítulo.', `<span class="stat-chip">${icon('star', 20)} ${total}/9 estrelas</span>`)}<div class="phase-grid journey-map">${levels.map((l, n) => {
    const r = career!.results[n], state = n < done ? 'done' : n === done ? 'current' : 'locked', here = n === done && !career!.submitted;
    return `<button class="phase-card station ${state} ${n > done ? 'locked' : ''}" data-phase="${n}" ${n !== done || career!.submitted ? 'disabled' : ''}>${here ? `<span class="you-are-here">${neryAvatar('wave')}<small>Você está aqui</small></span>` : ''}<span class="phase-number">${n < done ? icon('check', 32) : n > done ? icon('lock', 26) : '0' + (n + 1)}</span><span class="card-kicker">Capítulo ${n + 1} · ${chapters[n].place}</span><h2>${l.name}</h2><p>${l.description}</p>${r ? starRow(stars(r)) : ''}<span class="phase-detail">${r ? r.score + ' pontos · concluída' : n > done ? 'Conclua o capítulo anterior' : career!.session ? 'Continuar capítulo' : '10 itens · até 1.000 pontos'}</span></button>`;
  }).join('')}</div><div class="center-actions">${btn('new-career', 'Nova carreira', 'secondary')}</div><p class="page-note">Novo participante? Comece uma nova carreira; o ranking e a coleção da equipe continuam salvos.</p>`);
  app.querySelectorAll<HTMLButtonElement>('[data-phase]').forEach(b => b.addEventListener('click', () => startPhase(Number(b.dataset.phase), 'career')));
  on('new-career', () => modal('Começar uma nova carreira?', '<p>O progresso desta carreira será reiniciado. O ranking, a coleção e as preferências ficam salvos.</p>', btn('cancel-new', 'Voltar', 'secondary') + btn('confirm-new', 'Começar'), () => {
    on('cancel-new', () => document.querySelector('dialog')?.close());
    on('confirm-new', () => { document.querySelector('dialog')?.close(); career = newCareer(); save('career', career); careerScreen(); });
  }));
}
function practiceScreen() {
  view = 'practice';
  shell('Treino livre', `${pageHead('Treino livre', 'Escolha um capítulo. Os pontos não entram no ranking, mas os itens acertados entram na coleção.')}<div class="phase-grid">${levels.map((l, n) => `<button class="phase-card" data-practice="${n}"><span class="phase-number">0${n + 1}</span><span class="card-kicker">Capítulo ${n + 1} · ${chapters[n].place}</span><h2>${l.name}</h2><p>${l.description}</p><span class="card-link">Praticar ${icon('arrow')}</span></button>`).join('')}</div>`);
  app.querySelectorAll<HTMLButtonElement>('[data-practice]').forEach(b => b.addEventListener('click', () => startPhase(Number(b.dataset.practice), 'practice')));
}
function startPhase(index: number, mode: SessionState['mode']) {
  if (mode === 'career' && (!career || index !== career.results.length || career.submitted)) return;
  playSfx('click');
  try {
    const resuming = mode === 'career' && !!career?.session;
    session = resuming ? career!.session! : createSession(levels[index], items, mode, mode === 'career' ? career!.results.flatMap(r => r.itemIds) : []);
    shownPoints = points(session);
    if (mode === 'career') persist();
    if (resuming) renderGame(); else missionScreen(index);
  } catch (e) { modal('Capítulo indisponível', `<p>${esc(String(e))}</p>`, btn('close-error', 'Voltar'), () => on('close-error', () => document.querySelector('dialog')?.close())); }
}
function missionScreen(index: number) {
  view = 'mission';
  const chapter = chapters[index];
  shell('Missão com Nery', `<section class="mission-panel"><div class="mission-character">${neryImg('explain')}</div><div class="mission-copy"><p class="card-kicker">Capítulo ${index + 1} · ${chapter.place}</p><h1>${chapter.title}</h1><div class="speech mission-speech"><p id="nery-line"></p><div class="speech-nav"><span class="speech-dots">${chapter.lines.map((_, n) => `<i data-dot="${n}"></i>`).join('')}</span><button id="dialogue-next" class="text-button">Continuar conversa ${icon('arrow', 18)}</button></div></div><div class="mission-focus"><strong>Sua missão</strong><p>${chapter.focus}</p></div><p class="mission-rules">10 itens · 3 tentativas por item · sem cronômetro</p>${btn('mission-start', 'Começar missão', 'primary', 'play')}</div></section>`, true, 'mission', `bg-cap${index + 1}`);
  let line = 0, cancel = () => {};
  const show = () => {
    cancel(); cancel = typewriter(document.getElementById('nery-line')!, chapter.lines[line]);
    app.querySelectorAll<HTMLElement>('[data-dot]').forEach(d => d.classList.toggle('on', Number(d.dataset.dot) <= line));
    document.getElementById('dialogue-next')!.hidden = line >= chapter.lines.length - 1;
  };
  cleanups.push(() => cancel());
  show();
  on('dialogue-next', () => { playSfx('click'); line = Math.min(line + 1, chapter.lines.length - 1); show(); });
  on('mission-start', () => { playSfx('whoosh'); renderGame(); });
}
function trackDot(a: Answer | undefined, current: boolean) {
  if (!a?.completed) return current ? 'current' : '';
  return a.correct ? (a.tried.length === 1 ? 'first' : 'retry') : 'miss';
}
function renderGame() {
  if (!session) return home();
  if (session.finished) return resultScreen();
  view = 'game';
  const s = session, item = itemMap.get(s.itemIds[s.currentIndex])!, answer = currentAnswer(s);
  const phase = phaseOf(s), chapter = chapters[phase], attempts = answer?.tried.length ?? 0;
  const streak = currentStreak(s.answers), correct = s.answers.filter(a => a.correct).length;
  const tip = streak >= 3 ? streakLine(streak) : chapter.tips[s.currentIndex % chapter.tips.length];
  shell('', `<div class="game-top"><button id="pause" class="icon-btn" aria-label="Pausar partida">${icon('pause')}</button><div class="phase-progress"><span><span>${s.mode === 'practice' ? 'Treino · ' : ''}Capítulo ${phase + 1}<span class="place"> · ${chapter.place}</span></span><strong>Item ${s.currentIndex + 1} de 10</strong></span><div class="track" aria-hidden="true">${s.itemIds.map((_, n) => `<i class="${trackDot(s.answers[n], n === s.currentIndex)}"></i>`).join('')}</div></div><div class="hud-right">${streak >= 2 ? `<span class="streak" title="Acertos seguidos na primeira tentativa">${icon('flame', 18)}<b>${streak}</b></span>` : ''}<div class="points">${icon('star', 32)}<strong id="points">${shownPoints}</strong><span>pontos</span></div></div></div><div class="mission-meter"><span>${correct} ${correct === 1 ? 'acerto' : 'acertos'} · meta 6${s.mode === 'career' ? ' para avançar' : ''}</span><span class="meter"><i style="width:${Math.min(100, correct / 6 * 100)}%"></i></span></div><section class="question-area"><div class="item-stage"><div id="waste-card" class="waste-card">${itemArt(item)}</div><span class="stage-shadow"></span></div><div class="question-copy"><h1>${esc(item.name)}</h1><p class="condition">${esc(item.condition)}</p><div class="chances" aria-label="Tentativa ${attempts + 1} de 3, vale ${[100, 60, 30][attempts]} pontos"><span class="try-pips" aria-hidden="true">${[0, 1, 2].map(n => `<span class="${n < attempts ? 'used' : n === attempts ? 'now' : ''}">${n < attempts ? '×' : n + 1}</span>`).join('')}</span><span class="stake">Tentativa ${attempts + 1} de 3 · vale <b>${[100, 60, 30][attempts]}</b> pontos</span></div><div class="nery-tip">${neryAvatar('thinking')}<p class="speech">${esc(tip)}</p></div></div></section>${s.currentIndex < 2 && !attempts ? `<p class="play-instruction">${icon('hand', 20)} Arraste o item até o destino ou toque no destino</p>` : ''}<section class="destinations" aria-label="Destinos">${destinations.map(d => `<button class="destination" data-destination="${d.id}" ${answer?.completed || answer?.tried.includes(d.id) ? 'disabled' : ''}>${destinationArt(d)}<strong>${esc(d.name)}</strong></button>`).join('')}</section><p class="game-footnote">Considere sempre a condição descrita. Roupa reutilizável segue para a lavanderia.</p>`, false, 'game', `bg-cap${phase + 1}`);
  document.getElementById('settings')!.hidden = true;
  on('pause', pause);
  app.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach(b => b.addEventListener('click', () => void answerItem(b.dataset.destination!)));
  if (!answer?.completed) enablePointerDrag(document.getElementById('waste-card')!, d => void answerItem(d), () => playSfx('pickup'));
  if (answer?.completed) feedback(true);
  else if (attempts) feedback(false);
}
async function answerItem(destination: string) {
  if (!session || busy || document.querySelector('dialog[open]')) return;
  const item = itemMap.get(session.itemIds[session.currentIndex])!;
  const next = applyAnswer(session, destination, item); if (next === session) return;
  session = next; persist();
  const answer = currentAnswer(session)!;
  if (answer.correct) learn(item);
  busy = true;
  try { await celebrate(item, destination, answer); } finally { busy = false; }
  renderGame();
  if (answer.correct && !reduced()) burstConfetti(app);
}
// Plays the answer on the current screen before the feedback dialog opens.
async function celebrate(item: WasteItem, destination: string, answer: Answer) {
  const art = document.querySelector('#waste-card .item-art') ?? document.getElementById('waste-card');
  const bin = app.querySelector(`[data-destination="${destination}"]`), card = document.getElementById('waste-card');
  if (answer.correct) {
    playCorrect();
    card?.classList.add('flown');
    if (art && bin) await flyItem(art, bin, 'in');
    if (bin) { pulse(bin, 'gulp'); sparkle(bin); floatText('+' + answer.points, bin, 'gain'); }
    const total = points(session!), el = document.getElementById('points');
    if (el) cleanups.push(countUp(el, shownPoints, total, 650, () => playSfx('count')));
    shownPoints = total;
    await wait(520);
    return;
  }
  playWrong();
  if (art && bin) await flyItem(art, bin, 'bounce');
  if (bin) { pulse(bin, 'shake'); floatText('×', bin, 'miss'); }
  if (answer.completed) {
    const right = app.querySelector(`[data-destination="${item.destinationId}"]`);
    if (right) { right.classList.add('reveal'); await wait(260); card?.classList.add('flown'); if (art) await flyItem(art, right, 'in'); pulse(right, 'gulp'); }
  }
  await wait(220);
}
function feedback(completed: boolean) {
  const s = session!, item = itemMap.get(s.itemIds[s.currentIndex])!, answer = currentAnswer(s)!;
  const dest = destinations.find(d => d.id === item.destinationId)!;
  const pose: Pose = answer.correct ? 'celebrate' : completed ? 'encourage' : 'thinking';
  const title = answer.correct ? 'Destino certo!' : completed ? 'Vamos aprender com essa?' : 'Ainda não é este.';
  const body = completed
    ? `${answer.correct ? `<p class="cheer">${cheers[s.currentIndex % cheers.length]}</p>` : ''}<p class="earned ${answer.correct ? '' : 'zero'}">${answer.correct ? '+' + answer.points + ' pontos' : 'Você usou as três tentativas'}</p><div class="pairing" aria-label="${esc(item.name)} vai para ${esc(dest.name)}"><span class="pair-art">${itemArt(item)}</span>${icon('arrow', 28)}<span class="pair-art">${destinationArt(dest)}</span></div><p class="pair-names"><span>${esc(item.name)}</span><strong class="correct-answer">${esc(dest.name)}</strong></p><p class="explanation">${esc(item.explanation)}</p>`
    : `<p class="hint">${icon('bulb', 22)}<span>${esc(item.hint)}</span></p><p><strong>Você ainda tem ${3 - answer.tried.length} tentativa${answer.tried.length === 1 ? 's' : ''}.</strong> Próximo acerto: ${[100, 60, 30][answer.tried.length]} pontos.</p>`;
  modal(title, `<div class="feedback-layout"><div class="feedback-nery">${neryImg(pose)}</div><div class="feedback-body">${body}</div></div>`, btn('feedback-next', completed ? 'Continuar' : 'Tentar novamente'), () => {
    const dialog = document.querySelector('dialog[open]')! as HTMLDialogElement;
    dialog.addEventListener('cancel', e => e.preventDefault());
    on('feedback-next', () => {
      playSfx('click'); dialog.close(); dialog.remove();
      if (completed) { session = advance(session!); persist(); renderGame(); } else app.querySelector<HTMLButtonElement>('[data-destination]:not(:disabled)')?.focus();
    });
  }, 'feedback ' + (answer.correct ? 'is-correct' : completed ? 'is-missed' : 'is-hint'));
}
function pause() {
  if (busy) return;
  modal('Jogo pausado', `<div class="pause-nery">${neryImg('encourage')}</div><p>${session?.mode === 'career' ? 'Seu progresso de carreira fica salvo neste aparelho.' : 'Você pode continuar agora. Ao sair, este treino será encerrado.'}</p>`, btn('resume-game', 'Continuar') + btn('exit-game', 'Voltar ao início', 'secondary'), () => {
    setAudioPaused(true);
    document.querySelector('dialog')?.addEventListener('close', () => setAudioPaused(false));
    on('resume-game', () => document.querySelector('dialog')?.close());
    on('exit-game', () => { document.querySelector('dialog')?.close(); home(); });
  });
}
function countStats() {
  app.querySelectorAll<HTMLElement>('[data-count]').forEach((el, n) => {
    const to = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
    el.textContent = '0' + suffix;
    later(250 + n * 180, () => cleanups.push(countUp(el, 0, to, 900, () => playSfx('count'), v => v + suffix)));
  });
}
function resultScreen() {
  if (!session) return home();
  view = 'result';
  const result = summarize(session), phase = phaseOf(session), chapter = chapters[phase], earned = stars(result);
  const achievements = phaseAchievements(session);
  const review = session.answers.filter(a => a.tried.length > 1 || !a.correct).map(a => itemMap.get(a.itemId)!);
  const recap = review.length ? `<div class="learning-review"><h2>Para revisar</h2><p>Itens que pediram mais de uma tentativa.</p>${review.map(item => `<details><summary>${esc(item.name)}</summary><p>${esc(item.condition)}</p><strong>${esc(destinations.find(d => d.id === item.destinationId)!.name)}</strong><p>${esc(item.explanation)}</p></details>`).join('')}</div>` : '<p class="perfect-note">Todos os itens certos na primeira tentativa.</p>';
  const medals = [...(result.passed ? [medalCard(`cap${phase + 1}` as MedalKey, chapter.badge, 'Conquista do capítulo')] : []), ...achievements.map((a, n) => medalCard(a.id, a.title, a.description, n + 1))];
  shell('Resultado do capítulo', `<section class="result-panel"><div class="result-hero"><div class="result-nery">${neryImg(result.passed ? 'celebrate' : 'encourage')}</div><div class="result-copy"><p class="card-kicker">Capítulo ${phase + 1} · ${chapter.place}${session.mode === 'practice' ? ' · treino' : ''}</p><h1>${result.passed ? 'Capítulo concluído!' : 'Vamos praticar novamente?'}</h1><p>${result.passed ? 'Você acertou pelo menos 6 dos 10 itens.' : 'Faltou pouco: são necessários 6 acertos em 10. Na próxima vez, observe cada condição com calma.'}</p></div></div>${result.passed ? `<div class="result-stars">${starRow(earned, 46)}<small>1 estrela: aprovado · 2: 8 acertos · 3: 10 acertos e 900 pontos</small></div>` : ''}<div class="result-stats"><div><strong data-count="${result.correct}" data-suffix="/10">${result.correct}/10</strong><span>itens acertados</span></div><div><strong data-count="${result.score}">${result.score}</strong><span>pontos</span></div><div><strong data-count="${result.firstTry}">${result.firstTry}</strong><span>na primeira tentativa</span></div></div>${medals.length ? `<div class="medals">${medals.join('')}</div>` : ''}${result.passed ? `<p class="chapter-closing">${chapter.closing}</p>` : ''}${recap}${btn('result-next', session.mode === 'practice' ? 'Voltar ao treino' : result.passed ? 'Continuar carreira' : 'Voltar ao início')}</section>`, false, '', `bg-cap${phase + 1}`);
  countStats();
  if (result.passed) {
    playSfx('fanfare'); later(300, () => burstConfetti(app));
    app.querySelectorAll('.result-stars .star.filled').forEach((_, n) => later(700 + n * 380, () => playSfx('star')));
    if (medals.length) later(1900, () => playSfx('badge'));
  } else playSfx('soft');
  on('result-next', () => {
    playSfx('click');
    if (session!.mode === 'practice') { session = null; return practiceScreen(); }
    career = completePhase(career!, result); save('career', career); session = null;
    if (!result.passed) home(); else careerScreen();
  });
  document.getElementById('settings')!.hidden = true;
}
function finishCareer() {
  view = 'finish'; const candidate = careerEntry(career!); const eligible = qualifies(ranking, candidate);
  const total = career!.results.reduce((n, r) => n + stars(r), 0);
  shell('Carreira concluída', `<section class="result-panel finale-panel"><div class="result-hero"><div class="result-nery">${neryImg('trophy')}</div><div class="result-copy"><p class="card-kicker">Três capítulos do plantão</p><h1>Carreira concluída!</h1><p>Você terminou com <strong><span data-count="${candidate.score}">${candidate.score}</span> pontos</strong> e <strong>${total}/9 estrelas</strong>.</p></div></div><div class="medals">${medalCard('career', 'Carreira completa', 'Os três capítulos do plantão concluídos')}</div>${eligible ? `<p>Você conquistou uma posição entre os 20 melhores deste aparelho!</p><form id="ranking-form"><label for="player-name">Como quer aparecer no ranking? <small>(opcional)</small></label><input id="player-name" name="name" maxlength="24" autocomplete="off" placeholder="Participante"><button class="btn primary" type="submit">Salvar e ver ranking</button></form>` : btn('finish-no-rank', 'Ver ranking')}</section>`, false, 'finale');
  countStats(); playSfx('fanfare'); confettiRain(app); later(1200, () => playSfx('badge'));
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
  shell('Ranking do aparelho', `${pageHead('Ranking do aparelho', 'As 20 melhores carreiras concluídas neste aparelho. Empate: vence quem acertou mais na primeira tentativa e, depois, o resultado mais antigo.')}<div class="ranking-table">${ranking.length ? `<table><thead><tr><th>Posição</th><th>Participante</th><th>Pontos</th><th>De primeira</th></tr></thead><tbody>${ranking.map((r, n) => `<tr class="${r.id === highlight ? 'highlight' : ''}"><td><span class="rank-number">${n < 3 ? icon('trophy', 20) : ''}${n + 1}</span></td><td>${esc(r.name)}</td><td><strong>${r.score}</strong></td><td>${r.firstTry}/30</td></tr>`).join('')}</tbody></table>` : `<div class="empty-state">${icon('trophy', 56)}<h2>Nenhuma carreira concluída ainda</h2><p>Conclua os três capítulos da carreira para aparecer aqui.</p></div>`}</div><p class="page-note">Os resultados ficam salvos só neste navegador.</p><div class="center-actions">${btn('rank-home', 'Voltar ao início', 'primary', 'home')}</div>`);
  on('rank-home', home);
}
function albumScreen() {
  view = 'album';
  const learned = enabledItems.filter(i => album.has(i.id)).length, pct = Math.round(learned / enabledItems.length * 100);
  shell('Coleção da equipe', `${pageHead('Coleção da equipe', 'Itens que já receberam o destino certo neste aparelho. Toque em um item para rever a explicação.')}<div class="album-progress"><strong class="album-count">${learned}/${enabledItems.length}</strong><span class="meter"><i style="width:${pct}%"></i></span><small>${pct}% descoberto</small></div><div class="album-grid">${enabledItems.map(i => album.has(i.id)
    ? `<button class="album-card" data-album="${i.id}">${itemArt(i)}<span>${esc(i.name)}</span></button>`
    : `<div class="album-card locked" role="img" aria-label="Item ainda não descoberto"><span class="mystery">${i.image ? `<img class="silhouette" src="${base + esc(i.image)}" alt="" draggable="false">` : ''}<b>?</b></span><span>Item ${enabledItems.indexOf(i) + 1}</span></div>`).join('')}</div><div class="center-actions">${btn('album-home', 'Voltar ao início', 'primary', 'home')}</div>`);
  on('album-home', home);
  app.querySelectorAll<HTMLButtonElement>('[data-album]').forEach(b => b.addEventListener('click', () => {
    const item = itemMap.get(b.dataset.album!)!, dest = destinations.find(d => d.id === item.destinationId)!;
    playSfx('click');
    modal(esc(item.name), `<div class="album-detail">${itemArt(item)}<p>${esc(item.condition)}</p><div class="answer-dest">${destinationArt(dest)}<strong>${esc(dest.name)}</strong></div><p>${esc(item.explanation)}</p></div>`, btn('close-album', 'Fechar'), () => on('close-album', () => document.querySelector('dialog')?.close()));
  }));
}
function instructions() {
  view = 'instructions';
  shell('Como jogar', `${pageHead('Como jogar', 'Três passos, sem cronômetro.', `<figure class="head-nery">${neryAvatar('explain')}<figcaption class="speech">Olá, eu sou a Nery. Vou acompanhar você no plantão.</figcaption></figure>`)}<div class="instructions-grid">${[['1', 'Observe', 'Leia o nome e a condição do item. Presença de sangue, material e conteúdo residual fazem diferença.'], ['2', 'Escolha', 'Arraste o item até um destino ou toque nele. Você tem três tentativas por pergunta.'], ['3', 'Aprenda', 'Acertos valem 100, 60 ou 30 pontos. Leia a explicação, ganhe estrelas e complete a coleção da equipe.']].map(([n, t, p]) => `<article class="instruction-card"><span class="phase-number">${n}</span><h2>${t}</h2><p>${p}</p></article>`).join('')}</div><div class="notice"><strong>Na carreira, acerte 6 dos 10 itens para avançar.</strong><p>São três capítulos, sem limite de tempo. Estrelas e medalhas celebram o seu cuidado, sem mudar a pontuação. O treino livre não altera seu ranking.</p></div><div class="center-actions">${btn('tutorial-play', 'Vamos jogar', 'primary', 'play')}</div>`);
  on('tutorial-play', modes);
}
function settings() {
  view = 'settings';
  shell('Configurações', `${pageHead('Configurações')}<div class="settings-panel"><label class="setting"><span><strong>Sons do jogo</strong><small>Efeitos de acerto, tentativa, estrelas e medalhas</small></span><input id="sound-toggle" type="checkbox" ${prefs.sound ? 'checked' : ''}></label><label class="setting"><span><strong>Música ambiente</strong><small>Trilha original com temas para menu, jogo e final; começa após o primeiro toque</small></span><input id="music-toggle" type="checkbox" ${prefs.music ? 'checked' : ''}></label><label class="setting"><span><strong>Reduzir animações</strong><small>Desliga voo dos itens, confete e contagens</small></span><input id="motion-toggle" type="checkbox" ${prefs.reducedMotion ? 'checked' : ''}></label><div class="setting"><span><strong>Ranking deste aparelho</strong><small>Apagar os resultados não altera a carreira atual.</small></span>${btn('clear-ranking', 'Limpar', 'quiet')}</div><div class="setting"><span><strong>Coleção da equipe</strong><small>${album.size} itens descobertos neste aparelho.</small></span>${btn('clear-album', 'Limpar', 'quiet')}</div><div class="notice"><strong>Instalar e usar offline</strong><p>Com internet, aguarde “Pronto para uso offline”. Use “Instalar jogo” quando disponível ou o menu do navegador para adicionar à tela inicial. O primeiro acesso precisa de conexão.</p></div><p class="page-note">Versão ${version.app} · Conteúdo ${version.content}<br>Conteúdo e representação dos coletores em validação pelo DEPE.</p><img class="credits-logo" src="${base}brand/depe.png" alt="Divisão de Ensino e Pesquisa"></div>`);
  document.getElementById('settings')!.hidden = true;
  document.getElementById('sound-toggle')!.addEventListener('change', e => { prefs.sound = (e.target as HTMLInputElement).checked; setAudioEnabled(prefs.sound); save('preferences', prefs); playSfx('click'); updateStatus(); });
  document.getElementById('music-toggle')!.addEventListener('change', e => { prefs.music = (e.target as HTMLInputElement).checked; unlockAudio(); setMusicEnabled(prefs.music); save('preferences', prefs); settings(); });
  document.getElementById('motion-toggle')!.addEventListener('change', e => { prefs.reducedMotion = (e.target as HTMLInputElement).checked; document.documentElement.classList.toggle('reduce-motion', prefs.reducedMotion); save('preferences', prefs); updateStatus(); });
  const confirmClear = (id: string, title: string, text: string, clear: () => void) => on(id, () => modal(title, `<p>${text}</p>`, btn('cancel-clear', 'Cancelar', 'secondary') + btn('confirm-clear', 'Limpar'), () => {
    on('cancel-clear', () => document.querySelector('dialog')?.close());
    on('confirm-clear', () => { clear(); document.querySelector('dialog')?.close(); settings(); });
  }));
  confirmClear('clear-ranking', 'Limpar o ranking?', 'Os resultados salvos neste aparelho serão apagados. Esta ação não pode ser desfeita.', () => { ranking = []; save('ranking', ranking); });
  confirmClear('clear-album', 'Limpar a coleção?', 'Os itens descobertos neste aparelho voltarão a ficar ocultos. Esta ação não pode ser desfeita.', () => { album = new Set(); save('album', []); });
}
home();
