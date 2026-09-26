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
- Próximo passo (humano): devolução da planilha pelo DEPE, arte final, homologação em tablet físico, escolha do repositório de publicação e primeiro commit.
