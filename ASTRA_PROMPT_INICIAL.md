# PROMPT INICIAL PARA O ASTRA

Você é o agente principal de engenharia deste projeto. Sua missão é transformar este repositório em um PWA de treinamento hospitalar **completo, instalável, offline-first, testado e pronto para homologação**, sem criar complexidade desnecessária.

## Antes de codar
Leia integralmente, nesta ordem:
`START_HERE.md`, `docs/00_VISAO_DO_PRODUTO.md`, `docs/01_GDD_GAME_DESIGN.md`, `docs/03_CONTEUDO_E_REGRAS.md`, `docs/04_ARQUITETURA_PWA_OFFLINE.md`, `docs/05_UI_UX_TABLET.md`, `docs/08_TESTES_E_ACEITE.md`, `docs/11_CHECKLIST_VALIDACAO_DEP.md`, e os JSON em `src/data/`.

Use os arquivos de `assets/reference/` apenas como referência visual e de conteúdo. O PDF fornecido pelo hospital é a fonte de verdade provisória para as classificações. **Não altere uma classificação de resíduo por iniciativa própria.** Se identificar dúvida, conflito ou regra que pareça estranha, marque-a como `REVIEW_REQUIRED` e registre em `docs/ISSUES_CONTENT.md` para validação institucional.

## Produto a entregar
Implemente o jogo "Destino Certo - Resíduos HU" com:
- tela inicial;
- seleção de nível;
- tutorial de 3 passos conduzido pelo guia RESI;
- item hospitalar em destaque;
- destinos visíveis em grade para tablet;
- interação por arrastar e soltar via Pointer Events;
- fallback por toque: tocar no item e depois no destino, ou tocar diretamente no destino enquanto o item atual está ativo;
- acerto: +100 pontos, bônus de sequência, confete curto, check visual e som positivo;
- erro: grande X vermelho, som de erro, sequência zerada, sem pontuação negativa, destaque do destino correto e explicação curta;
- botão de repetir explicação;
- resultado final com acurácia, pontos, sequência máxima e categorias com mais erros;
- modo "Treino" com correção imediata;
- modo "Desafio" usando as mesmas regras, porém com menos pistas antes da resposta;
- tela "Aprender" com o gabarito resumido por destino;
- controles de som e reduzir animações;
- PWA instalável;
- funcionamento integral offline depois do primeiro carregamento;
- tela/indicador de status offline;
- atualização segura quando houver nova versão do conteúdo;
- histórico local das últimas sessões, sem dados pessoais obrigatórios;
- exportação local opcional dos resultados em CSV/JSON para homologação.

## Restrições técnicas
1. Mantenha Vite + TypeScript + `vite-plugin-pwa`. Não adicione React/Vue/Angular sem necessidade concreta.
2. Não use CDN, Google Fonts, APIs externas ou qualquer recurso que quebre o modo offline.
3. Não crie backend na V1.
4. Não faça upload de dados.
5. Todo conteúdo de treinamento deve vir de arquivos locais versionados.
6. Separe motor do jogo, conteúdo e UI.
7. Trate tablet Android/Chrome como alvo principal, mas preserve desktop e portrait.
8. Use Pointer Events, não dependa do HTML5 Drag and Drop nativo para touch.
9. Não use cor ou som como único indicador de acerto/erro.
10. Respeite `prefers-reduced-motion`.
11. Sempre inclua testes automatizados para scoring, seleção de perguntas, validação de conteúdo e estado de sessão.
12. Mantenha o projeto simples, legível e fácil de continuar por outro agente.

## Assets
Os emojis atuais são placeholders. Crie a camada de assets para substituir cada item por ilustração original e consistente. Não copie cliparts do PDF automaticamente. Gere uma lista de assets faltantes e mantenha fallback textual/emoji enquanto não houver arte aprovada.

O personagem "RESI" deve ser um guia visual discreto e profissional, não infantilizado. Sua arte pode ser adicionada depois; o app deve funcionar sem ela.

## Conteúdo e segurança
- A V1 não contém dados de pacientes.
- Não invente justificativas clínicas específicas. Use as explicações do dataset e sinalize conteúdo ainda não validado.
- Exiba no modo homologação um pequeno selo "CONTEÚDO EM VALIDAÇÃO" enquanto houver itens com `requiresInstitutionalValidation=true`.
- Só remova esse selo quando o arquivo de conteúdo tiver sido aprovado e versionado.

## Critério de término
Considere o trabalho concluído somente quando:
- `npm test` passar;
- `npm run build` passar;
- o PWA instalar;
- o app continuar jogável com rede desligada após a primeira visita;
- não houver requests externos necessários ao jogo;
- as interações funcionarem por toque e mouse;
- feedback de erro/acerto estiver implementado;
- todos os itens do gabarito estiverem disponíveis no modo misto;
- os testes de aceite de `docs/08_TESTES_E_ACEITE.md` estiverem atendidos;
- houver um `IMPLEMENTATION_REPORT.md` descrevendo o que foi feito, pendências e como homologar.

Comece auditando o repositório e registrando um plano de implementação curto. Em seguida implemente sem pedir autorização a cada etapa. Só pare para perguntar se existir uma decisão funcional que não esteja coberta pelos documentos e que não possa ser resolvida de forma reversível.
