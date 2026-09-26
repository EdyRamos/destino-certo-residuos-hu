# Plano de implementação — Destino Certo: Resíduos HU-UEL

**Data:** 25/09/2026.  
**Status:** plano consolidado e salvo; implementação ainda não iniciada.

## 1. Objetivo e entregas

Transformar o protótipo existente em um jogo educativo responsivo, com prioridade para tablets, funcionamento offline e identidade visual baseada na primeira referência enviada.

Entregar:

- Jogo PWA com início, orientações, carreira, prática por fase, configurações e ranking.
- Identidade visual completa, personagem **Nery**, objetos e recipientes com volume em estilo 3D.
- Gabarito interativo independente em HTML, utilizável offline pelo pendrive.
- Conteúdo revisado preliminarmente, com planilha preparada para validação e devolução pelo DEPE.
- Testes, pacote de produção e instruções de instalação e atualização.

Manter Vite, TypeScript e tecnologias nativas do navegador. Não adicionar backend, login, publicidade ou serviços externos necessários durante o jogo.

## 2. Experiência visual e regras

### Identidade e interface

- Usar a primeira referência como direção: verde institucional, fundos claros, formas arredondadas e ambiente hospitalar discreto.
- Aplicar os logos oficiais fornecidos sem redesenhá-los ou deformá-los. HU nas telas; DEPE na abertura e nos créditos.
- Criar Nery no estilo 3D da referência, refinada, com poses de apresentação, orientação, acerto e incentivo. Aplicar o logo oficial ao jaleco como elemento gráfico controlado.
- Produzir imagens consistentes para os 52 itens e oito destinos, distinguindo condições como presença de sangue, material, integridade e conteúdo residual.
- Representar o hamper como suporte metálico com saco de tecido, conforme a foto enviada.
- Usar texto real da interface para nomes e instruções, evitando texto gerado dentro das ilustrações.
- Adaptar a disposição dos recipientes ao espaço disponível; manter toque, arraste, mouse e teclado utilizáveis.
- Incluir som desativável, redução de movimento, foco visível e feedback por texto e ícones.

### Carreira e prática

- Carreira com três fases sequenciais, dez perguntas por fase e dificuldade crescente.
- Fase 1: identificação direta. Fase 2: condições que alteram o destino. Fase 3: situações mistas e distinções mais difíceis.
- Cada pergunta admite três tentativas no mesmo item: **100, 60 e 30 pontos**, respectivamente. Após três erros, zero.
- Não aplicar bônus de sequência. Máximo de 1.000 pontos por fase e 3.000 por carreira.
- Antes de esgotar as tentativas, mostrar orientação sem revelar a resposta. Destinos já tentados ficam indisponíveis naquela pergunta.
- Após acerto ou terceiro erro, apresentar destino e explicação; avançar somente pelo botão “Continuar”.
- Aprovar com **seis ou mais itens acertados**, independentemente da tentativa. Exibir separadamente acertos na primeira tentativa, acertos totais e pontos.
- Avaliar a aprovação após as dez perguntas. Sem cronômetro.
- Na reprovação, explicar que faltou atingir 60% e retornar ao início após confirmação. Manter fases anteriores aprovadas e permitir repetir a fase pendente.
- Ao repetir uma fase reprovada, descartar sua pontuação anterior e sortear nova sequência.
- Prática permite escolher qualquer uma das três fases, sem alterar carreira ou ranking.
- Não repetir itens dentro da mesma fase. Balancear categorias e preservar contrastes pedagógicos; evitar repetições entre fases da mesma carreira quando houver itens suficientes.

### Progresso e ranking

- Salvar a carreira em andamento e oferecer “Continuar carreira” e “Nova carreira”.
- Nova carreira reinicia desbloqueios e pontos, preservando ranking e preferências.
- Após concluir as três fases, registrar uma única pontuação usando as execuções aprovadas de cada fase.
- Ranking local dos vinte melhores resultados, exclusivo de carreiras concluídas.
- Desempate: mais acertos na primeira tentativa; persistindo empate, manter primeiro o resultado mais antigo.
- Solicitar nome somente se houver entrada no ranking; nome opcional, limitado a 24 caracteres, com “Participante” como alternativa.
- Quem não entrar apenas visualiza o ranking e retorna ao início.
- Disponibilizar limpeza do ranking nas configurações, com confirmação.
- Informar que os resultados pertencem ao aparelho/navegador e podem desaparecer se seus dados forem apagados.

## 3. Conteúdo e gabarito para apresentação

### Revisão educativa

- Conferir os 52 itens contra o PDF, as fotos e fontes oficiais vigentes aplicáveis, incluindo orientações da Anvisa e normas pertinentes.
- Não usar as imagens conceituais como fonte de classificação.
- Registrar divergências entre o material institucional e as fontes consultadas. Não converter ambiguidades em respostas definitivas por suposição.
- Nos casos condicionais, explicitar no enunciado a condição que permite uma resposta única.
- Produzir explicações curtas e específicas, distinguindo descarte de encaminhamento de roupas ao hamper.
- Manter identificação de “conteúdo em validação” até a aprovação institucional.

### Dados e planilha

- Preservar identificadores estáveis dos itens.
- Ampliar o cadastro com dificuldade, condições relevantes, dica, explicação, referência técnica e status de revisão.
- Preparar a planilha com texto e destino originais, proposta revisada, justificativa, fonte, decisão do DEPE e observações.
- Criar importação validada das correções: rejeitar IDs desconhecidos, duplicados e destinos inválidos; apresentar diferenças antes da incorporação.
- Usar o mesmo conteúdo aprovado para jogo e gabarito, evitando versões divergentes.
- Versionar conteúdo e regras; resultados de versões incompatíveis não disputarão a mesma classificação.

### HTML independente

- Gerar um único arquivo HTML com conteúdo, imagens, estilos e scripts incorporados.
- Abrir diretamente por arquivo local, sem internet, instalação, servidor ou senha.
- Apresentar primeiro apenas o item e sua condição.
- Disponibilizar “Mostrar destinos”, “Revelar resposta” e “Mostrar explicação”, permitindo discussão antes da revelação.
- Incluir filtros por categoria, busca, anterior/próximo e seleção de situações com potencial de confusão.
- Usar controles grandes, navegação por teclado e apresentação adequada a datashow.
- Não incluir acesso ao gabarito dentro do jogo dos participantes.
- Não afirmar que um erro aconteceu na turma: a seleção de exemplos será feita pela apresentadora.

## 4. Implementação e distribuição

- Separar navegação, telas, motor de partidas, conteúdo e persistência, reduzindo a concentração atual da interface em um único módulo.
- Alterar os tipos de sessão para distinguir tentativa, pergunta concluída, resultado da fase e progresso da carreira.
- Registrar por pergunta os destinos tentados, tentativa do acerto e pontos; não avançar o índice a cada erro.
- Substituir a pontuação por sequência pelas regras aprovadas.
- Criar armazenamento versionado para preferências, carreira e ranking. Manter o histórico antigo separado, sem convertê-lo em pontuações comparáveis.
- Tratar armazenamento indisponível ou corrompido sem impedir o jogo, informando quando não for possível salvar.
- Corrigir cancelamento do arraste, entradas duplicadas, temporizadores e reutilização do contexto de áudio.
- Incluir todos os recursos essenciais no pacote offline, sem fontes, imagens ou scripts dependentes de CDN.
- Exibir “Pronto para uso offline” somente após confirmação do cache; oferecer atualizações fora de partidas ativas.
- Preparar publicação estática em HTTPS, com caminhos compatíveis com subdiretórios do GitHub Pages.
- Adotar GitHub Pages como alvo inicial de preparação, mantendo o pacote compatível com Cloudflare Pages. A publicação efetiva dependerá do repositório/conta de destino.
- Criar controle de versão e arquivo de dependências fixadas durante a implementação.

**Ordem de execução:** revisão e organização do conteúdo → sistema visual e assets → motor e telas → ranking e persistência → gabarito HTML → PWA e testes → entrega para homologação do DEPE → incorporação da revisão.

## 5. Verificação e critérios de entrega

- Testar 100/60/30/0 pontos, limite de tentativas, bloqueio de respostas repetidas e ausência de pontuação duplicada.
- Confirmar reprovação com cinco acertos e aprovação com seis, além de desbloqueio, repetição de fase e retomada após fechar o aplicativo.
- Confirmar isolamento entre prática e carreira, reinício para novo participante e cálculo de até 3.000 pontos.
- Testar ordenação, desempates, limite de vinte posições, nome opcional e registro único por carreira.
- Validar referências, condições dos itens, importação da planilha e correspondência entre jogo e gabarito.
- Verificar navegação completa por toque, mouse e teclado em tablet horizontal/vertical, celular e computador.
- Conferir legibilidade, logos, imagens e correspondência entre objeto apresentado e explicação.
- Testar instalação e reabertura offline após cache completo, incluindo todos os assets e fases.
- Abrir o gabarito por `file://`, com rede desligada, confirmando que nenhum recurso externo é necessário.
- Executar testes automatizados e build; registrar separadamente verificações em navegador e em dispositivo físico.
- Entregar instruções de instalação, limites do ranking local, planilha de revisão e relatório de pendências.

A primeira entrega será destinada à homologação. A aprovação técnica do conteúdo pelo DEPE será registrada antes de remover a indicação de validação pendente.
