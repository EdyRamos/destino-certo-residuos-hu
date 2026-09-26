# START HERE - Jogo de Resíduos HU (PWA offline-first)

Este repositório é um **pacote de partida para um agente de desenvolvimento (Astra/Codex/Claude Code)** implementar o jogo digital de descarte de resíduos do Hospital Universitário.

## Objetivo
Transformar o jogo físico fornecido pela Divisão de Ensino e Pesquisa em um PWA instalável em tablet, com funcionamento offline após o primeiro carregamento, feedback imediato, pontuação e conteúdo versionável.

## Ordem obrigatória de leitura para o agente
1. `ASTRA_PROMPT_INICIAL.md`
2. `docs/00_VISAO_DO_PRODUTO.md`
3. `docs/01_GDD_GAME_DESIGN.md`
4. `docs/03_CONTEUDO_E_REGRAS.md`
5. `docs/04_ARQUITETURA_PWA_OFFLINE.md`
6. `docs/05_UI_UX_TABLET.md`
7. `docs/08_TESTES_E_ACEITE.md`
8. `docs/11_CHECKLIST_VALIDACAO_DEP.md`
9. `src/data/*.json`

## Fonte de verdade de conteúdo
O arquivo institucional enviado está em `assets/reference/A4 GABARITO JOGO RESÍDUOS PEÇAS.pdf`.

**Atenção:** o conteúdo do jogo foi transcrito desse gabarito. Antes de colocar o jogo em produção, a Divisão de Ensino e Pesquisa e os responsáveis institucionais pelo gerenciamento de resíduos devem validar as classificações e os textos explicativos. O agente não deve "corrigir" a classificação por conta própria com base em conhecimento genérico externo.

## Estratégia técnica
- PWA estático, tablet-first, sem backend na V1.
- Vite + TypeScript + `vite-plugin-pwa`.
- Sem CDN, fontes externas ou assets remotos.
- Conteúdo local em JSON.
- Pontuação e histórico armazenados localmente.
- Preparado para futura sincronização quando houver rede, sem tornar isso dependência da V1.

## Primeiro comando
```bash
npm install
npm run dev
```

## Resultado esperado
Uma experiência simples: pegar/arrastar ou tocar em um item, escolher o destino, receber feedback claro e aprender a regra correta sem interromper a sessão.
