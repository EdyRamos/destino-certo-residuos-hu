# Relatório de implementação — Destino Certo: Resíduos HU-UEL

**Data:** 25/09/2026 · **App** 0.9.0 · **Conteúdo** `2026-09-25-homolog-1` · **Regras** `attempts-100-60-30-v1`

**Situação:** pronto para **homologação interna**. Não está pronto para produção: o conteúdo ainda não foi aprovado pelo DEPE e a arte final 3D não foi produzida.

Plano de referência: `PLANO_IMPLEMENTACAO.md`. Registro passo a passo: `ACOMPANHAMENTO_IMPLEMENTACAO.md`.

## 1. O que foi entregue

| Entrega | Onde |
|---|---|
| Jogo PWA (Vite + TypeScript, sem framework, sem backend) | `src/`, build em `dist/` |
| Motor de tentativas, fases e carreira | `src/game/session.ts`, `src/game/career.ts`, `src/game/scoring.ts` |
| Persistência versionada e validada (carreira, ranking, preferências) | `src/storage/local.ts` |
| Interface: início, modos, fases, jogo, feedback, pausa, resultado, ranking, orientações, configurações | `src/main.ts`, `src/styles.css`, `src/ui/` |
| Gabarito independente para apresentação (HTML único, offline, por `file://`) | gerador `scripts/build-guide.mjs` → `output/gabarito/Destino-Certo-Gabarito-DEPE.html` |
| Planilha de revisão do DEPE e importador validado | `docs/CONTEUDO_PARA_VALIDACAO.csv`, `scripts/review.mjs` |
| Revisão preliminar do conteúdo e casos suspensos | `docs/REVISAO_CONTEUDO.md` (cumpre o papel de `docs/ISSUES_CONTENT.md` pedido no prompt inicial) |
| Situação dos assets e prompts de produção | `docs/ASSETS_PENDENTES.md` |
| Instruções de instalação, revisão e publicação | `docs/COMO_VALIDAR_E_PUBLICAR.md` |
| Workflow manual do GitHub Pages (não executado) | `.github/workflows/pages.yml` |

## 2. Regras implementadas

As regras seguem o plano aprovado, que substitui as regras de sequência/bônus do prompt inicial e do `docs/01_GDD_GAME_DESIGN.md`.

- **Carreira:** três fases sequenciais, com dez perguntas por fase e sem cronômetro.
- **Tentativas:** até três por pergunta, valendo **100, 60 e 30** pontos. Após o terceiro erro, a pergunta vale 0. Destinos já tentados ficam bloqueados na pergunta. Não há bônus de sequência.
- **Durante as tentativas:** o jogo mostra uma dica sem revelar a resposta. Após o acerto ou o terceiro erro, mostra o destino e a explicação, e só avança pelo botão “Continuar”.
- **Aprovação:** 6 ou mais acertos entre 10, em qualquer tentativa. O resultado mostra separadamente os acertos, os pontos e os acertos na primeira tentativa.
- **Reprovação:** as fases já aprovadas são mantidas. Ao repetir, a pontuação anterior da fase é descartada e uma nova sequência é sorteada.
- **Prática:** qualquer fase pode ser praticada sem alterar a carreira ou o ranking.
- **Sorteio:** não repete itens dentro da fase. Distribui os itens entre os destinos e adia itens já vistos em fases anteriores da carreira. A fase 2 mantém os pares `white_13`/`black_05` e `hamper_03`/`hamper_04`. A fase 3 inclui pelo menos quatro itens de dificuldade 3.
- **Ranking:** local, com as 20 melhores carreiras completas. O desempate considera primeiro os acertos na primeira tentativa e depois o resultado mais antigo. O nome é opcional (até 24 caracteres, “Participante” por padrão) e cada carreira é registrada uma única vez. Pode ser limpo nas configurações, com confirmação.
- **Persistência:** a carreira é retomada exatamente onde parou, inclusive entre tentativas. Dados corrompidos ou adulterados são descartados. Se o armazenamento falhar, o jogo avisa e continua. Carreira e ranking são separados por versão de conteúdo e de regras.
- **Acessibilidade:** o jogo aceita toque, arraste (Pointer Events), mouse e teclado. Tem foco visível e diálogos nativos. O feedback usa texto e ícone, não apenas cor ou som. Oferece som desativável e redução de movimento (preferência própria e `prefers-reduced-motion`).
- **PWA:** o status “Pronto para uso offline” só aparece depois do cache. A atualização é oferecida fora da tela de jogo e exige confirmação. O jogo não faz nenhum pedido externo.

## 3. Conteúdo

São 52 itens com IDs originais preservados (`docs/conteudo-original.json`), distribuídos em 8 destinos. **45 estão habilitados** e todos aparecem em ao menos uma fase. **7 estão suspensos** por ambiguidade: `white_04`, `white_07`, `white_12`, `red_02`, `red_03`, `green_06` e `green_08`. Os suspensos não pontuam e, no gabarito, aparecem apenas para discussão, sem resposta.

| Destino | Itens | Habilitados |
|---|---:|---:|
| Saco branco leitoso | 15 | 12 |
| Hamper (roupa para lavanderia) | 9 | 9 |
| Saco vermelho | 3 | 1 |
| Saco verde | 9 | 7 |
| Saco preto | 8 | 8 |
| Perfurocortantes | 6 | 6 |
| Vidros (frasco-ampola) | 1 | 1 |
| Vidros (frasco-ampola) químico | 1 | 1 |

Fases: fase 1 com 18 itens de dificuldade 1; fase 2 com 19 itens de dificuldade 2; fase 3 com 27 itens de dificuldade 2 e 3.

Todos os 52 itens estão marcados como **pendentes de aprovação**. A interface mostra o selo “Conteúdo em validação” e ele só sai quando o importador receber `APROVADO` para todos os itens.

## 4. Verificação executada

| Verificação | Resultado |
|---|---|
| `tsc` (tipos) | sem erros |
| `npm test` (Vitest) | **35 testes passaram** em 6 arquivos: pontuação, sessão, carreira/ranking, persistência/corrupção, integridade do conteúdo e importador do DEPE |
| `npm run build` | 26 arquivos pré-cacheados (~3,1 MB); gabarito com 1,5 MB |
| `npm run test:e2e` (Playwright, Chrome) | **10 testes passaram** |

Os testes de navegador cobrem:

- carreira completa com 3.000 pontos, ranking, nome com HTML exibido como texto e novo participante;
- erros com redução de pontos e retomada após recarregar entre tentativas;
- reprovação com 5 acertos, bloqueio da fase seguinte e repetição sem somar a pontuação anterior;
- prática por toque em celular (390×844) sem alterar a carreira e sem rolagem horizontal;
- arraste até o destino e cancelamento do arraste sem pontuar;
- reabertura offline depois do cache, sem pedidos externos;
- **publicação em subdiretório** (`/residuos/`, como no GitHub Pages): escopo do service worker, recursos sem 404 e modo offline;
- telas de 1280×800, 800×1280 e 1920×1200 sem transbordamento, com os 8 destinos;
- gabarito aberto por `file://` com a rede desligada, revelando em etapas e com casos suspensos sem resposta;
- armazenamento indisponível sem impedir o treino.

Capturas revisadas: `output/home-*.png`, `output/game-*.png`, `output/mobile-feedback.png`, `output/guide-pending.png`.

**Não verificado** (a emulação não substitui):

- tablet físico: instalação real, áudio, arraste com o dedo, rotação e atualização de versão;
- Safari/iPad;
- leitores de tela.

## 5. Critérios do prompt inicial e de `docs/08_TESTES_E_ACEITE.md`

| Critério | Situação |
|---|---|
| `npm test` e `npm run build` passam | Atendido |
| PWA instalável | Manifesto, ícones e service worker válidos. O botão “Instalar jogo” aparece quando o navegador oferece. Falta confirmar em tablet físico |
| Jogável offline após a primeira visita, sem pedidos externos | Atendido (Chromium automatizado) |
| Toque, mouse e arraste; toque direto no destino | Atendido |
| Feedback de acerto e erro (texto, ícone, som, confete) | Atendido |
| Todos os itens disponíveis no jogo | Os 45 habilitados estão distribuídos nas fases. Os 7 suspensos ficam de fora até decisão do DEPE |
| Som desligável e redução de animações | Atendido |
| Selo “Conteúdo em validação” | Atendido |
| `IMPLEMENTATION_REPORT.md` | Este arquivo |
| Bônus de sequência | Substituído pelas regras 100/60/30 do plano aprovado |
| Guia “RESI”, modos “Treino/Desafio” e tela “Aprender” | Substituídos, pelo plano, pela guia Nery, pelos modos Carreira/Fases e pelo gabarito independente, que fica fora do jogo |
| Repetir apenas itens errados; histórico das últimas sessões; exportar resultados em CSV/JSON | Não previstos no plano aprovado; **não implementados** |
| Aprovação do conteúdo pelo DEPE | **Pendente** (humano) |

## 6. Pendências antes de produção

1. **Aprovação do conteúdo pelo DEPE/PGRSS:** revisar os 52 itens e decidir os 7 suspensos. O fluxo está em `docs/COMO_VALIDAR_E_PUBLICAR.md`.
2. **Arte final:**
   - a geração de imagens retornou HTTP 401 e nenhuma arte 3D original foi produzida;
   - os itens usam recortes do gabarito em PDF e a Nery é um retrato provisório; os direitos de distribuição não foram confirmados;
   - faltam 52 itens, a Nery com poses e os recipientes (ver `docs/ASSETS_PENDENTES.md`). O código já usa `item.image` quando existir.
3. **Homologação em tablet físico,** com pessoas da DEP, da assistência e alguém que nunca viu o jogo físico.
4. **Publicação:** falta definir o repositório e a conta. O workflow do Pages é manual e não foi executado.
5. **Controle de versão:** o repositório Git ainda não tem nenhum commit.

## 7. Como homologar

```powershell
npm ci
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

- Testes de navegador: `npm run test:e2e`. Se o Chromium do Playwright não estiver instalado, use o Chrome ou o Edge da máquina: `$env:PW_CHANNEL='chrome'; npm run test:e2e`.
- Gabarito: abra `output/gabarito/Destino-Certo-Gabarito-DEPE.html` diretamente, também a partir de um pendrive.
- Tablet: hospede `dist/` em HTTPS, aguarde “Pronto para uso offline”, instale, desligue a rede, feche e reabra o app, e jogue uma carreira completa.
