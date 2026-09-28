# Arte e gamificação — Missão Nery

Atualização iniciada em 28/09/2026, sobre a versão confirmada pelo usuário nesta pasta. Nada aqui altera classificação, pontuação (100/60/30), critério de aprovação (6 de 10) ou ranking: estrelas, medalhas e coleção são recompensas simbólicas.

## Direção visual

Personagens e materiais são ilustrações raster em estilo 3D, com volume, materiais reconhecíveis e iluminação suave. São sprites, não modelos 3D animados. O verde institucional permanece na interface, com azul-petróleo na roupa da Nery e amarelo nas conquistas.

- **Nery:** educadora adulta, cabelo castanho preso, jaleco branco, roupa azul-petróleo e tablet. A marca no jaleco da arte atual foi gerada a partir da referência oficial e precisa de conferência institucional; as novas poses devem vir sem marca (ver `docs/LEONARDO_ASSETS.md`). Os logos do cabeçalho e dos créditos são os arquivos originais.
- **Destinos:** sacos com textura plástica e símbolos reconhecíveis; hamper com estrutura tubular, rodízios e saco de tecido. Os coletores de vidro devem usar as fotos reais dos recipientes do HU (`vial-glass-v2`, `vial-chemical-v2`). Ilustração não é especificação de compra nem autorização de procedimento.

## Sistema visual

- Uma folha de estilos (`src/styles.css`) com escalas fixas: tipografia (`--t-*`), espaçamento (`--s-*`), três raios (`--r-sm`, `--r-md`, `--r-lg`) e duas sombras. Novas telas devem reutilizar esses tokens em vez de valores soltos.
- Fonte Lexend (licença OFL), embutida no pacote a partir de `@fontsource-variable/lexend` (subconjunto latino, cerca de 40 KB).
- Títulos diretos e funcionais; rótulos pequenos apenas quando informam contexto (ex.: "Capítulo 1 · Começo do plantão").
- Decoração só onde comunica algo: cenário do capítulo, plataforma da Nery e recompensas.

## Narrativa e mecânica

| Capítulo | Contexto | Objetivo | Medalha |
|---|---|---|---|
| 1 | Começo do plantão | Reconhecer item e condição antes de escolher | Olhar atento |
| 2 | Durante o cuidado | Comparar uso, material e contaminação | Atenção aos detalhes |
| 3 | Plantão completo | Reunir os aprendizados e justificar a escolha | Cuidado em equipe |

- **Missão:** cada capítulo abre com Nery conversando em três falas digitadas (o botão “Começar missão” fica sempre disponível). Retomar uma carreira volta direto à pergunta salva.
- **Durante o jogo:** Nery acompanha a pergunta com uma dica geral do capítulo (sem revelar resposta) e comemora sequências de acertos na primeira tentativa. A trilha de progresso mostra cada item: verde (de primeira), amarelo (após dica) e rosado (errado).
- **Resposta:** no acerto, o item voa para o coletor, que “engole” o item, solta faíscas e mostra “+100/+60/+30”; o placar conta até o novo valor. No erro, o item bate no coletor e volta. Após o terceiro erro, o jogo mostra o item indo para o destino correto antes da explicação.
- **Explicação:** o diálogo mostra a Nery na pose correspondente (comemorando, pensando ou incentivando), o destino correto com a sua imagem e a explicação do banco de conteúdo.
- **Resultado da fase:** 1 a 3 estrelas (★ aprovado; ★★ 8 acertos; ★★★ 10 acertos e 900 pontos), medalha do capítulo e conquistas: *Fase perfeita* (10 de primeira), *Sequência de primeira* (5 ou mais seguidos) e *Aprendeu com o erro* (acertou depois de uma dica). A revisão dos itens que exigiram atenção continua disponível.
- **Mapa da jornada:** mostra onde o participante está, as estrelas por capítulo e o total (até 9).
- **Final da carreira:** Nery com troféu, medalha *Carreira completa*, chuva de confete e contagem da pontuação.
- **Coleção da equipe:** todo item que recebe o destino certo neste aparelho entra na coleção (carreira ou prática). Itens não descobertos aparecem como silhueta, sem nome nem destino. Tocar num item descoberto reabre a explicação. A coleção é do aparelho (serve à turma) e pode ser limpa nas configurações.

## Movimento e áudio

- Todas as animações param com “Reduzir animações” ou com a preferência do sistema; nesse modo as respostas aparecem sem voo, contagem ou digitação.
- Trilha original sintetizada com Web Audio, sem arquivos nem internet, com três temas: **menu** (calmo), **jogo** (ritmado, com percussão leve) e **final** (festivo). A troca de tema acompanha a tela.
- Música **ligada por padrão**, mas só começa depois do primeiro toque; o botão ♫ no cabeçalho desliga na hora. Durante os diálogos ela abaixa de volume; na pausa e com a aba oculta ela para.
- Efeitos independentes da música: acerto (arpejo), tentativa (dois tons suaves), pegar o item, clique, contagem, estrela, medalha, fanfarra de fase e tom de incentivo na reprovação.
- Volume e conforto ainda devem ser experimentados nos tablets reais da turma.

## Arquivos e reprodução

- `docs/art/`: originais (`<chave>-v<N>.png|jpg|webp`) e prompts. A versão mais alta de cada chave vence.
- `npm run art`: converte para WebP em `public/art/`, recorta fundo liso quando a imagem não tem transparência (`scripts/cutout.mjs`), remove versões antigas publicadas, gera `src/data/art-manifest.json`, vincula itens e destinos e regenera o catálogo `output/Catalogo-de-artes.html`.
- Chaves reconhecidas: `nery-<pose>` (welcome, wave, celebrate, thinking, encourage, explain, trophy), `bg-home`, `bg-cap1..3`, `badge-<cap1|cap2|cap3|career|perfect|streak|learn>`, os IDs dos itens e os destinos (`white-bag`, `hamper`, `red-bag`, `green-bag`, `black-bag`, `sharps`, `vial-glass`, `vial-chemical`).
- Enquanto uma pose não existe, o jogo usa a Nery de apresentação com um gesto em CSS; sem cenário, usa o fundo padrão; sem medalha, usa a medalha vetorial.
- `src/game/story.ts`: falas, dicas gerais e objetivos. `src/game/achievements.ts`: estrelas e conquistas. `src/ui/fx.ts`: efeitos. `src/ui/audio.ts`: trilha e efeitos sonoros.

Depois de integrar novas artes: `npm run art`, `npm test`, `npm run build`. Não mudar a versão do conteúdo só por trocar imagens, pois isso separaria carreira, ranking e coleção salvos.

## Critérios de conferência das figuras

1. Item e estado devem concordar com o enunciado: vidro versus plástico; reutilizável versus descartável; vazio versus conteúdo residual; sangue absorvido versus líquido livre.
2. Seringa sem agulha não pode exibir agulha nem reservatório de sangue. Agulha e escalpe não devem mostrar mãos reencapando ou desconectando.
3. SMS tem textura não tecida, sem bainha de algodão. Compressas e roupas reutilizáveis precisam mostrar tecido e costura.
4. Anatomia é representada de maneira educativa, simplificada e sem sensacionalismo.
5. Nenhuma ilustração de pergunta inclui o recipiente correto, resposta, cor de moldura por categoria ou texto que entregue a decisão.
6. Coletores são reconhecidos por nome e símbolo, além da cor. Validação do fluxo e da representação local permanece com o DEPE.
