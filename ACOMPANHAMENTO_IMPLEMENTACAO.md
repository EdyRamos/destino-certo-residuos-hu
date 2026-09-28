# Acompanhamento da implementação

Plano de referência: `PLANO_IMPLEMENTACAO.md`.

## Estado atual

Implementação concluída para homologação interna (ver `IMPLEMENTATION_REPORT.md`). Conteúdo ainda não aprovado pelo DEPE; arte final 3D pendente.

## Registro por item

### 1. Preparação — concluída
- Conferidos plano, estrutura e pontos de integração do protótipo.
- Criado este registro para atualizar cada entrega, suas verificações e o próximo passo.
- Próximo passo: revisar fontes oficiais, estruturar o conteúdo de homologação e instalar dependências.

## Checklist
- [x] Preparação e acompanhamento
- [x] Revisão preliminar do conteúdo e planilha DEPE
- [ ] Identidade visual e assets (logos e paleta aplicados; arte 3D final bloqueada pela geração de imagens)
- [x] Motor de tentativas, fases e carreira
- [x] Persistência e ranking
- [x] Interface responsiva e acessibilidade
- [x] Gabarito HTML independente
- [x] PWA e distribuição (pacote preparado; publicação não executada)
- [x] Testes automatizados e verificação visual
- [x] Documentação de entrega

### 2. Motor de regras — implementado, aguardando testes integrados
- Separadas tentativas e avanço de pergunta. Pontuação 100/60/30/0, bloqueio de tentativa repetida e aprovação por seis acertos.
- Criados resultados por fase, carreira e ranking determinístico com desempate e limite de vinte.
- Próximo passo: persistência validada, integração das telas e testes do motor.

### 3. Revisão preliminar — concluída
- Consultada RDC 222/2018 comentada diretamente no portal da Anvisa; registrada a fonte e a limitação da consulta.
- Preservados 52 registros originais, acrescentados cenários, dicas, dificuldade e notas de revisão.
- Sete casos ambíguos suspensos das partidas até definição do DEPE. Os outros 45 continuam como propostas de homologação.
- Próximo passo: exportar planilha com propostas e implementar importação validada.

### Pendência externa: geração de imagens
- A ferramenta de geração retornou HTTP 401 (falha de autenticação do serviço).
- Não foi usada API alternativa nem solicitado segredo ao usuário. Arte 3D final não foi gerada.
- Próximo passo: preparar interface e manifesto de assets; retomar geração quando o serviço estiver disponível.

### Infraestrutura
- Dependências instaladas e atualizadas para versões disponíveis compatíveis; auditoria npm retornou zero vulnerabilidades após atualização.
- Git inicializado sem publicação ou remoto.

### 4. Planilha DEPE e importação — implementadas
- CSV UTF-8 com separador ponto e vírgula, 52 registros, campos originais preservados e proposta revisada.
- Importação oferece prévia, valida IDs/destinos/campos, exige versão nova para aplicar e salva cópia anterior.
- Casos suspensos só podem ser habilitados por decisão APROVADO.
- Próximo passo: testar rejeição de alterações inválidas e geração da prévia.

### 5. Persistência e ranking — implementados
- Retomada de carreira inclusive entre tentativas; dados validados ao carregar.
- Prática separada; vinte carreiras por versão de conteúdo/regras; nome opcional e prevenção de duplicatas.
- Preferências de som e movimento persistidas; falha de armazenamento informada sem interromper a atividade.
- Próximo passo: testes de corrupção, desempate e carreira completa.

### 6. Interface — implementada com arte provisória
- Início, modos, fases, jogo, feedback, resultados, ranking, orientações, pausa e configurações.
- Logos oficiais aplicados. Foto correta do hamper. Nery e itens visualizados a partir das referências fornecidas para homologação interna.
- Arraste com cancelamento, seleção por botão, diálogos nativos e redução de movimento.
- Próximo passo: revisar layouts no navegador e substituir arte provisória quando geração estiver disponível.

### 7. Gabarito independente — implementado
- Gerador produz HTML único com imagens embutidas, filtros, busca, navegação e revelação por etapas.
- Casos suspensos aparecem somente por escolha da apresentadora e não revelam resposta categórica.
- Próximo passo: testar abertura direta por arquivo com rede desligada.

### 8. Verificação inicial — concluída
- 28 testes unitários passaram.
- Oito testes de navegador passaram: carreira completa, ranking, erros/retomada, reprovação, prática por toque, arraste, offline, múltiplas resoluções e gabarito por arquivo local.
- Capturas revisadas; corrigido carregamento relativo da referência visual e atributo hidden que era sobreposto pelo CSS.
- Nery provisória limitada a retrato, eliminando reprodução do logo errado do jaleco; corpo e poses finais continuam pendentes.
- Próximo passo: testar pares pedagógicos, importador, hospedagem em subdiretório e pacote final após os ajustes.

### 9. PWA e distribuição — implementadas
- Build gera cache local (~3 MB) e gabarito independente (~1,5 MB).
- Reabertura offline confirmada em Chromium automatizado; nenhum pedido externo necessário ao jogo ou ao gabarito.
- Documentadas instalação, revisão CSV, GitHub Pages e Cloudflare; workflow manual preparado, sem publicação externa.
- Próximo passo: finalizar relatório e repetir as verificações afetadas pelos últimos ajustes.

### 10. Retomada e fechamento — concluída
- Sessão anterior interrompida após o item 9. Estado conferido: tipos, testes e build sem erros.
- Corrigida codificação dupla em `src/data/levels.json` (nomes e descrições das fases apareciam como "ReconheÃ§a", "AtenÃ§Ã£o", "PlantÃ£o" no jogo). Teste de integridade passa a rejeitar esse defeito nos JSON de conteúdo.
- Playwright aceita `PW_CHANNEL=chrome` ou `msedge` para usar o navegador instalado, sem baixar o Chromium.
- Hospedagem em subdiretório (`/residuos/`, como GitHub Pages) passou a ser teste automatizado: escopo do service worker, recursos sem 404 e reabertura offline.
- Verificação final: 35 testes unitários e 10 de navegador passaram; build e gabarito regenerados; tela de fases conferida visualmente.
- Entregue `IMPLEMENTATION_REPORT.md`; atualizados CHANGELOG, README e instruções de validação.
- Próximo passo (humano): devolução da planilha pelo DEPE, arte final e homologação em tablet físico.

### 11. Repositório e publicação da homologação — concluída
- Primeiro commit em `main`; repositório público https://github.com/EdyRamos/destino-certo-residuos-hu.
- GitHub Pages habilitado (origem GitHub Actions); workflow manual executado com sucesso, incluindo `npm test` e build no Linux.
- Jogo: https://edyramos.github.io/destino-certo-residuos-hu/ — conferido no Chrome: escopo do service worker, manifesto, uso offline e ausência de pedidos externos.
- Pré-lançamento v0.9.0 com gabarito HTML e pacote `dist` compactado para hospedagem própria.
- Próximo passo: homologação em tablet físico e devolução da planilha pelo DEPE.

### 12. Direção de arte e missão Nery — em implementação (28/09/2026)
- Versão de trabalho confirmada pelo usuário; sincronizado o ajuste de README de origin/main.
- Geração integrada de imagens voltou a funcionar: nova Nery, hamper metálico com tecido e conjunto dos oito destinos, com arquivos independentes e transparência.
- Narrativa criada em três capítulos, sem alterar classificação clínica, pontuação, aprovação ou ranking.
- Em integração: abertura das missões, revisão dos erros, conquistas por capítulo e trilha procedural opcional, separada dos efeitos.
- Próximo passo: otimizar as artes, renovar ilustrações dos itens e testar experiência, áudio e funcionamento offline.

### 13. Narrativa, áudio e aprendizagem — implementados (28/09/2026)
- Abertura por capítulo com Nery, situação de plantão e objetivo explícito. Retomadas preservam a pergunta, sem repetir a abertura.
- Conquistas simbólicas por fase aprovada; revisão expansível dos itens que exigiram novas tentativas ou foram errados. Pontos e critérios de aprovação preservados.
- Trilha procedural original e leve, ativada pelo participante, independente dos efeitos. Pausa em diálogos e abas ocultas; preferências anteriores são migradas sem perder som/animações.
- Entrada suave de personagens e perguntas, profundidade nos botões e resposta visual dos destinos; redução de movimento do sistema e do jogo respeitada.
- Verificação: 39 testes unitários passaram, incluindo início de áudio por gesto, interrupção e ausência de suporte; nove fluxos de navegador passaram. Ajustando o teste de armazenamento para atravessar a nova abertura de missão.
- Próximo passo: terminar a substituição dos itens ativos e verificar novamente o pacote completo com todas as artes.

### 14. Camada de jogo, trilha e pipeline de artes — implementados (28/09/2026)
- Retomada após a queda da sessão anterior: estado conferido (tipos, 39 testes unitários, build e 11 fluxos de navegador passando); três artes pendentes convertidas (21/45 itens com arte).
- Jogo: voo do item até o coletor, reação do coletor, "+pontos", placar animado, trilha de progresso por item, sequência de acertos de primeira e dicas gerais da Nery. Após o terceiro erro, o item é levado ao destino correto antes da explicação.
- Narrativa: três falas digitadas por capítulo; poses da Nery por situação com reserva automática enquanto as artes não chegam.
- Recompensas simbólicas: estrelas (1 a 3), medalhas de capítulo, conquistas por fase, mapa da jornada com estrelas e final com troféu. Pontuação, aprovação e ranking inalterados.
- Coleção da equipe: itens descobertos no aparelho, com silhuetas dos não descobertos, reabertura das explicações e limpeza nas configurações.
- Áudio: temas de menu, jogo e final; música ligada por padrão após o primeiro toque, abaixada nos diálogos e parada na pausa; novos efeitos.
- Artes: `npm run art` com versões por arquivo (a mais alta vence), recorte de fundo liso testado, manifesto, cenários, poses e medalhas. Lista para o Leonardo AI em `docs/LEONARDO_ASSETS.md`.
- Coletores de vidro: o usuário pediu a troca pelas fotos reais dos recipientes do HU; aguardando os arquivos `docs/art/vial-glass-v2.png` e `docs/art/vial-chemical-v2.png`.
- Próximo passo: integrar as artes do Leonardo e as fotos dos coletores, conferir no catálogo e homologar som e movimento em tablet físico.

### 15. Artes completas e publicação da 0.10.0 — concluída (28/09/2026)
- Coletores de vidro substituídos pelas fotos reais dos recipientes do HU enviadas pelo usuário.
- 30 figuras do ChatGPT (`docs/figuras_Chatgpt`) conferidas uma a uma contra nome e condição e renomeadas em `docs/art`: 24 itens, 4 cenários (início e capítulos) e 2 medalhas (capítulos 1 e 2). Seis poses da Nery também integradas.
- Itens do jogo com arte própria: 45/45. Recortes do PDF permanecem só para os 7 casos suspensos no gabarito.
- Revisar: `green_07` (garrafa aparenta conter água; condição diz embalagem limpa) e `red_01` (braço parece de pessoa viva com manga, não peça anatômica). Conferir também a marca do HU gerada nos jalecos das poses.
- Correções: cenário com URL absoluta (URL relativa em variável CSS resolvia a partir da pasta do CSS), enquadramento do rosto no avatar e largura do cartão do item em telas estreitas.
- Originais PNG (84 MB) mantidos fora do Git, no OneDrive; o jogo usa `public/art` (3,2 MB).
- Verificação: 52 testes unitários e 11 fluxos de navegador passaram; telas revisadas em 1280×800, 800×1280 e 390×844.

### 16. Revisão de layout, UX e UI — concluída (28/09/2026)
- Nery com partes apagadas: as 6 poses chegaram com fundo branco sólido e o recorte automático apagava o jaleco onde o branco encosta no fundo. O recorte passou a selar o contorno antes de remover o fundo; teste reproduz o caso. Ideal: poses com fundo transparente na origem.
- Ícones: engrenagem refeita; música como ícone com estado ligado/desligado (antes "♫ Ligada", um caractere de texto); carreira com ícone de rota.
- Diagramação: folha de estilos única com escalas fixas de tipografia, espaçamento, 3 raios e 2 sombras, substituindo camadas sobrepostas. Fonte Lexend (OFL) embutida para funcionar offline e igual em todos os tablets.
- Textos: títulos diretos em todas as telas, sem rótulos em caixa-alta nem slogans; termo "capítulo" unificado; modo de prática renomeado para "Treino livre".
- Jogo: tentativa atual e quanto ela vale ficam visíveis; dica de arrastar só nos dois primeiros itens; explicação mostra o par item → destino.
- Tela inicial com uma ação principal e atalhos compactos; tablet em pé com layout empilhado; nomes longos dos coletores sem corte no celular; configurações com chaves liga/desliga; medalhas num único estilo até o conjunto de artes estar completo.
- Verificação: 53 testes unitários e 11 fluxos de navegador; telas revisadas em 1280×800, 800×1280 e 390×844.
